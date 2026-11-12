import {Bell, Comments, FaceSmile, Gear, Handset, Paperclip, PaperPlane, Persons, Picture, Pin, Plus, Video} from "@gravity-ui/icons";
import {Avatar, Badge, Button, Chip, InputGroup, TextField} from "@heroui/react";
import {useState, type FormEvent} from "react";
import {useText} from "../site/Locale";
import {AppShell, IconButton, PersonAvatar, type NavItem} from "./shell";

const nav: NavItem[] = [
  {id: "chats", en: "Chats", zh: "会话", icon: Comments, count: 5},
  {id: "contacts", en: "Contacts", zh: "联系人", icon: Persons},
  {id: "calls", en: "Calls", zh: "通话", icon: Handset},
  {id: "alerts", en: "Alerts", zh: "提醒", icon: Bell},
  {id: "settings", en: "Settings", zh: "设置", icon: Gear},
];

type Message = {from: string; en: string; zh: string; time: string};
type Thread = {id: string; name: string; group?: boolean; online?: boolean; unread?: number; pinned?: boolean; messages: Message[]};

const ME = "Lin Wei";
const initialThreads: Thread[] = [
  {id: "field", name: "Field Team", group: true, unread: 3, pinned: true, messages: [
    {from: "Mira Chen", en: "Morning! Weather looks clear for the ridge walk tomorrow.", zh: "早！明天山脊步道的天气看起来不错。", time: "08:02"},
    {from: "Hana Sato", en: "Great. I will bring the long lens and the spare batteries.", zh: "太好了，我带长焦镜头和备用电池。", time: "08:05"},
    {from: ME, en: "Let us meet at the trailhead at 6:15 so we catch first light.", zh: "6:15 在步道口集合吧，赶上第一缕光。", time: "08:09"},
    {from: "Mira Chen", en: "Works for me. I will share the route map in a minute.", zh: "可以，我一会儿把路线图发上来。", time: "08:11"},
  ]},
  {id: "arjun", name: "Arjun Patel", online: true, unread: 2, messages: [
    {from: "Arjun Patel", en: "Did you get a chance to look at the new palette?", zh: "新配色你看过了吗？", time: "09:20"},
    {from: "Arjun Patel", en: "I softened the yellow a little for dark mode.", zh: "深色模式下我把黄色调柔和了一点。", time: "09:21"},
  ]},
  {id: "sofia", name: "Sofia Lim", online: true, messages: [
    {from: ME, en: "The proofs look lovely, thank you.", zh: "打样很漂亮，谢谢。", time: "Mon"},
    {from: "Sofia Lim", en: "Happy to hear! Shipping the final run on Friday.", zh: "太好了！周五寄出正式印刷品。", time: "Mon"},
  ]},
  {id: "daniel", name: "Daniel Ong", messages: [
    {from: "Daniel Ong", en: "Invoice sent, no rush.", zh: "账单已发出，不着急。", time: "Sun"},
  ]},
];

