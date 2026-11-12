import {ArrowDown, ArrowRotateLeft, ArrowUp, Check, Copy, FileText, Globe, MagicWand, Paperclip, Sparkles, SquareFill, ThumbsDown, ThumbsUp, Xmark} from "@gravity-ui/icons";
import {Button, TextArea, ToggleButton, Tooltip} from "@heroui/react";
import {Fragment, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type KeyboardEvent, type ReactNode, type SVGProps} from "react";
import {useText} from "../../site/Locale";
import type {AIChatController, ChatMessage} from "./useAIChat";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/** Icon button with a tooltip; used across the chat toolbar and message actions. */
export function ActionButton({label, icon: Glyph, onPress, isActive, isDisabled, size = 14}: {label: string; icon: Icon; onPress?: () => void; isActive?: boolean; isDisabled?: boolean; size?: number}) {
  return <Tooltip delay={400} closeDelay={0}>
    <Button isIconOnly size="sm" variant="ghost" aria-label={label} aria-pressed={isActive} isDisabled={isDisabled} onPress={onPress} className="nt-action" data-active={isActive || undefined}>
      <Glyph aria-hidden="true" width={size} height={size} />
    </Button>
    <Tooltip.Content><p>{label}</p></Tooltip.Content>
  </Tooltip>;
}

