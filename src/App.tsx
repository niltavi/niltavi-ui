import {
  Button,
  Card,
  Spinner,
  Surface,
  Table,
  ToggleButton,
  ToggleButtonGroup,
  Toast,
  toast,
} from "@heroui/react";
import {lazy, Suspense, useEffect, useState} from "react";

import tokens from "./theme/tokens.json";

const Showcase = lazy(() => import("./showcase/Showcase"));

type Mode = "light" | "dark";
type Vision = "normal" | "protan" | "deutan" | "tritan";

const SCALE_NAMES: Record<string, string> = {
  niltava: "Niltava 钴蓝",
  rufous: "Rufous 棕腹",
  glossy: "Glossy 亮斑",
  violet: "Violet 紫辉",
  throat: "Throat 喉墨",
  leaf: "Leaf 新叶",
  berry: "Berry 浆果",
  gold: "Gold 金腹",
};

// Machado et al. 2009, severity 1.0, applied in linear RGB (the SVG filter default).
const CVD_MATRIX: Record<Exclude<Vision, "normal">, number[][]> = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};

const VISION_LABEL: Record<Vision, string> = {normal: "正常", protan: "红色盲", deutan: "绿色盲", tritan: "蓝色盲"};

const CHART_DATA = [
  {month: "7月", values: [32, 18, 24, 12, 9, 6, 14, 5]},
  {month: "8月", values: [36, 22, 20, 15, 11, 8, 12, 6]},
  {month: "9月", values: [41, 25, 18, 17, 14, 7, 10, 8]},
  {month: "10月", values: [44, 31, 16, 19, 12, 10, 9, 7]},
  {month: "11月", values: [48, 34, 21, 22, 15, 11, 13, 9]},
];
const SERIES = ["仙鹟", "鸫", "莺", "鹛", "鹀", "啄木鸟", "翠鸟", "其他"];

function Icon({name}: {name: "sun" | "moon" | "arrow-up"}) {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {name === "sun" ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> :
        name === "moon" ? <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z" /> :
          <path d="M12 20V4m-6 6 6-6 6 6" />}
    </svg>
  );
}

