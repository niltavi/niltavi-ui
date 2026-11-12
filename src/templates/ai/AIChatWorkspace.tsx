import {Code, Comment, Envelope, Calendar, LayoutSideContentLeft, Pencil, Sparkles} from "@gravity-ui/icons";
import {Button, Label, ListBox, Select} from "@heroui/react";
import {useMemo, useRef, useState} from "react";
import {useLocale, useText} from "../../site/Locale";
import {ActionButton, AIChat, type Suggestion} from "./AIChat";
import {mockResponder} from "./mockResponder";
import {useAIChat, type ChatMessage} from "./useAIChat";

export function useSuggestions(): Suggestion[] {
  const text = useText();
  return [
    {icon: Calendar, title: text("Plan my week", "规划这一周"), prompt: text("Help me plan my week", "帮我规划一下这周的计划")},
    {icon: Envelope, title: text("Draft an email", "起草邮件"), prompt: text("Draft an email about the design review", "起草一封关于设计评审改期的邮件")},
    {icon: Code, title: text("Write code", "写一段代码"), prompt: text("Write a React hook that keeps the previous value", "写一个记住上一次取值的 React Hook")},
    {icon: Sparkles, title: text("Explain Niltavi", "介绍 Niltavi"), prompt: text("What is the Niltavi design language?", "介绍一下 Niltavi 设计语言")},
  ];
}

type Conversation = {id: string; title: {en: string; zh: string}; group: "today" | "week"; messages: (locale: "en" | "zh") => ChatMessage[]};
const conversations: Conversation[] = [
  {id: "c1", group: "today", title: {en: "Weekly plan", zh: "本周计划"}, messages: (l) => [
    {id: "c1u", role: "user", content: l === "en" ? "Help me plan my week" : "帮我规划一下这周的计划"},
    {id: "c1a", role: "assistant", status: "done", content: l === "en" ? "Here is a simple plan for the week:\n\n- **Monday** · outline goals\n- **Wednesday** · review progress\n- **Friday** · write a short retro" : "这是一份简单的周计划：\n\n- **周一** · 梳理目标\n- **周三** · 检查进度\n- **周五** · 写一份简短复盘"},
  ]},
  {id: "c2", group: "today", title: {en: "Review email draft", zh: "评审邮件草稿"}, messages: (l) => [
    {id: "c2u", role: "user", content: l === "en" ? "Draft an email about the design review" : "起草一封关于设计评审改期的邮件"},
    {id: "c2a", role: "assistant", status: "done", content: l === "en" ? "**Subject:** Thursday design review\n\nHi team, the review moves to Thursday at 2pm." : "**主题：** 周四设计评审\n\n大家好，评审改到周四下午两点。"},
  ]},
  {id: "c3", group: "week", title: {en: "usePrevious hook", zh: "usePrevious Hook"}, messages: () => []},
  {id: "c4", group: "week", title: {en: "Palette naming ideas", zh: "配色命名灵感"}, messages: () => []},
];

const models = [
  {id: "swift", en: "Swift · fast", zh: "Swift · 快速"},
  {id: "canopy", en: "Canopy · balanced", zh: "Canopy · 均衡"},
  {id: "forest", en: "Forest · deep reasoning", zh: "Forest · 深度推理"},
];

/** Full-page assistant: conversation history, model picker and the chat itself. */
export function AIChatWorkspace() {
  const text = useText();
  const locale = useLocale();
  const respond = useMemo(() => mockResponder(locale), [locale]);
  const chat = useAIChat({respond});
  const suggestions = useSuggestions();
  const [active, setActive] = useState<string | null>(null);
  const [model, setModel] = useState("canopy");
  // History starts closed where it would cover the chat (it overlays below 760px).
  const root = useRef<HTMLDivElement>(null);
  const isNarrow = () => (root.current?.clientWidth ?? window.innerWidth) < 760;
  const [historyOpen, setHistoryOpen] = useState(() => window.innerWidth >= 900);
  const lang = locale === "en" ? "en" : "zh";

  const open = (c: Conversation) => { setActive(c.id); chat.load(c.messages(lang)); if (isNarrow()) setHistoryOpen(false); };
  const startNew = () => { setActive(null); chat.reset(); if (isNarrow()) setHistoryOpen(false); };

  return <div ref={root} className="nt-workspace" data-history={historyOpen || undefined}>
    <aside className="nt-history" aria-label={text("Conversation history", "历史会话")} aria-hidden={!historyOpen || undefined}>
      <Button variant="secondary" size="sm" className="nt-history__new" onPress={startNew}><Pencil aria-hidden="true" width={14} height={14} />{text("New chat", "新对话")}</Button>
      {(["today", "week"] as const).map((group) => <div key={group} className="nt-history__group">
        <span className="nt-history__label">{group === "today" ? text("Today", "今天") : text("Previous 7 days", "最近 7 天")}</span>
        {conversations.filter((c) => c.group === group).map((c) => <button key={c.id} type="button" className="nt-history__item nt-press" aria-current={active === c.id || undefined} onClick={() => open(c)}>
          <Comment aria-hidden="true" width={14} height={14} /><span>{text(c.title.en, c.title.zh)}</span>
        </button>)}
      </div>)}
    </aside>
    <section className="nt-workspace__main">
      <header className="nt-workspace__head">
        <ActionButton label={historyOpen ? text("Hide history", "收起历史") : text("Show history", "展开历史")} icon={LayoutSideContentLeft} onPress={() => setHistoryOpen((v) => !v)} size={16} />
        <Select aria-label={text("Model", "模型")} value={model} onChange={(key) => typeof key === "string" && setModel(key)} className="nt-model">
          <Label className="sr-only">{text("Model", "模型")}</Label>
          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
          <Select.Popover><ListBox>{models.map((m) => <ListBox.Item key={m.id} id={m.id} textValue={text(m.en, m.zh)}>{text(m.en, m.zh)}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover>
        </Select>
        <ActionButton label={text("New chat", "新对话")} icon={Pencil} onPress={startNew} size={16} />
      </header>
      <AIChat chat={chat} suggestions={suggestions} description={text("Ask a question, draft something, or pick a starting point below.", "提问、起草内容，或者从下面挑一个开始。")} />
    </section>
  </div>;
}
