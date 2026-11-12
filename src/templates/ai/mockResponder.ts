import type {Locale} from "../../site/Locale";
import type {Responder} from "./useAIChat";

// Canned replies for the demo; production code passes its own Responder.
const replies = {
  en: {
    plan: "Here is a simple plan for the week:\n\n- **Monday** · outline goals and share them with the team\n- **Wednesday** · review progress and adjust priorities\n- **Friday** · write a short retro and archive what is done\n\nWant me to turn this into tasks?",
    email: "Sure. A short draft:\n\n**Subject:** Thursday design review\n\nHi team, the review moves to Thursday at 2pm. I will share the palette exploration in advance so everyone has time to look. Thanks!\n\nShall I make it more formal?",
    code: "A small React hook that remembers the last value:\n\n```ts\nfunction usePrevious<T>(value: T) {\n  const ref = useRef<T>();\n  useEffect(() => { ref.current = value; });\n  return ref.current;\n}\n```\n\nIt returns `undefined` on the first render.",
    explain: "**Niltavi** is a calm, nature-inspired design language. It pairs niltava blue with warm yellow and forest green, keeps saturation low, and leaves generous space so content can breathe.",
    fallback: "Good question. Here is how I would approach it:\n\n- Clarify the goal and who it is for\n- Sketch the smallest version that works\n- Test it with one real user, then iterate\n\nTell me more and I can go deeper.",
  },
  zh: {
    plan: "这是一份简单的周计划：\n\n- **周一** · 梳理目标并同步给团队\n- **周三** · 检查进度，调整优先级\n- **周五** · 写一份简短复盘，归档已完成事项\n\n需要我把它拆成任务吗？",
    email: "好的，这是一版简短草稿：\n\n**主题：** 周四设计评审\n\n大家好，评审改到周四下午两点。我会提前发出配色探索，方便大家先看。谢谢！\n\n需要改得更正式一些吗？",
    code: "一个记住上一次取值的 React Hook：\n\n```ts\nfunction usePrevious<T>(value: T) {\n  const ref = useRef<T>();\n  useEffect(() => { ref.current = value; });\n  return ref.current;\n}\n```\n\n首次渲染时它会返回 `undefined`。",
    explain: "**Niltavi** 是一套安静、取法自然的设计语言：以仙鹟蓝搭配暖黄与森林绿，整体低饱和，并留出充足的空白，让内容自然呼吸。",
    fallback: "好问题。我会这样着手：\n\n- 先明确目标和使用者\n- 做出能跑通的最小版本\n- 找一位真实用户试用，再迭代\n\n多说一些细节，我可以继续展开。",
  },
};

export function mockResponder(locale: Locale): Responder {
  const set = locale === "en" ? replies.en : replies.zh;
  return (prompt) => {
    const p = prompt.toLowerCase();
    if (/plan|week|计划|周/.test(p)) return set.plan;
    if (/mail|email|邮件|草稿/.test(p)) return set.email;
    if (/code|hook|react|代码/.test(p)) return set.code;
    if (/niltavi|design|设计|介绍/.test(p)) return set.explain;
    return set.fallback;
  };
}
