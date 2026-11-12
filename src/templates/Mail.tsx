import {Archive, ArrowShapeTurnUpLeft, ArrowShapeTurnUpRight, Envelope, FileText, Paperclip, PaperPlane, Pencil, Star, StarFill, Tag, TrashBin, Tray} from "@gravity-ui/icons";
import {Button, Chip, TextArea} from "@heroui/react";
import {useState} from "react";
import {useText} from "../site/Locale";
import {AppShell, IconButton, PersonAvatar, Segmented, type NavItem} from "./shell";

const nav: NavItem[] = [
  {id: "inbox", en: "Inbox", zh: "收件箱", icon: Tray, count: 4},
  {id: "starred", en: "Starred", zh: "星标", icon: Star},
  {id: "sent", en: "Sent", zh: "已发送", icon: PaperPlane},
  {id: "drafts", en: "Drafts", zh: "草稿", icon: FileText, count: 2},
  {id: "archive", en: "Archive", zh: "归档", icon: Archive},
  {id: "trash", en: "Trash", zh: "废纸篓", icon: TrashBin},
];

type Mail = {id: string; from: string; email: string; time: string; subject: {en: string; zh: string}; preview: {en: string; zh: string}; label?: {en: string; zh: string; color: "accent" | "success" | "warning"}; unread?: boolean; starred?: boolean; attachment?: string};

const mails: Mail[] = [
  {id: "1", from: "Mira Chen", email: "mira@fieldnotes.co", time: "09:42", unread: true, starred: true, attachment: "survey-route.pdf",
    subject: {en: "Spring survey route, final draft", zh: "春季观测路线终稿"},
    preview: {en: "I have attached the revised route for the ridge trail. We moved the second stop closer to the stream so the morning light falls behind the canopy. Let me know if the timing still works for your team.", zh: "附件是修改后的山脊步道路线。第二站挪到了溪边，这样晨光会落在树冠后面。看看时间安排对你们团队是否还合适。"},
    label: {en: "Field", zh: "野外", color: "success"}},
  {id: "2", from: "Arjun Patel", email: "arjun@canopy.io", time: "08:15", unread: true,
    subject: {en: "Design review moved to Thursday", zh: "设计评审改到周四"},
    preview: {en: "Quick heads-up: the review is now Thursday at 2pm. I will share the new palette exploration beforehand so everyone has time to look.", zh: "提醒一下：评审改到周四下午两点。我会提前发出新的配色探索，大家可以先看看。"},
    label: {en: "Design", zh: "设计", color: "accent"}},
  {id: "3", from: "Sofia Lim", email: "sofia@studio.sg", time: "Yesterday", unread: true,
    subject: {en: "Print proofs are ready", zh: "印刷打样已完成"},
    preview: {en: "The woodcut plates came back from the printer. Colors are close; the blue reads a touch warmer on the uncoated stock.", zh: "木刻版画的打样回来了。颜色接近，只是蓝色在非涂布纸上略偏暖。"}},
  {id: "4", from: "Daniel Ong", email: "daniel@ledger.app", time: "Yesterday", starred: true,
    subject: {en: "Invoice #2041 for October", zh: "10 月账单 #2041"},
    preview: {en: "Please find the October invoice attached. Payment is due within 14 days. Thanks for another good month.", zh: "附件是 10 月账单，请在 14 天内付款。感谢又一个顺利的月份。"},
    label: {en: "Finance", zh: "财务", color: "warning"}, attachment: "invoice-2041.pdf"},
  {id: "5", from: "Hana Sato", email: "hana@birdlog.jp", time: "Mon", unread: true,
    subject: {en: "New sighting near the reservoir", zh: "水库附近的新观测记录"},
    preview: {en: "Two niltavas spotted at dawn, close to the eastern path. Photos are in the shared folder.", zh: "清晨在东侧小路附近看到两只仙鹟，照片已放进共享文件夹。"}},
  {id: "6", from: "Leo Tan", email: "leo@canopy.io", time: "Sun",
    subject: {en: "Weekend reading list", zh: "周末阅读清单"},
    preview: {en: "A few essays on slow technology and attention I enjoyed this week.", zh: "这周读到几篇关于慢科技与注意力的文章，分享给你。"}},
];

