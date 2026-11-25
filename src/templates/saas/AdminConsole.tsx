import {Bell, ChartColumn, CreditCard, Ellipsis, Envelope, Gear, House, Layers, Lock, Persons, PersonPlus, Shield} from "@gravity-ui/icons";
import {Breadcrumbs, Button, Card, Chip, Description, Dropdown, Input, Label, ListBox, Modal, Select, Switch, Table, TextField, toast} from "@heroui/react";
import {useMemo, useState} from "react";
import {useText} from "../../site/Locale";
import {Delta, PersonAvatar, Segmented} from "../shell";
import {AuthLayout, ResetPasswordScreen, SignInScreen, SignOutDialog} from "./Auth";
import {AppSidebar, CommandMenu, CommandTrigger, CreateMenu, UserMenu, WorkspaceSwitcher, useDefaultCommands, type SidebarGroup} from "./Navigation";

type Role = "owner" | "admin" | "member" | "viewer";
type Member = {id: string; name: string; email: string; role: Role; status: "active" | "invited"; last: string};
const roleMeta: Record<Role, {en: string; zh: string; color: "accent" | "success" | "warning" | "default"}> = {
  owner: {en: "Owner", zh: "所有者", color: "accent"},
  admin: {en: "Admin", zh: "管理员", color: "success"},
  member: {en: "Member", zh: "成员", color: "default"},
  viewer: {en: "Viewer", zh: "访客", color: "warning"},
};
const seedMembers: Member[] = [
  {id: "u1", name: "Lin Wei", email: "lin@niltavi.com", role: "owner", status: "active", last: "Now"},
  {id: "u2", name: "Mira Chen", email: "mira@niltavi.com", role: "admin", status: "active", last: "2h"},
  {id: "u3", name: "Arjun Patel", email: "arjun@niltavi.com", role: "member", status: "active", last: "1d"},
  {id: "u4", name: "Sofia Lim", email: "sofia@niltavi.com", role: "member", status: "active", last: "3d"},
  {id: "u5", name: "Hana Sato", email: "hana@niltavi.com", role: "viewer", status: "invited", last: "—"},
];

function useGroups(): SidebarGroup[] {
  const text = useText();
  return useMemo(() => [
    {id: "main", items: [
      {id: "overview", label: text("Overview", "概览"), icon: House},
      {id: "analytics", label: text("Analytics", "分析"), icon: ChartColumn},
      {id: "projects", label: text("Projects", "项目"), icon: Layers, badge: 4},
    ]},
    {id: "admin", label: text("Workspace", "工作区"), items: [
      {id: "members", label: text("Members", "成员"), icon: Persons},
      {id: "settings-parent", label: text("Settings", "设置"), icon: Gear, children: [
        {id: "settings", label: text("General", "通用")},
        {id: "security", label: text("Security", "安全")},
        {id: "billing", label: text("Billing", "账单")},
      ]},
    ]},
  ], [text]);
}

/* ---------- Pages ---------- */
function OverviewPage() {
  const text = useText();
  const stats = [
    {en: "Active members", zh: "活跃成员", value: "24", delta: 9.1},
    {en: "Projects", zh: "项目", value: "12", delta: 4.0},
    {en: "Storage used", zh: "已用存储", value: "68%", delta: -2.3},
  ];
  return <div className="nt-page">
    <div className="nt-page__grid">
      {stats.map((s, i) => <Card key={s.en} className="tpl-kpi nt-fade-up" style={{"--i": i} as React.CSSProperties}>
        <span className="tpl-kpi__label">{text(s.en, s.zh)}</span><strong className="tpl-kpi__value">{s.value}</strong><span className="tpl-kpi__foot"><Delta value={s.delta} /> {text("this month", "本月")}</span>
      </Card>)}
    </div>
    <Card className="tpl-card nt-fade-up" style={{"--i": 3} as React.CSSProperties}>
      <div className="tpl-card__head"><div><h4>{text("Getting started", "快速上手")}</h4><p>{text("Three steps to set up your workspace", "三步完成工作区配置")}</p></div></div>
      <ol className="nt-checklist">
        <li data-done><span />{text("Create your workspace", "创建工作区")}</li>
        <li data-done><span />{text("Invite your team", "邀请团队成员")}</li>
        <li><span />{text("Connect a data source", "接入数据源")}</li>
      </ol>
    </Card>
  </div>;
}

