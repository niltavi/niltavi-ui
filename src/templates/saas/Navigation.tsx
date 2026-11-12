import {ArrowRightFromSquare, Book, ChevronDown, ChevronsLeft, ChevronsRight, CircleQuestion, CreditCard, FileText, Gear, Keyboard, Magnifier, Moon, Person, PersonPlus, Plus, Folder} from "@gravity-ui/icons";
import {Avatar, Button, Dropdown, Header, Kbd, Label, ListBox, Modal, SearchField, Separator, Tooltip} from "@heroui/react";
import {useEffect, useMemo, useState, type ComponentType, type ReactNode, type SVGProps} from "react";
import {useText} from "../../site/Locale";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
export type SidebarItem = {id: string; label: string; icon: Icon; badge?: string | number; children?: {id: string; label: string}[]};
export type SidebarGroup = {id: string; label?: string; items: SidebarItem[]};

/* ---------- Sidebar ---------- */
export function AppSidebar({groups, active, onNavigate, collapsed, onCollapsedChange, header, footer, label}: {
  groups: SidebarGroup[];
  active: string;
  onNavigate: (id: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  header?: ReactNode;
  footer?: ReactNode;
  label?: string;
}) {
  const text = useText();
  const parentOf = (id: string) => groups.flatMap((g) => g.items).find((i) => i.children?.some((c) => c.id === id))?.id;
  const [open, setOpen] = useState<Set<string>>(() => new Set([parentOf(active) ?? ""]));
  const toggle = (id: string) => setOpen((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  const row = (item: SidebarItem) => {
    const current = active === item.id || item.children?.some((c) => c.id === active);
    const expanded = open.has(item.id);
    const button = <button type="button" className="nt-side__item nt-press" aria-current={active === item.id ? "page" : undefined} data-within={current && active !== item.id ? true : undefined}
      aria-expanded={item.children && !collapsed ? expanded : undefined}
      onClick={() => item.children && !collapsed ? toggle(item.id) : onNavigate(item.children && collapsed ? item.children[0].id : item.id)}>
      <item.icon aria-hidden="true" width={16} height={16} />
      <span className="nt-side__label">{item.label}</span>
      {item.badge !== undefined && <span className="nt-side__badge">{item.badge}</span>}
      {item.children && <ChevronDown aria-hidden="true" width={14} height={14} className="nt-side__chevron" />}
    </button>;
    return <li key={item.id}>
      {collapsed ? <Tooltip delay={200} closeDelay={0}>{button}<Tooltip.Content placement="right"><p>{item.label}</p></Tooltip.Content></Tooltip> : button}
      {item.children && !collapsed && <div className="nt-side__sub" data-open={expanded || undefined}>
        <ul>{item.children.map((c) => <li key={c.id}><button type="button" className="nt-side__subitem nt-press" aria-current={active === c.id ? "page" : undefined} tabIndex={expanded ? 0 : -1} onClick={() => onNavigate(c.id)}>{c.label}</button></li>)}</ul>
      </div>}
    </li>;
  };

  return <aside className="nt-side" data-collapsed={collapsed || undefined} aria-label={label ?? text("Sidebar", "侧边栏")}>
    {header && <div className="nt-side__header">{header}</div>}
    <nav className="nt-side__nav">
      {groups.map((g) => <div key={g.id} className="nt-side__group">
        {g.label && <span className="nt-side__heading">{g.label}</span>}
        <ul>{g.items.map(row)}</ul>
      </div>)}
    </nav>
    <div className="nt-side__footer">
      {footer}
      {onCollapsedChange && <Button isIconOnly size="sm" variant="ghost" className="nt-side__collapse" aria-label={collapsed ? text("Expand sidebar", "展开侧边栏") : text("Collapse sidebar", "收起侧边栏")} onPress={() => onCollapsedChange(!collapsed)}>
        {collapsed ? <ChevronsRight aria-hidden="true" width={16} height={16} /> : <ChevronsLeft aria-hidden="true" width={16} height={16} />}
      </Button>}
    </div>
  </aside>;
}

/* ---------- Workspace switcher ---------- */
const workspaces = [
  {id: "niltavi", name: "Niltavi", plan: {en: "Pro plan", zh: "专业版"}},
  {id: "canopy", name: "Canopy Labs", plan: {en: "Team plan", zh: "团队版"}},
  {id: "fern", name: "Fernwood", plan: {en: "Free", zh: "免费版"}},
];
export function WorkspaceSwitcher({compact}: {compact?: boolean}) {
  const text = useText();
  const [current, setCurrent] = useState("niltavi");
  const ws = workspaces.find((w) => w.id === current)!;
  return <Dropdown>
    <Button variant="ghost" className="nt-ws" aria-label={text("Switch workspace", "切换工作区")}>
      <span className="tpl-nav__logo" aria-hidden="true">{ws.name.slice(0, 1)}</span>
      {!compact && <span className="nt-ws__text"><strong>{ws.name}</strong><span>{text(ws.plan.en, ws.plan.zh)}</span></span>}
      {!compact && <ChevronDown aria-hidden="true" width={14} height={14} className="nt-ws__chevron" />}
    </Button>
    <Dropdown.Popover placement="bottom start" className="min-w-56">
      <Dropdown.Menu aria-label={text("Workspaces", "工作区")} selectionMode="single" disallowEmptySelection selectedKeys={[current]}
        onAction={(key) => { if (workspaces.some((w) => w.id === key)) setCurrent(String(key)); }}>
        <Dropdown.Section>
          <Header>{text("Workspaces", "工作区")}</Header>
          {workspaces.map((w) => <Dropdown.Item key={w.id} id={w.id} textValue={w.name}>
            <span className="tpl-nav__logo nt-ws__mini" aria-hidden="true">{w.name.slice(0, 1)}</span>
            <Label>{w.name}</Label><Dropdown.ItemIndicator />
          </Dropdown.Item>)}
        </Dropdown.Section>
        <Separator />
        <Dropdown.Item id="create" textValue={text("Create workspace", "新建工作区")}><Plus aria-hidden="true" width={14} height={14} /><Label>{text("Create workspace", "新建工作区")}</Label></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown>;
}

/* ---------- User menu ---------- */
export function UserMenu({name = "Lin Wei", email = "lin@niltavi.com", onSignOut, onAction, showName, placement = "bottom end"}: {name?: string; email?: string; onSignOut?: () => void; onAction?: (key: string) => void; showName?: boolean; placement?: "bottom end" | "top start" | "top end" | "bottom start"}) {
  const text = useText();
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2);
  return <Dropdown>
    <Button variant="ghost" className="nt-user" aria-label={text("Account menu", "账号菜单")} isIconOnly={!showName}>
      <Avatar size="sm" color="accent"><Avatar.Fallback>{initials}</Avatar.Fallback></Avatar>
      {showName && <span className="nt-ws__text"><strong>{name}</strong><span>{email}</span></span>}
    </Button>
    <Dropdown.Popover placement={placement} className="min-w-60">
      <div className="nt-user__card"><Avatar size="md" color="accent"><Avatar.Fallback>{initials}</Avatar.Fallback></Avatar><div><strong>{name}</strong><span>{email}</span></div></div>
      <Dropdown.Menu aria-label={text("Account", "账号")} onAction={(key) => key === "signout" ? onSignOut?.() : onAction?.(String(key))}>
        <Dropdown.Section>
          <Dropdown.Item id="profile" textValue={text("Profile", "个人资料")}><Person aria-hidden="true" width={14} height={14} /><Label>{text("Profile", "个人资料")}</Label></Dropdown.Item>
          <Dropdown.Item id="settings" textValue={text("Settings", "设置")}><Gear aria-hidden="true" width={14} height={14} /><Label>{text("Settings", "设置")}</Label>
            <Kbd className="ms-auto" slot="keyboard" variant="light"><Kbd.Abbr keyValue="command" /><Kbd.Content>,</Kbd.Content></Kbd></Dropdown.Item>
          <Dropdown.Item id="billing" textValue={text("Billing", "账单")}><CreditCard aria-hidden="true" width={14} height={14} /><Label>{text("Billing", "账单")}</Label></Dropdown.Item>
          <Dropdown.SubmenuTrigger>
            <Dropdown.Item id="theme" textValue={text("Appearance", "外观")}><Moon aria-hidden="true" width={14} height={14} /><Label>{text("Appearance", "外观")}</Label><Dropdown.SubmenuIndicator /></Dropdown.Item>
            <Dropdown.Popover><Dropdown.Menu aria-label={text("Appearance", "外观")} selectionMode="single" defaultSelectedKeys={["system"]}>
              {[{id: "light", en: "Light", zh: "浅色"}, {id: "dark", en: "Dark", zh: "深色"}, {id: "system", en: "System", zh: "跟随系统"}].map((o) =>
                <Dropdown.Item key={o.id} id={o.id} textValue={text(o.en, o.zh)}><Label>{text(o.en, o.zh)}</Label><Dropdown.ItemIndicator /></Dropdown.Item>)}
            </Dropdown.Menu></Dropdown.Popover>
          </Dropdown.SubmenuTrigger>
        </Dropdown.Section>
        <Separator />
        <Dropdown.Section>
          <Dropdown.Item id="shortcuts" textValue={text("Keyboard shortcuts", "快捷键")}><Keyboard aria-hidden="true" width={14} height={14} /><Label>{text("Keyboard shortcuts", "快捷键")}</Label></Dropdown.Item>
          <Dropdown.Item id="help" textValue={text("Help & docs", "帮助与文档")}><CircleQuestion aria-hidden="true" width={14} height={14} /><Label>{text("Help & docs", "帮助与文档")}</Label></Dropdown.Item>
        </Dropdown.Section>
        <Separator />
        <Dropdown.Item id="signout" textValue={text("Sign out", "退出登录")} variant="danger"><ArrowRightFromSquare aria-hidden="true" width={14} height={14} /><Label>{text("Sign out", "退出登录")}</Label></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown>;
}

/* ---------- Create menu ---------- */
export function CreateMenu({onAction}: {onAction?: (key: string) => void}) {
  const text = useText();
  return <Dropdown>
    <Button size="sm"><Plus aria-hidden="true" width={14} height={14} />{text("New", "新建")}<ChevronDown aria-hidden="true" width={12} height={12} /></Button>
    <Dropdown.Popover placement="bottom end" className="min-w-52">
      <Dropdown.Menu aria-label={text("Create", "新建")} onAction={(key) => onAction?.(String(key))}>
        <Dropdown.Item id="doc" textValue={text("Document", "文档")}><FileText aria-hidden="true" width={14} height={14} /><Label>{text("Document", "文档")}</Label><Kbd className="ms-auto" slot="keyboard" variant="light"><Kbd.Content>D</Kbd.Content></Kbd></Dropdown.Item>
        <Dropdown.Item id="project" textValue={text("Project", "项目")}><Folder aria-hidden="true" width={14} height={14} /><Label>{text("Project", "项目")}</Label><Kbd className="ms-auto" slot="keyboard" variant="light"><Kbd.Content>P</Kbd.Content></Kbd></Dropdown.Item>
        <Dropdown.Item id="invite" textValue={text("Invite member", "邀请成员")}><PersonPlus aria-hidden="true" width={14} height={14} /><Label>{text("Invite member", "邀请成员")}</Label><Kbd className="ms-auto" slot="keyboard" variant="light"><Kbd.Content>I</Kbd.Content></Kbd></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown>;
}

/* ---------- Command menu (⌘K) ---------- */
export type Command = {id: string; label: string; group: string; icon: Icon; hint?: string};

export function useDefaultCommands(): Command[] {
  const text = useText();
  return useMemo(() => [
    {id: "overview", label: text("Go to Overview", "前往概览"), group: text("Navigation", "导航"), icon: Book},
    {id: "members", label: text("Go to Members", "前往成员"), group: text("Navigation", "导航"), icon: Person},
    {id: "settings", label: text("Open Settings", "打开设置"), group: text("Navigation", "导航"), icon: Gear},
    {id: "invite", label: text("Invite a member", "邀请成员"), group: text("Actions", "操作"), icon: PersonPlus},
    {id: "doc", label: text("New document", "新建文档"), group: text("Actions", "操作"), icon: FileText},
    {id: "signout", label: text("Sign out", "退出登录"), group: text("Actions", "操作"), icon: ArrowRightFromSquare},
  ], [text]);
}

export function CommandMenu({isOpen, onOpenChange, commands, onRun, shortcut = true}: {isOpen: boolean; onOpenChange: (open: boolean) => void; commands: Command[]; onRun: (id: string) => void; shortcut?: boolean}) {
  const text = useText();
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); onOpenChange(!isOpen); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onOpenChange, shortcut]);
  useEffect(() => { if (!isOpen) setQuery(""); }, [isOpen]);
  const q = query.trim().toLowerCase();
  const visible = commands.filter((c) => !q || c.label.toLowerCase().includes(q));
  const groups = [...new Set(visible.map((c) => c.group))];

  return <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
    <Modal.Container placement="top">
      <Modal.Dialog className="nt-cmd sm:max-w-[520px]" aria-label={text("Command menu", "命令面板")}>
        <SearchField aria-label={text("Search commands", "搜索命令")} value={query} onChange={setQuery} autoFocus className="nt-cmd__search">
          <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder={text("Type a command or search…", "输入命令或搜索…")} /></SearchField.Group>
        </SearchField>
        {visible.length === 0 ? <p className="tpl-empty">{text("No results", "没有匹配的命令")}</p>
          : <ListBox aria-label={text("Commands", "命令")} className="nt-cmd__list" onAction={(key) => { onOpenChange(false); onRun(String(key)); }}>
            {groups.map((g) => <ListBox.Section key={g}>
              <Header>{g}</Header>
              {visible.filter((c) => c.group === g).map((c) => <ListBox.Item key={c.id} id={c.id} textValue={c.label}><c.icon aria-hidden="true" width={14} height={14} /><span>{c.label}</span></ListBox.Item>)}
            </ListBox.Section>)}
          </ListBox>}
        <div className="nt-cmd__foot"><span><Kbd variant="light"><Kbd.Content>↵</Kbd.Content></Kbd> {text("to select", "选择")}</span><span><Kbd variant="light"><Kbd.Content>esc</Kbd.Content></Kbd> {text("to close", "关闭")}</span></div>
      </Modal.Dialog>
    </Modal.Container>
  </Modal.Backdrop>;
}

export function CommandTrigger({onPress}: {onPress: () => void}) {
  const text = useText();
  return <Button variant="secondary" size="sm" className="nt-cmd-trigger" onPress={onPress}>
    <Magnifier aria-hidden="true" width={14} height={14} /><span>{text("Search…", "搜索…")}</span>
    <Kbd variant="light" className="ms-auto"><Kbd.Abbr keyValue="command" /><Kbd.Content>K</Kbd.Content></Kbd>
  </Button>;
}