export default function ChatTemplate() {
  const text = useText();
  const [threads, setThreads] = useState(initialThreads);
  const [active, setActive] = useState("field");
  const [draft, setDraft] = useState("");
  const thread = threads.find((t) => t.id === active)!;

  const select = (id: string) => { setActive(id); setThreads((prev) => prev.map((t) => t.id === id ? {...t, unread: 0} : t)); };
  const send = (event: FormEvent) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    const now = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
    setThreads((prev) => prev.map((t) => t.id === active ? {...t, messages: [...t.messages, {from: ME, en: value, zh: value, time: now}]} : t));
    setDraft("");
  };
  const last = (t: Thread) => t.messages[t.messages.length - 1];

  return <AppShell brand="Murmur" nav={nav} active="chats" flush
    title={<h3>{text("Messages", "消息")}</h3>}
    actions={<Button size="sm" variant="secondary"><Plus aria-hidden="true" width={16} height={16} />{text("New chat", "新会话")}</Button>}>
    <div className="tpl-split tpl-split--chat">
      <div className="tpl-list">
        <div className="tpl-list__head"><strong>{text("Conversations", "会话")}</strong><Chip size="sm" variant="soft">{threads.length}</Chip></div>
        <div className="tpl-list__items" role="list">
          {threads.map((t) => <button key={t.id} type="button" role="listitem" className="tpl-thread" aria-current={t.id === active || undefined} onClick={() => select(t.id)}>
            <Badge.Anchor>
              {t.group ? <Avatar size="md" color="success"><Avatar.Fallback><Persons aria-hidden="true" width={16} height={16} /></Avatar.Fallback></Avatar> : <PersonAvatar name={t.name} size="md" />}
              {t.online && <Badge color="success" size="sm" placement="bottom-right" aria-label={text("Online", "在线")} />}
            </Badge.Anchor>
            <div className="tpl-thread__text">
              <div className="tpl-mail-item__top"><span className="tpl-mail-item__from">{t.name}</span><span className="tpl-meta">{last(t).time}</span></div>
              <div className="tpl-thread__row"><span className="tpl-mail-item__preview">{last(t).from === ME ? `${text("You", "你")}: ` : ""}{text(last(t).en, last(t).zh)}</span>
                {t.pinned && !t.unread ? <Pin aria-label={text("Pinned", "已置顶")} width={12} height={12} className="tpl-meta" /> : null}
                {t.unread ? <span className="tpl-nav__count tpl-nav__count--solid">{t.unread}</span> : null}
              </div>
            </div>
          </button>)}
        </div>
      </div>
      <section className="tpl-conversation" aria-label={thread.name}>
        <div className="tpl-reader__toolbar">
          <div className="tpl-row">
            <strong>{thread.name}</strong>
            <span className="tpl-meta">{thread.group ? text("4 members", "4 位成员") : thread.online ? text("Online", "在线") : text("Last seen Sunday", "上次在线：周日")}</span>
          </div>
          <div className="tpl-row">
            <IconButton label={text("Voice call", "语音通话")} icon={Handset} />
            <IconButton label={text("Video call", "视频通话")} icon={Video} />
          </div>
        </div>
        <div className="tpl-messages">
          <span className="tpl-divider">{text("Today", "今天")}</span>
          {thread.messages.map((m, i) => {
            const mine = m.from === ME;
            const showName = thread.group && !mine && thread.messages[i - 1]?.from !== m.from;
            return <div key={i} className="tpl-bubble-row" data-mine={mine || undefined}>
              {!mine && <PersonAvatar name={m.from} />}
              <div className="tpl-bubble-wrap">
                {showName && <span className="tpl-meta">{m.from}</span>}
                <div className="tpl-bubble">{text(m.en, m.zh)}</div>
                <span className="tpl-meta">{m.time}</span>
              </div>
            </div>;
          })}
        </div>
        <form className="tpl-chat-input" onSubmit={send}>
          <TextField aria-label={text("Message", "消息")} value={draft} onChange={setDraft} className="w-full">
            <InputGroup className="w-full">
              <InputGroup.Prefix className="ps-1"><IconButton label={text("Attach", "附件")} icon={Paperclip} /></InputGroup.Prefix>
              <InputGroup.Input placeholder={text("Write a message…", "输入消息…")} className="min-w-0" />
              <InputGroup.Suffix className="gap-0.5 pe-1">
                <span className="tpl-chat-extra"><IconButton label={text("Image", "图片")} icon={Picture} /><IconButton label={text("Emoji", "表情")} icon={FaceSmile} /></span>
                <Button type="submit" isIconOnly size="sm" aria-label={text("Send", "发送")} isDisabled={!draft.trim()}><PaperPlane aria-hidden="true" width={16} height={16} /></Button>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>
        </form>
      </section>
    </div>
  </AppShell>;
}