function MembersPage({inviteOpen, setInviteOpen}: {inviteOpen: boolean; setInviteOpen: (v: boolean) => void}) {
  const text = useText();
  const [members, setMembers] = useState(seedMembers);
  const [filter, setFilter] = useState<"all" | "active" | "invited">("all");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [error, setError] = useState("");
  const list = members.filter((m) => filter === "all" || m.status === filter);

  const invite = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(text("Enter a valid email", "请输入有效的邮箱")); return; }
    const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setMembers((prev) => [...prev, {id: `u${Date.now()}`, name, email, role, status: "invited", last: "—"}]);
    setInviteOpen(false); setEmail(""); setError("");
    toast.success(text(`Invitation sent to ${email}`, `已向 ${email} 发送邀请`));
  };

  return <div className="nt-page">
    <div className="nt-page__head">
      <div><h3>{text("Members", "成员")}</h3><p>{text("Manage who can access this workspace.", "管理可以访问此工作区的成员。")}</p></div>
      <Button size="sm" onPress={() => setInviteOpen(true)}><PersonPlus aria-hidden="true" width={14} height={14} />{text("Invite", "邀请成员")}</Button>
    </div>
    <Segmented label={text("Filter", "筛选")} value={filter} onChange={setFilter} options={[{id: "all", label: text("All", "全部")}, {id: "active", label: text("Active", "已加入")}, {id: "invited", label: text("Invited", "待接受")}]} />
    <Card className="tpl-card nt-fade-up" key={filter}>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={text("Members", "成员")} className="min-w-[560px]">
            <Table.Header>
              <Table.Column isRowHeader>{text("Member", "成员")}</Table.Column>
              <Table.Column>{text("Role", "角色")}</Table.Column>
              <Table.Column>{text("Status", "状态")}</Table.Column>
              <Table.Column>{text("Last active", "最近活跃")}</Table.Column>
              <Table.Column className="text-end"><span className="sr-only">{text("Actions", "操作")}</span></Table.Column>
            </Table.Header>
            <Table.Body>
              {list.map((m) => <Table.Row key={m.id} id={m.id}>
                <Table.Cell><div className="flex items-center gap-3"><PersonAvatar name={m.name} /><div className="flex flex-col"><span className="text-sm font-medium">{m.name}</span><span className="text-xs text-muted">{m.email}</span></div></div></Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={roleMeta[m.role].color}>{text(roleMeta[m.role].en, roleMeta[m.role].zh)}</Chip></Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={m.status === "active" ? "success" : "warning"}>{m.status === "active" ? text("Active", "已加入") : text("Invited", "待接受")}</Chip></Table.Cell>
                <Table.Cell className="text-muted">{m.last === "Now" ? text("Now", "在线") : m.last}</Table.Cell>
                <Table.Cell className="text-end">
                  <Dropdown>
                    <Button isIconOnly size="sm" variant="ghost" aria-label={text(`Actions for ${m.name}`, `${m.name} 的操作`)} isDisabled={m.role === "owner"}><Ellipsis aria-hidden="true" width={16} height={16} /></Button>
                    <Dropdown.Popover placement="bottom end">
                      <Dropdown.Menu aria-label={text("Member actions", "成员操作")} onAction={(key) => {
                        if (key === "remove") { setMembers((prev) => prev.filter((x) => x.id !== m.id)); toast(text(`${m.name} removed`, `已移除 ${m.name}`)); }
                        else if (key in roleMeta) setMembers((prev) => prev.map((x) => x.id === m.id ? {...x, role: key as Role} : x));
                      }}>
                        <Dropdown.SubmenuTrigger>
                          <Dropdown.Item id="role" textValue={text("Change role", "修改角色")}><Label>{text("Change role", "修改角色")}</Label><Dropdown.SubmenuIndicator /></Dropdown.Item>
                          <Dropdown.Popover><Dropdown.Menu aria-label={text("Role", "角色")} selectionMode="single" selectedKeys={[m.role]} onAction={(key) => setMembers((prev) => prev.map((x) => x.id === m.id ? {...x, role: key as Role} : x))}>
                            {(["admin", "member", "viewer"] as Role[]).map((r) => <Dropdown.Item key={r} id={r} textValue={text(roleMeta[r].en, roleMeta[r].zh)}><Label>{text(roleMeta[r].en, roleMeta[r].zh)}</Label><Dropdown.ItemIndicator /></Dropdown.Item>)}
                          </Dropdown.Menu></Dropdown.Popover>
                        </Dropdown.SubmenuTrigger>
                        {m.status === "invited" ? <Dropdown.Item id="resend" textValue={text("Resend invite", "重新发送邀请")}><Label>{text("Resend invite", "重新发送邀请")}</Label></Dropdown.Item> : null}
                        <Dropdown.Item id="remove" textValue={text("Remove", "移除")} variant="danger"><Label>{text("Remove from workspace", "移出工作区")}</Label></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>)}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Card>
    <Modal.Backdrop isOpen={inviteOpen} onOpenChange={setInviteOpen}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[420px]">
          <Modal.Header><Modal.Heading>{text("Invite a member", "邀请成员")}</Modal.Heading><p className="text-sm text-muted">{text("They will get an email with a link to join.", "对方会收到一封带加入链接的邮件。")}</p></Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            <TextField isInvalid={!!error} value={email} onChange={(v) => { setEmail(v); setError(""); }} type="email" autoFocus>
              <Label>{text("Email", "邮箱")}</Label><Input placeholder="name@company.com" />
              {error ? <span className="field-error" data-visible>{error}</span> : <Description>{text("Separate with commas to invite several people.", "多个邮箱可用逗号分隔。")}</Description>}
            </TextField>
            <Select value={role} onChange={(key) => key && setRole(key as Role)}>
              <Label>{text("Role", "角色")}</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover><ListBox>{(["admin", "member", "viewer"] as Role[]).map((r) => <ListBox.Item key={r} id={r} textValue={text(roleMeta[r].en, roleMeta[r].zh)}>{text(roleMeta[r].en, roleMeta[r].zh)}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover>
            </Select>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="tertiary">{text("Cancel", "取消")}</Button>
            <Button onPress={invite}><Envelope aria-hidden="true" width={14} height={14} />{text("Send invite", "发送邀请")}</Button>
          </Modal.Footer>
          <Modal.CloseTrigger />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  </div>;
}

function SettingsPage({section}: {section: "settings" | "security" | "billing"}) {
  const text = useText();
  if (section === "security") return <div className="nt-page">
    <div className="nt-page__head"><div><h3>{text("Security", "安全")}</h3><p>{text("Protect access to your workspace.", "保护工作区的访问安全。")}</p></div></div>
    <Card className="tpl-card nt-settings nt-fade-up">
      {[{en: "Require two-factor authentication", zh: "强制两步验证", d: {en: "Members must set up 2FA before their next sign-in.", zh: "成员下次登录前必须开启两步验证。"}, on: true, icon: Shield},
        {en: "Single sign-on (SSO)", zh: "单点登录（SSO）", d: {en: "Allow sign-in through your identity provider.", zh: "允许通过企业身份提供方登录。"}, on: false, icon: Lock},
        {en: "Session timeout", zh: "会话超时", d: {en: "Sign members out after 12 hours of inactivity.", zh: "12 小时无操作后自动退出。"}, on: true, icon: Bell}].map((r, i) =>
        <div key={r.en} className="nt-settings__row nt-fade-up" style={{"--i": i} as React.CSSProperties}>
          <span className="tpl-activity__icon"><r.icon aria-hidden="true" width={14} height={14} /></span>
          <div><strong>{text(r.en, r.zh)}</strong><span>{text(r.d.en, r.d.zh)}</span></div>
          <Switch defaultSelected={r.on} aria-label={text(r.en, r.zh)}><Switch.Content><Switch.Control><Switch.Thumb /></Switch.Control></Switch.Content></Switch>
        </div>)}
    </Card>
  </div>;
  if (section === "billing") return <div className="nt-page">
    <div className="nt-page__head"><div><h3>{text("Billing", "账单")}</h3><p>{text("Your plan and payment method.", "当前套餐与付款方式。")}</p></div></div>
    <Card className="tpl-card nt-fade-up">
      <div className="tpl-card__head"><div><h4>{text("Pro plan", "专业版")}</h4><p>{text("$24 per member / month · renews Dec 1", "每位成员 $24 / 月 · 12 月 1 日续费")}</p></div><Button size="sm" variant="secondary">{text("Change plan", "更换套餐")}</Button></div>
      <div className="tpl-card-visual"><CreditCard aria-hidden="true" width={18} height={18} /><div><strong>•••• 4021</strong><span className="tpl-meta">{text("Expires 08/28", "有效期 08/28")}</span></div><Button size="sm" variant="ghost">{text("Update", "更新")}</Button></div>
    </Card>
  </div>;
  return <div className="nt-page">
    <div className="nt-page__head"><div><h3>{text("General", "通用设置")}</h3><p>{text("Workspace name, address and defaults.", "工作区名称、地址与默认选项。")}</p></div></div>
    <Card className="tpl-card nt-fade-up">
      <form className="nt-form" onSubmit={(e) => { e.preventDefault(); toast.success(text("Settings saved", "设置已保存")); }}>
        <TextField defaultValue="Niltavi"><Label>{text("Workspace name", "工作区名称")}</Label><Input /></TextField>
        <TextField defaultValue="niltavi"><Label>{text("Workspace URL", "工作区地址")}</Label><Input /><Description>app.niltavi.com/niltavi</Description></TextField>
        <Switch defaultSelected><Switch.Content><Switch.Control><Switch.Thumb /></Switch.Control>{text("Allow members to invite others", "允许成员邀请他人")}</Switch.Content></Switch>
        <div className="nt-form__actions"><Button type="reset" variant="tertiary" size="sm">{text("Reset", "重置")}</Button><Button type="submit" size="sm">{text("Save changes", "保存更改")}</Button></div>
      </form>
    </Card>
    <Card className="tpl-card nt-danger nt-fade-up" style={{"--i": 1} as React.CSSProperties}>
      <div className="tpl-card__head"><div><h4>{text("Delete workspace", "删除工作区")}</h4><p>{text("This removes all projects and data. It cannot be undone.", "这会删除所有项目和数据，且无法恢复。")}</p></div><Button size="sm" variant="danger-soft">{text("Delete", "删除")}</Button></div>
    </Card>
  </div>;
}

/* ---------- Composite console ---------- */
export function AdminConsole({onSignOut, account = "lin@niltavi.com"}: {onSignOut?: () => void; account?: string}) {
  const text = useText();
  const groups = useGroups();
  const commands = useDefaultCommands();
  const [page, setPage] = useState("members");
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const title = groups.flatMap((g) => g.items.flatMap((i) => [i, ...(i.children ?? []).map((c) => ({...c, parent: i.label}))])).find((i) => i.id === page);

  const run = (id: string) => {
    if (id === "signout") setSignOutOpen(true);
    else if (id === "invite") { setPage("members"); setInviteOpen(true); }
    else if (id === "doc") toast(text("New document created", "已新建文档"));
    else setPage(id);
  };

  return <div className="nt-console" data-collapsed={collapsed || undefined}>
    <AppSidebar groups={groups} active={page} onNavigate={setPage} collapsed={collapsed} onCollapsedChange={setCollapsed}
      header={<WorkspaceSwitcher compact={collapsed} />}
      footer={<UserMenu showName={!collapsed} placement="top start" email={account} onSignOut={() => setSignOutOpen(true)} onAction={(k) => k === "settings" && setPage("settings")} />} />
    <div className="nt-console__main">
      <header className="nt-console__top">
        <Breadcrumbs className="nt-crumbs">
          <Breadcrumbs.Item href="#" onClick={(e) => { e.preventDefault(); setPage("overview"); }}>Niltavi</Breadcrumbs.Item>
          {"parent" in (title ?? {}) && <Breadcrumbs.Item href="#" onClick={(e) => e.preventDefault()}>{(title as {parent: string}).parent}</Breadcrumbs.Item>}
          <Breadcrumbs.Item>{title?.label ?? ""}</Breadcrumbs.Item>
        </Breadcrumbs>
        <div className="nt-console__tools">
          <CommandTrigger onPress={() => setCmdOpen(true)} />
          <CreateMenu onAction={run} />
        </div>
      </header>
      <div className="nt-console__body" key={page}>
        {page === "members" ? <MembersPage inviteOpen={inviteOpen} setInviteOpen={setInviteOpen} />
          : page === "settings" || page === "security" || page === "billing" ? <SettingsPage section={page} />
          : <OverviewPage />}
      </div>
    </div>
    <SignOutDialog isOpen={signOutOpen} onOpenChange={setSignOutOpen} account={account} onConfirm={() => onSignOut?.()} />
    <CommandMenu isOpen={cmdOpen} onOpenChange={setCmdOpen} commands={commands} onRun={run} />
  </div>;
}

/**
 * SaaS back office in one window: sign in (code or password), reset password,
 * the admin console, and sign out back to the start.
 */
export function SaasTemplate() {
  const text = useText();
  const [view, setView] = useState<"signin" | "reset" | "app">("signin");
  const [account, setAccount] = useState("lin@niltavi.com");
  const [notice, setNotice] = useState("");
  return <div className="nt-saas" data-view={view}>
    {view === "app"
      ? <div className="nt-saas__app nt-fade-in"><AdminConsole account={account} onSignOut={() => { setNotice(text("Signed out.", "已退出登录")); setView("signin"); }} /></div>
      : <AuthLayout>
        {view === "signin"
          ? <SignInScreen key="signin" notice={notice} onSignedIn={(a) => { if (a) setAccount(a); setNotice(""); setView("app"); }} onForgot={() => { setNotice(""); setView("reset"); }} />
          : <ResetPasswordScreen key="reset" onBack={() => setView("signin")} onDone={() => { setNotice(text("Password updated.", "密码已更新")); setView("signin"); }} />}
      </AuthLayout>}
  </div>;
}
