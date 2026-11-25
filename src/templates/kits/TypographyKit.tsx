import {Typography} from "@heroui/react";
import {useLayoutEffect, useRef, useState, type ReactNode} from "react";
import {useText} from "../../site/Locale";

type TypeName = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "body-sm" | "body-xs" | "code";

/** Reads the rendered size, weight and line height, so the numbers always match the theme. */
function Metrics({children}: {children: ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState("");
  useLayoutEffect(() => {
    const target = ref.current?.firstElementChild;
    if (!target) return;
    const style = getComputedStyle(target);
    const size = parseFloat(style.fontSize);
    const lh = style.lineHeight === "normal" ? "normal" : (parseFloat(style.lineHeight) / size).toFixed(2);
    setMetrics(`${size}px / ${style.fontWeight} / ${lh}`);
  }, []);
  return <>
    <span className="kit-type__meta">{metrics}</span>
    <div ref={ref} className="kit-type__sample">{children}</div>
  </>;
}

export function TypographyKit() {
  const text = useText();
  const families = [
    {id: "sans", name: text("Sans · interface", "无衬线 · 界面"), stack: "var(--font-sans)", use: text("Navigation, labels, forms, buttons and body text.", "导航、标签、表单、按钮与正文。"), sample: text("Calm, natural-history editorial", "安静、克制的自然志气质")},
    {id: "serif", name: text("Serif · editorial", "衬线 · 编辑"), stack: "var(--kit-font-serif)", use: text("Editorial headings and lead paragraphs only.", "仅用于编辑类标题和导语。"), sample: text("Vivid color held in restraint", "在克制中保留鲜明的颜色")},
    {id: "mono", name: text("Mono · code", "等宽 · 代码"), stack: "var(--font-mono)", use: text("Code, tokens, file paths and tabular IDs.", "代码、Token、文件路径与编号。"), sample: "--color-niltava-600"},
  ];
  const scale: {type: TypeName; role: string; sample: string}[] = [
    {type: "h1", role: text("Page title", "页面标题"), sample: text("Field notes", "野外笔记")},
    {type: "h2", role: text("Section", "章节"), sample: text("Spring survey", "春季调查")},
    {type: "h3", role: text("Subsection", "小节"), sample: text("North ridge", "北部山脊")},
    {type: "h4", role: text("Card title", "卡片标题"), sample: text("Recent sightings", "最近记录")},
    {type: "h5", role: text("Group label", "分组标题"), sample: text("Members", "成员")},
    {type: "h6", role: text("Small header", "小标题"), sample: text("Details", "详情")},
    {type: "body", role: text("Body", "正文"), sample: text("The blue niltava keeps to shaded forest edges and calls from low branches at dawn.", "蓝大翅鸲常在林缘阴处活动，清晨在低枝上鸣叫。")},
    {type: "body-sm", role: text("UI text", "界面文字"), sample: text("Tables, navigation, sidebar items and form help.", "表格、导航、侧边栏条目和表单说明。")},
    {type: "body-xs", role: text("Caption", "注释"), sample: text("Captions, badges and fine print.", "图注、角标和小字说明。")},
    {type: "code", role: text("Code", "代码"), sample: "npm i @heroui/react"},
  ];
  const rules = [
    text("Keep hierarchy in size and weight (400–600), not color. Secondary text uses the muted token.", "层级靠字号和字重（400–600）区分，不靠颜色。次要文字统一用 muted。"),
    text("Long-form lines run about 60–75 characters. Paragraphs wrap with text-wrap: pretty, headings with balance.", "长文每行约 60–75 个字符。段落用 text-wrap: pretty，标题用 balance。"),
    text("Chinese body text needs more line height than English: about 1.75 for body, 1.5 for UI text.", "中文正文需要比英文更大的行高：正文约 1.75，界面文字约 1.5。"),
    text("Only editorial headings use the serif stack. Buttons, labels and forms stay sans.", "只有编辑类标题使用衬线。按钮、标签和表单始终使用无衬线。"),
  ];

  return <div className="kit-type">
    <section className="kit-type__block" aria-labelledby="kit-type-families">
      <h4 id="kit-type-families" className="kit-type__label">{text("Families", "字体家族")}</h4>
      <div className="kit-type__families">
        {families.map((f) => <div key={f.id} className="kit-type__family">
          <span className="kit-type__specimen" style={{fontFamily: f.stack}}>Aa 永</span>
          <strong>{f.name}</strong>
          <code>{f.stack}</code>
          <p style={{fontFamily: f.stack}}>{f.sample}</p>
          <span className="kit-type__use">{f.use}</span>
        </div>)}
      </div>
    </section>
    <section className="kit-type__block" aria-labelledby="kit-type-scale">
      <h4 id="kit-type-scale" className="kit-type__label">{text("Scale", "字号层级")}</h4>
      <div className="kit-type__scale">
        {scale.map((row) => <div key={row.type} className="kit-type__row">
          <div className="kit-type__name"><code>{row.type}</code><span>{row.role}</span></div>
          <Metrics><Typography type={row.type}>{row.sample}</Typography></Metrics>
        </div>)}
      </div>
    </section>
    <section className="kit-type__block" aria-labelledby="kit-type-rules">
      <h4 id="kit-type-rules" className="kit-type__label">{text("Rules", "排版规则")}</h4>
      <ul className="kit-type__rules">{rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
    </section>
  </div>;
}
