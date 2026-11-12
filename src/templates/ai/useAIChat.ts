import {useCallback, useEffect, useRef, useState} from "react";

export type ChatRole = "user" | "assistant";
export type ChatStatus = "thinking" | "streaming" | "done" | "stopped";
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  attachments?: string[];
  status?: ChatStatus;
  feedback?: "up" | "down";
};
/** Return the full reply; the hook streams it. Swap this for a real model call. */
export type Responder = (prompt: string, history: ChatMessage[]) => string | Promise<string>;

let seed = 0;
const nextId = () => `m${Date.now().toString(36)}${(seed++).toString(36)}`;

export type AIChatController = ReturnType<typeof useAIChat>;

export function useAIChat({respond, initialMessages = [], thinkingMs = 650, chunkMs = 22}: {
  respond: Responder;
  initialMessages?: ChatMessage[];
  thinkingMs?: number;
  chunkMs?: number;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const timers = useRef<number[]>([]);
  const active = useRef<string | null>(null);
  const respondRef = useRef(respond);
  respondRef.current = respond;
  // Updaters stay pure (StrictMode runs them twice); side effects read the latest list here.
  const latest = useRef(messages);
  latest.current = messages;

  const clearTimers = () => { timers.current.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers.current = []; };
  useEffect(() => clearTimers, []);

  const patch = useCallback((id: string, update: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => m.id === id ? {...m, ...update} : m));
  }, []);

  const stream = useCallback((id: string, full: string) => {
    let index = 0;
    patch(id, {status: "streaming", content: ""});
    const timer = window.setInterval(() => {
      index = Math.min(full.length, index + 2 + Math.floor(Math.random() * 4));
      const done = index >= full.length;
      patch(id, {content: full.slice(0, index), status: done ? "done" : "streaming"});
      if (done) { clearInterval(timer); active.current = null; }
    }, chunkMs);
    timers.current.push(timer);
  }, [chunkMs, patch]);

  const generate = useCallback((prompt: string, history: ChatMessage[], assistantId: string) => {
    active.current = assistantId;
    const timer = window.setTimeout(async () => {
      const reply = await respondRef.current(prompt, history);
      if (active.current === assistantId) stream(assistantId, reply);
    }, thinkingMs);
    timers.current.push(timer);
  }, [stream, thinkingMs]);

  const send = useCallback((text: string, attachments: string[] = []) => {
    const content = text.trim();
    if ((!content && attachments.length === 0) || active.current) return;
    const user: ChatMessage = {id: nextId(), role: "user", content, attachments};
    const assistant: ChatMessage = {id: nextId(), role: "assistant", content: "", status: "thinking"};
    const history = [...latest.current, user];
    latest.current = [...history, assistant];
    setMessages((prev) => [...prev, user, assistant]);
    generate(content, history, assistant.id);
  }, [generate]);

  const stop = useCallback(() => {
    const id = active.current;
    clearTimers();
    active.current = null;
    if (id) setMessages((prev) => prev.map((m) => m.id === id ? {...m, status: "stopped"} : m));
  }, []);

  const regenerate = useCallback((assistantId: string) => {
    if (active.current) return;
    const list = latest.current;
    const index = list.findIndex((m) => m.id === assistantId);
    const prompt = list.slice(0, index).reverse().find((m) => m.role === "user");
    if (index < 0 || !prompt) return;
    patch(assistantId, {content: "", status: "thinking", feedback: undefined});
    generate(prompt.content, list.slice(0, index), assistantId);
  }, [generate, patch]);

  const setFeedback = useCallback((id: string, feedback: "up" | "down") => {
    setMessages((prev) => prev.map((m) => m.id === id ? {...m, feedback: m.feedback === feedback ? undefined : feedback} : m));
  }, []);

  const load = useCallback((next: ChatMessage[]) => { clearTimers(); active.current = null; setMessages(next); }, []);

  const isGenerating = messages.some((m) => m.status === "thinking" || m.status === "streaming");
  return {messages, isGenerating, send, stop, regenerate, setFeedback, load, reset: () => load([])};
}