export default function MailTemplate() {
  const text = useText();
  const [folder, setFolder] = useState("inbox");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selected, setSelected] = useState("1");
  const [read, setRead] = useState<Set<string>>(() => new Set());
  const [starred, setStarred] = useState<Set<string>>(() => new Set(mails.filter((m) => m.starred).map((m) => m.id)));
  const isUnread = (m: Mail) => m.unread && !read.has(m.id);
  const list = mails.filter((m) => (filter === "all" || isUnread(m)) && (folder !== "starred" || starred.has(m.id)));
  const mail = mails.find((m) => m.id === selected) ?? mails[0];
  const open = (id: string) => { setSelected(id); setRead((prev) => new Set(prev).add(id)); };
  const toggleStar = (id: string) => setStarred((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return <AppShell brand="Swift" nav={nav.map((n) => n.id === "inbox" ? {...n, count: mails.filter(isUnread).length} : n)} active={folder} onNavigate={setFolder} flush
    title={<h3>{text("Mail", "邮件")}</h3>}
    actions={<Button size="sm"><Pencil aria-hidden="true" width={16} height={16} />{text("Compose", "写邮件")}</Button>}>
    <div className="tpl-split tpl-split--mail">
      <div className="tpl-list">
        <div className="tpl-list__head">
          <strong>{text(nav.find((n) => n.id === folder)!.en, nav.find((n) => n.id === folder)!.zh)}</strong>
          <Segmented label={text("Filter", "筛选")} value={filter} onChange={setFilter} options={[{id: "all", label: text("All", "全部")}, {id: "unread", label: text("Unread", "未读")}]} />
        </div>
        <div className="tpl-list__items" role="list">
          {list.length === 0 && <p className="tpl-empty">{text("Nothing here yet.", "这里还没有邮件。")}</p>}
          {list.map((m) => <button key={m.id} type="button" role="listitem" className="tpl-mail-item" aria-current={m.id === mail.id || undefined} data-unread={isUnread(m) || undefined} onClick={() => open(m.id)}>
            <div className="tpl-mail-item__top"><span className="tpl-mail-item__from">{m.from}</span><span className="tpl-meta">{m.time === "Yesterday" ? text("Yesterday", "昨天") : m.time}</span></div>
            <span className="tpl-mail-item__subject">{text(m.subject.en, m.subject.zh)}</span>
            <span className="tpl-mail-item__preview">{text(m.preview.en, m.preview.zh)}</span>
            {(m.label || m.attachment) && <div className="tpl-mail-item__tags">
              {m.label && <Chip size="sm" variant="soft" color={m.label.color}>{text(m.label.en, m.label.zh)}</Chip>}
              {m.attachment && <span className="tpl-meta"><Paperclip aria-hidden="true" width={12} height={12} /> 1</span>}
            </div>}
          </button>)}
        </div>
      </div>
      <article className="tpl-reader">
        <div className="tpl-reader__toolbar">
          <div className="tpl-row">
            <IconButton label={text("Archive", "归档")} icon={Archive} />
            <IconButton label={text("Mark unread", "标为未读")} icon={Envelope} />
            <IconButton label={text("Label", "标签")} icon={Tag} />
            <IconButton label={text("Delete", "删除")} icon={TrashBin} />
          </div>
          <div className="tpl-row">
            <IconButton label={text("Reply", "回复")} icon={ArrowShapeTurnUpLeft} />
            <IconButton label={text("Forward", "转发")} icon={ArrowShapeTurnUpRight} />
            <Button isIconOnly size="sm" variant="ghost" aria-label={starred.has(mail.id) ? text("Unstar", "取消星标") : text("Star", "加星标")} aria-pressed={starred.has(mail.id)} onPress={() => toggleStar(mail.id)}>
              {starred.has(mail.id) ? <StarFill aria-hidden="true" width={16} height={16} className="tpl-star" /> : <Star aria-hidden="true" width={16} height={16} />}
            </Button>
          </div>
        </div>
        <div className="tpl-reader__body" key={mail.id}>
          <h4 className="tpl-reader__subject">{text(mail.subject.en, mail.subject.zh)}</h4>
          <div className="tpl-reader__from">
            <PersonAvatar name={mail.from} size="md" />
            <div><strong>{mail.from}</strong><span className="tpl-meta">{mail.email} · {text("to me", "发给我")}</span></div>
            <span className="tpl-meta tpl-push">{mail.time === "Yesterday" ? text("Yesterday", "昨天") : mail.time}</span>
          </div>
          <div className="tpl-reader__text">
            <p>{text("Hi Lin,", "Lin 你好，")}</p>
            <p>{text(mail.preview.en, mail.preview.zh)}</p>
            <p>{text("Best,", "祝好，")}<br />{mail.from.split(" ")[0]}</p>
          </div>
          {mail.attachment && <div className="tpl-attachment"><FileText aria-hidden="true" width={20} height={20} /><div><strong>{mail.attachment}</strong><span className="tpl-meta">PDF · 1.4 MB</span></div><Button size="sm" variant="tertiary">{text("Download", "下载")}</Button></div>}
        </div>
        <div className="tpl-composer">
          <TextArea aria-label={text("Reply", "回复")} placeholder={text(`Reply to ${mail.from.split(" ")[0]}…`, `回复 ${mail.from.split(" ")[0]}…`)} rows={2} variant="secondary" className="w-full" />
          <div className="tpl-composer__bar">
            <IconButton label={text("Attach file", "添加附件")} icon={Paperclip} />
            <Button size="sm">{text("Send", "发送")}<PaperPlane aria-hidden="true" width={14} height={14} /></Button>
          </div>
        </div>
      </article>
    </div>
  </AppShell>;
}
