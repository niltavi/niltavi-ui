import {ArrowsExpandVertical, ChevronsExpandUpRight, Grip, Minus, Pencil, Sparkles} from "@gravity-ui/icons";
import {Button, Tooltip} from "@heroui/react";
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent} from "react";
import {createPortal} from "react-dom";
import {useLocale, useText} from "../../site/Locale";
import {ActionButton, AIChat} from "./AIChat";
import {useSuggestions} from "./AIChatWorkspace";
import {mockResponder} from "./mockResponder";
import {useAIChat, type Responder} from "./useAIChat";

import {cornerFor, nextMode, type WidgetCorner, type WidgetMode} from "./widgetLogic";
export type {WidgetCorner, WidgetMode} from "./widgetLogic";

function stored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try { const v = localStorage.getItem(key); return allowed.includes(v as T) ? v as T : fallback; } catch { return fallback; }
}

/**
 * Floating assistant pinned to a window corner.
 * closed → compact → tall (top to bottom) → full → closed, all from one button.
 * Drag the launcher or the panel header; it snaps to the nearest corner on release.
 */
export function AIWidget({mode: modeProp, onModeChange, respond, title}: {mode?: WidgetMode; onModeChange?: (mode: WidgetMode) => void; respond?: Responder; title?: string}) {
  const text = useText();
  const locale = useLocale();
  const [innerMode, setInnerMode] = useState<WidgetMode>("closed");
  const mode = modeProp ?? innerMode;
  const setMode = useCallback((next: WidgetMode) => { setInnerMode(next); onModeChange?.(next); }, [onModeChange]);
  const [corner, setCorner] = useState<WidgetCorner>(() => stored("niltavi-ai-corner", ["tl", "tr", "bl", "br"] as const, "br"));
  const [exiting, setExiting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const shown = mode;

  const fallback = useMemo(() => mockResponder(locale), [locale]);
  const chat = useAIChat({respond: respond ?? fallback});
  const suggestions = useSuggestions();
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{x: number; y: number; moved: boolean} | null>(null);
  const flip = useRef<{left: number; top: number} | null>(null);

  useEffect(() => { try { localStorage.setItem("niltavi-ai-corner", corner); } catch { /* optional */ } }, [corner]);

  const close = useCallback(() => {
    setExiting(true);
    window.setTimeout(() => { setExiting(false); setMode("closed"); }, 160);
  }, [setMode]);
  const cycle = () => { const next = nextMode[mode]; if (next === "closed") close(); else setMode(next); };

  useEffect(() => {
    if (mode === "closed") return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" && !event.defaultPrevented && root.current?.contains(document.activeElement)) close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, close]);

  /* Drag with pointer capture, then FLIP from the dropped spot to the snapped corner. */
  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || mode === "full") return;
    if ((event.target as HTMLElement).closest("button:not([data-drag-handle]), textarea, input, a")) return;
    drag.current = {x: event.clientX, y: event.clientY, moved: false};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current, el = root.current;
    if (!d || !el) return;
    const dx = event.clientX - d.x, dy = event.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    if (!d.moved) { d.moved = true; setDragging(true); }
    el.style.transition = "none";
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current, el = root.current;
    drag.current = null;
    if (!d || !el) return;
    // A lost capture or cancel (scroll, window blur) still finishes the drag; only a real release opens.
    if (!d.moved) { if (mode === "closed" && event.type === "pointerup") setMode("compact"); return; }
    setDragging(false);
    const rect = el.getBoundingClientRect();
    flip.current = {left: rect.left, top: rect.top};
    const next = cornerFor(rect.left + rect.width / 2, rect.top + rect.height / 2, window.innerWidth, window.innerHeight);
    if (next === corner) settle(el);
    else setCorner(next);
    event.preventDefault();
  };
  const settle = (el: HTMLElement) => {
    el.style.transform = "";
    const now = el.getBoundingClientRect();
    const from = flip.current;
    flip.current = null;
    if (!from) return;
    el.style.transition = "none";
    el.style.transform = `translate3d(${from.left - now.left}px, ${from.top - now.top}px, 0)`;
    void el.offsetWidth;
    el.style.transition = "";
    el.style.transform = "";
  };
  useLayoutEffect(() => { if (flip.current && root.current) settle(root.current); }, [corner]);

  const dragHandlers = {onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onLostPointerCapture: onPointerUp};
  const cycleLabel = {closed: text("Open assistant", "打开助手"), compact: text("Expand to full height", "纵向展开"), tall: text("Fill the window", "全屏展开"), full: text("Minimize", "最小化")}[mode];
  const CycleIcon = {closed: Sparkles, compact: ArrowsExpandVertical, tall: ChevronsExpandUpRight, full: Minus}[mode];

  const node = <div ref={root} className="nt-widget" data-mode={shown} data-corner={corner} data-dragging={dragging || undefined}>
    {shown === "closed"
      ? <button type="button" className="nt-widget__fab nt-pop" aria-label={cycleLabel} data-drag-handle
        {...dragHandlers}
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setMode("compact"); } }}>
        <Sparkles aria-hidden="true" width={22} height={22} />
      </button>
      : <section className="nt-widget__panel" data-exiting={exiting || undefined} role="dialog" aria-label={title ?? text("Assistant", "智能助手")}>
        <header className="nt-widget__head" {...dragHandlers} data-draggable={mode !== "full" || undefined}>
          {mode !== "full" && <Grip aria-hidden="true" width={14} height={14} className="nt-widget__grip" />}
          <span className="nt-ai-avatar" aria-hidden="true" style={{width: 26, height: 26}}><Sparkles width={13} height={13} /></span>
          <strong>{title ?? text("Assistant", "智能助手")}</strong>
          <span className="nt-widget__actions">
            <ActionButton label={text("New chat", "新对话")} icon={Pencil} onPress={chat.reset} />
            <Tooltip delay={400} closeDelay={0}>
              <Button isIconOnly size="sm" variant="ghost" aria-label={cycleLabel} onPress={cycle} className="nt-action">
                <CycleIcon aria-hidden="true" width={14} height={14} />
              </Button>
              <Tooltip.Content><p>{cycleLabel}</p></Tooltip.Content>
            </Tooltip>
          </span>
        </header>
        <AIChat chat={chat} variant="panel" suggestions={mode === "compact" ? suggestions.slice(0, 3) : suggestions} footnote={false} tools={mode === "full"} />
      </section>}
  </div>;
  return createPortal(node, document.body);
}