function Segmented<T extends string>({value, options, icons, onChange, label}: {
  value: T;
  options: Record<T, string>;
  icons?: Record<T, React.ReactNode>;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = [...keys][0];
        if (typeof next === "string" && next in options) onChange(next as T);
      }}
      size="sm"
    >
      {(Object.keys(options) as T[]).map((key) => (
        <ToggleButton
          key={key}
          id={key}
          isIconOnly={!!icons}
          aria-label={options[key]}
        >
          {icons ? icons[key] : options[key]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

function Section({id, title, children}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="preview-section" aria-labelledby={`${id}-title`}>
      <div className="preview-section__heading">
        <h2 id={`${id}-title`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Scales() {
  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(
      () => toast(`已复制 ${hex}`),
      () => toast.danger("复制失败"),
    );
  };

  return (
    <div className="preview-stack--wide">
      {Object.entries(tokens.scales).map(([name, steps]) => (
        <div key={name} className="palette__scale">
          <div>
            <div className="palette__name">{SCALE_NAMES[name]}</div>
            <div className="preview-code">{name}</div>
          </div>
          <div className="palette__steps">
            {Object.entries(steps).map(([step, hex]) => (
              <button
                key={step}
                type="button"
                className="palette__step"
                aria-label={`${name}-${step} ${hex}`}
                onClick={() => copy(hex)}
              >
                <span
                  className="palette__swatch"
                  style={{background: hex, color: Number(step) >= 500 ? "var(--white)" : "var(--color-throat-950)"}}
                >
                  {step}
                </span>
                <span className="palette__hex">{hex}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Charts() {
  const max = 50;
  const w = 640;
  const h = 220;
  const pad = {l: 28, b: 24, t: 8};
  const groupW = (w - pad.l) / CHART_DATA.length;
  const barW = (groupW - 16) / SERIES.length;
  const y = (v: number) => pad.t + (h - pad.t - pad.b) * (1 - v / max);

  return (
    <Card>
      <Card.Content className="preview-stack--wide">
        <div className="chart-scroll">
          <svg viewBox={`0 0 ${w} ${h}`} className="chart" role="img" aria-label="各科鸟类月度记录数">
            {[0, 10, 20, 30, 40, 50].map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={w} y1={y(t)} y2={y(t)} stroke="var(--separator)" />
                <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="var(--muted)">
                  {t}
                </text>
              </g>
            ))}
            {CHART_DATA.map((d, gi) => (
              <g key={d.month}>
                {d.values.map((v, si) => (
                  <rect
                    key={si}
                    x={pad.l + gi * groupW + 8 + si * barW}
                    y={y(v)}
                    width={barW - 1.5}
                    height={y(0) - y(v)}
                    rx={2}
                    fill={`var(--chart-${si + 1})`}
                  />
                ))}
                <text x={pad.l + gi * groupW + groupW / 2} y={h - 6} textAnchor="middle" fontSize="11" fill="var(--muted)">
                  {d.month}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="chart-legend">
          {SERIES.map((s, i) => (
            <span key={s} className="chart-legend__item">
              <span className="chart-legend__swatch" style={{background: `var(--chart-${i + 1})`}} />
              {s}
              <span className="preview-code">chart-{i + 1}</span>
            </span>
          ))}
        </div>
        <div className="chart-ramps">
          <div className="chart-ramps__item">
            <span className="chart-ramps__label">顺序 · niltava 100 → 900</span>
            <div className="chart-ramps__strip">
              {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => (
                <span key={s} className="chart-ramps__step" style={{background: `var(--color-niltava-${s})`}} />
              ))}
            </div>
          </div>
          <div className="chart-ramps__item">
            <span className="chart-ramps__label">发散 · rufous ↔ niltava</span>
            <div className="chart-ramps__strip">
              {["rufous-700", "rufous-500", "rufous-300", "rufous-100", "throat-100", "niltava-100", "niltava-300", "niltava-500", "niltava-700"].map((r) => (
                <span key={r} className="chart-ramps__step" style={{background: `var(--color-${r})`}} />
              ))}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

function Audit({mode}: {mode: Mode}) {
  const rows = tokens.audit.filter((r) => r.mode === mode);
  const res = tokens.resolved[mode] as Record<string, string>;
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="对比度" className="contrast-table">
          <Table.Header>
            <Table.Column isRowHeader>前景</Table.Column>
            <Table.Column>背景</Table.Column>
            <Table.Column>对比度</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map((r) => (
              <Table.Row key={`${r.fg}-${r.bg}`}>
                <Table.Cell>
                  <span className="contrast-label">
                    <span
                      className="contrast-sample"
                      style={{background: res[r.bg] ?? "var(--surface)", color: res[r.fg] ?? `var(--${r.fg})`}}
                    >
                      Aa
                    </span>
                    {r.fg}
                  </span>
                </Table.Cell>
                <Table.Cell className="contrast-value">{r.bg}</Table.Cell>
                <Table.Cell className="contrast-ratio">{r.ratio.toFixed(2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export default function App() {
  const [mode, setMode] = useState<Mode>(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );
  const [vision, setVision] = useState<Vision>("normal");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    root.dataset.theme = mode;
  }, [mode]);

  return (
    <>
      <svg aria-hidden="true" className="vision-filters">
        {(Object.keys(CVD_MATRIX) as Exclude<Vision, "normal">[]).map((k) => (
          <filter key={k} id={`cvd-${k}`}>
            <feColorMatrix
              type="matrix"
              values={CVD_MATRIX[k].map((row) => `${row.join(" ")} 0 0`).join(" ") + " 0 0 0 1 0"}
            />
          </filter>
        ))}
      </svg>
      <Toast.Provider />
      <a href="#main-content" className="skip-link">跳到内容</a>
      <header id="page-top" tabIndex={-1} className="preview-header">
        <div className="preview-header__inner">
          <a href="#main-content" className="preview-brand" aria-label="Niltavi UI 首页">
            niltavi<span>.</span>
            <span className="preview-brand__label">UI</span>
          </a>
          <Surface className="surface--controls preview-controls">
            <Segmented label="主题" value={mode} options={{light: "浅色", dark: "深色"}} icons={{light: <Icon name="sun" />, dark: <Icon name="moon" />}} onChange={setMode} />
            <Segmented label="色觉模拟" value={vision} options={VISION_LABEL} onChange={setVision} />
          </Surface>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="preview-main"
        style={{filter: vision === "normal" ? undefined : `url(#cvd-${vision})`}}
      >
        <Section id="components" title="组件">
          <Suspense fallback={<Spinner aria-label="加载组件" />}><Showcase /></Suspense>
        </Section>
        <Section id="palette" title="色阶">
          <Scales />
        </Section>
        <Section id="charts" title="图表">
          <Charts />
        </Section>
        <Section id="contrast" title="对比度">
          <Audit mode={mode} />
        </Section>
        <footer className="preview-footer">
          <Button isIconOnly variant="ghost" aria-label="回到顶部" onPress={() => {
            const top = document.getElementById("page-top");
            top?.scrollIntoView();
            top?.focus({preventScroll: true});
          }}><Icon name="arrow-up" /></Button>
        </footer>
      </main>
    </>
  );
}
