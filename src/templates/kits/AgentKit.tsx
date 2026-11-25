import {useState} from "react";
import {useText} from "../../site/Locale";
import {AIWidget} from "../ai/AIWidget";

/**
 * Agent chat behind a corner button. The widget is bounded by this element,
 * which is a positioned size container, so it never leaves the preview.
 */
export function AgentKit() {
  const text = useText();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  return <div ref={setRoot} className="kit-agent">
    <article className="kit-agent__page" aria-hidden="true">
      <span className="kit-rsp__ph kit-rsp__ph--title" />
      <span className="kit-rsp__ph" /><span className="kit-rsp__ph" /><span className="kit-rsp__ph kit-rsp__ph--short" />
      <span className="kit-agent__block" />
      <span className="kit-rsp__ph" /><span className="kit-rsp__ph kit-rsp__ph--short" />
    </article>
    <AIWidget boundary={root} defaultMode="compact" title={text("Agent", "Agent")} />
  </div>;
}