/* ---------- Minimal markdown: paragraphs, lists, fenced code, **bold**, `code` ---------- */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Markdown({text}: {text: string}) {
  const blocks: ReactNode[] = [];
  const parts = text.split(/```(?:\w+)?\n?/);
  parts.forEach((chunk, ci) => {
    if (ci % 2 === 1) { blocks.push(<pre key={`c${ci}`}><code>{chunk.replace(/\n$/, "")}</code></pre>); return; }
    chunk.split(/\n{2,}/).forEach((para, pi) => {
      const lines = para.split("\n").filter((l) => l.trim());
      if (!lines.length) return;
      if (lines.every((l) => /^\s*[-*] /.test(l))) blocks.push(<ul key={`${ci}-${pi}`}>{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*[-*] /, ""))}</li>)}</ul>);
      else blocks.push(<p key={`${ci}-${pi}`}>{lines.map((l, li) => <Fragment key={li}>{li > 0 && <br />}{inline(l)}</Fragment>)}</p>);
    });
  });
  return <div className="nt-md">{blocks}</div>;
}

/* ---------- Messages ---------- */
export function AssistantAvatar({size = 28}: {size?: number}) {
  return <span className="nt-ai-avatar" style={{width: size, height: size}} aria-hidden="true"><Sparkles width={size * .5} height={size * .5} /></span>;
}

export function ChatMessageItem({message, onRegenerate, onFeedback, isLast}: {message: ChatMessage; onRegenerate?: () => void; onFeedback?: (value: "up" | "down") => void; isLast?: boolean}) {
  const text = useText();
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(message.content).catch(() => {}); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };

  if (message.role === "user") return <div className="nt-msg nt-msg--user nt-fade-up">
    {message.attachments?.length ? <div className="nt-msg__files">{message.attachments.map((f) => <span key={f} className="nt-file"><FileText aria-hidden="true" width={14} height={14} />{f}</span>)}</div> : null}
    {message.content && <div className="nt-msg__bubble">{message.content}</div>}
  </div>;

  const busy = message.status === "thinking" || message.status === "streaming";
  return <div className="nt-msg nt-msg--assistant nt-fade-up">
    <AssistantAvatar />
    <div className="nt-msg__body">
      {message.status === "thinking"
        ? <span className="nt-thinking"><span className="nt-dots" aria-hidden="true"><i /><i /><i /></span><span className="nt-shimmer-text">{text("Thinking…", "正在思考…")}</span></span>
        : <div className={message.status === "streaming" ? "nt-caret-host" : undefined}><Markdown text={message.content} />{message.status === "streaming" && <span className="nt-caret" aria-hidden="true" />}</div>}
      {message.status === "stopped" && <span className="nt-msg__note">{text("Stopped", "已停止生成")}</span>}
      {!busy && <div className="nt-msg__actions" data-persist={isLast || undefined}>
        <ActionButton label={copied ? text("Copied", "已复制") : text("Copy", "复制")} icon={copied ? Check : Copy} onPress={copy} />
        <ActionButton label={text("Regenerate", "重新生成")} icon={ArrowRotateLeft} onPress={onRegenerate} />
        <ActionButton label={text("Good response", "有帮助")} icon={ThumbsUp} isActive={message.feedback === "up"} onPress={() => onFeedback?.("up")} />
        <ActionButton label={text("Bad response", "没帮助")} icon={ThumbsDown} isActive={message.feedback === "down"} onPress={() => onFeedback?.("down")} />
      </div>}
    </div>
  </div>;
}

/* ---------- Prompt input ---------- */
const sampleFiles = ["brief.pdf", "palette.png", "notes.md", "metrics.csv"];

export function PromptInput({onSubmit, onStop, isGenerating, placeholder, tools = true, autoFocus}: {
  onSubmit: (text: string, attachments: string[]) => void;
  onStop?: () => void;
  isGenerating?: boolean;
  placeholder?: string;
  tools?: boolean;
  autoFocus?: boolean;
}) {
  const text = useText();
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [search, setSearch] = useState(false);
  const [reason, setReason] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  const canSend = !isGenerating && (value.trim().length > 0 || files.length > 0);
  const submit = () => { if (!canSend) return; onSubmit(value, files); setValue(""); setFiles([]); };
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); }
  };
  const attach = () => setFiles((prev) => prev.length >= sampleFiles.length ? prev : [...prev, sampleFiles.find((f) => !prev.includes(f))!]);

  return <form className="nt-prompt" onSubmit={(event) => { event.preventDefault(); submit(); }}>
    {files.length > 0 && <div className="nt-prompt__files">
      {files.map((f) => <span key={f} className="nt-file nt-pop"><FileText aria-hidden="true" width={14} height={14} />{f}
        <button type="button" aria-label={text(`Remove ${f}`, `移除 ${f}`)} onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}><Xmark aria-hidden="true" width={12} height={12} /></button>
      </span>)}
    </div>}
    <TextArea ref={ref} rows={1} aria-label={text("Message", "消息")} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown}
      placeholder={placeholder ?? text("Ask anything…", "有什么想问的…")} className="nt-prompt__textarea" autoFocus={autoFocus} />
    <div className="nt-prompt__bar">
      <div className="nt-prompt__tools">
        <ActionButton label={text("Attach file", "添加附件")} icon={Paperclip} onPress={attach} size={16} />
        {tools && <>
          <ToggleButton size="sm" variant="ghost" isSelected={search} onChange={setSearch} className="nt-tool"><Globe aria-hidden="true" width={14} height={14} />{text("Search", "联网")}</ToggleButton>
          <ToggleButton size="sm" variant="ghost" isSelected={reason} onChange={setReason} className="nt-tool"><MagicWand aria-hidden="true" width={14} height={14} />{text("Reason", "深度思考")}</ToggleButton>
        </>}
      </div>
      {isGenerating
        ? <Button isIconOnly size="sm" aria-label={text("Stop generating", "停止生成")} onPress={onStop} className="nt-send nt-pop"><SquareFill aria-hidden="true" width={12} height={12} /></Button>
        : <Button isIconOnly size="sm" type="submit" aria-label={text("Send", "发送")} isDisabled={!canSend} className="nt-send"><ArrowUp aria-hidden="true" width={16} height={16} /></Button>}
    </div>
  </form>;
}

/* ---------- Suggestions & empty state ---------- */
export type Suggestion = {icon: Icon; title: string; prompt: string};

export function PromptSuggestions({items, onPick, layout = "grid"}: {items: Suggestion[]; onPick: (prompt: string) => void; layout?: "grid" | "list"}) {
  return <div className="nt-suggestions" data-layout={layout}>
    {items.map((s, i) => <button key={s.title} type="button" className="nt-suggestion nt-press nt-fade-up" style={{"--i": i + 1} as React.CSSProperties} onClick={() => onPick(s.prompt)}>
      <s.icon aria-hidden="true" width={16} height={16} />
      <span><strong>{s.title}</strong><span>{s.prompt}</span></span>
    </button>)}
  </div>;
}

/* ---------- Composite chat ---------- */
export function AIChat({chat, suggestions = [], greeting, description, variant = "page", footnote, tools}: {
  chat: AIChatController;
  suggestions?: Suggestion[];
  greeting?: string;
  description?: string;
  variant?: "page" | "panel";
  footnote?: string | false;
  tools?: boolean;
}) {
  const text = useText();
  const scroller = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const {messages} = chat;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const last = messages[messages.length - 1];
    if (atBottom || last?.role === "user") el.scrollTo({top: el.scrollHeight, behavior: last?.status === "streaming" ? "auto" : "smooth"});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const onScroll = () => {
    const el = scroller.current;
    if (el) setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 48);
  };

  return <div className="nt-chat" data-variant={variant}>
    <div className="nt-chat__scroll" ref={scroller} onScroll={onScroll}>
      <div className="nt-chat__inner">
        {messages.length === 0
          ? <div className="nt-chat__empty">
            <AssistantAvatar size={44} />
            <h3 className="nt-fade-up">{greeting ?? text("How can I help today?", "今天想做点什么？")}</h3>
            {description && <p className="nt-fade-up" style={{"--i": 1} as React.CSSProperties}>{description}</p>}
            {suggestions.length > 0 && <PromptSuggestions items={suggestions} onPick={(p) => chat.send(p)} layout={variant === "panel" ? "list" : "grid"} />}
          </div>
          : messages.map((m, i) => <ChatMessageItem key={m.id} message={m} isLast={i === messages.length - 1}
            onRegenerate={() => chat.regenerate(m.id)} onFeedback={(v) => chat.setFeedback(m.id, v)} />)}
      </div>
    </div>
    {!atBottom && messages.length > 0 && <Button isIconOnly size="sm" variant="secondary" className="nt-chat__jump nt-pop" aria-label={text("Scroll to latest", "回到最新")}
      onPress={() => scroller.current?.scrollTo({top: scroller.current.scrollHeight, behavior: "smooth"})}><ArrowDown aria-hidden="true" width={14} height={14} /></Button>}
    <div className="nt-chat__footer">
      <PromptInput onSubmit={chat.send} onStop={chat.stop} isGenerating={chat.isGenerating} tools={tools ?? variant === "page"} />
      {footnote !== false && <p className="nt-chat__note">{footnote ?? text("AI can make mistakes. Check important information.", "AI 也会出错，重要信息请核实。")}</p>}
    </div>
  </div>;
}
