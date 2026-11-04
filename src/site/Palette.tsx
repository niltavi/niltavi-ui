import {memo, useEffect} from "react";
import {scrollToSection} from "./navigation";
import {Card, Table, toast} from "@heroui/react";
import tokens from "../theme/tokens.json";
import {paletteScales} from "./paletteCatalog";
import {useText} from "./Locale";

const CHART_DATA = [
  {month: "7月", values: [32, 18, 24, 12, 9, 6, 14, 5]},
  {month: "8月", values: [36, 22, 20, 15, 11, 8, 12, 6]},
  {month: "9月", values: [41, 25, 18, 17, 14, 7, 10, 8]},
  {month: "10月", values: [44, 31, 16, 19, 12, 10, 9, 7]},
  {month: "11月", values: [48, 34, 21, 22, 15, 11, 13, 9]},
];
const SERIES = ["仙鹟", "鸫", "莺", "鹛", "鹀", "啄木鸟", "翠鸟", "其他"];

function Scales() {
  const text = useText();
  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(
      () => toast(`${text("Copied", "已复制")} ${hex}`),
      () => toast.danger(text("Copy failed", "复制失败")),
    );
  };

  return (
    <div className="preview-stack--wide">
      {Object.entries(tokens.scales).map(([name, steps]) => (
        <section key={name} id={`palette-${name}`} className="palette__scale" aria-labelledby={`palette-${name}-title`}>
          <div>
            <h2 id={`palette-${name}-title`} className="palette__name">{text(name[0].toUpperCase() + name.slice(1), paletteScales.find((section) => section.id === name)?.zh ?? name)}</h2>
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
        </section>
      ))}
    </div>
  );
}

function Charts() {
  const text = useText();
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
          <svg viewBox={`0 0 ${w} ${h}`} className="chart" role="img" aria-label={text("Monthly bird sightings", "鸟类月度记录")}>
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
                  {text(["Jul", "Aug", "Sep", "Oct", "Nov"][gi], d.month)}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="chart-legend">
          {SERIES.map((s, i) => (
            <span key={s} className="chart-legend__item">
              <span className="chart-legend__swatch" style={{background: `var(--chart-${i + 1})`}} />
              {text(["Niltava", "Thrush", "Warbler", "Babbler", "Bunting", "Woodpecker", "Kingfisher", "Other"][i], s)}
              <span className="preview-code">chart-{i + 1}</span>
            </span>
          ))}
        </div>
        <div className="chart-ramps">
          <div className="chart-ramps__item">
            <span className="chart-ramps__label">{text("Sequential", "顺序")} · niltava 100 → 900</span>
            <div className="chart-ramps__strip">
              {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => (
                <span key={s} className="chart-ramps__step" style={{background: `var(--color-niltava-${s})`}} />
              ))}
            </div>
          </div>
          <div className="chart-ramps__item">
            <span className="chart-ramps__label">{text("Diverging", "发散")} · rufous ↔ niltava</span>
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

function Audit({mode}: {mode: "light" | "dark"}) {
  const text = useText();
  const rows = tokens.audit.filter((r) => r.mode === mode);
  const res = tokens.resolved[mode] as Record<string, string>;
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label={text("Contrast", "对比度")} className="contrast-table">
          <Table.Header>
            <Table.Column isRowHeader>{text("Foreground", "前景")}</Table.Column>
            <Table.Column>{text("Background", "背景")}</Table.Column>
            <Table.Column>{text("Contrast", "对比度")}</Table.Column>
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

function Palette({mode, section}: {mode: "light" | "dark"; section: string}) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToSection("palette", section));
    return () => cancelAnimationFrame(frame);
  }, [section]);
  const text = useText();
  return <div className="palette-page">
    <section id="palette-colors" className="palette-section palette-colors" aria-labelledby="palette-colors-title">
      <h1 id="palette-colors-title">{text("Palette", "色卡")}</h1>
      <Scales />
    </section>
    <section id="palette-charts" className="palette-section"><h2>{text("Charts", "图表")}</h2><Charts /></section>
    <section id="palette-contrast" className="palette-section"><h2>{text("Contrast", "对比度")}</h2><Audit mode={mode} /></section>
  </div>;
}

export default memo(Palette);
