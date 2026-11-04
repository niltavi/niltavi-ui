import {
  Alert,
  Button,
  Card,
  Checkbox,
  Chip,
  Description,
  FieldError,
  Input,
  Label,
  Meter,
  Modal,
  Switch,
  Table,
  Tabs,
  TextField,
  Toast,
  toast,
} from "@heroui/react";
import {useEffect, useState} from "react";

import tokens from "./theme/tokens.json";

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

const RUFOUS_BUTTON =
  "[--button-bg:var(--rufous)] [--button-bg-hover:var(--rufous-hover)] [--button-bg-pressed:var(--rufous-hover)] [--button-fg:var(--rufous-foreground)]";

const CHART_DATA = [
  {month: "7月", values: [32, 18, 24, 12, 9, 6, 14, 5]},
  {month: "8月", values: [36, 22, 20, 15, 11, 8, 12, 6]},
  {month: "9月", values: [41, 25, 18, 17, 14, 7, 10, 8]},
  {month: "10月", values: [44, 31, 16, 19, 12, 10, 9, 7]},
  {month: "11月", values: [48, 34, 21, 22, 15, 11, 13, 9]},
];
const SERIES = ["仙鹟", "鸫", "莺", "鹛", "鹀", "啄木鸟", "翠鸟", "其他"];

function Segmented<T extends string>({value, options, onChange, label}: {
  value: T;
  options: Record<T, string>;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div aria-label={label} className="flex gap-1 rounded-xl bg-default p-1" role="group">
      {(Object.keys(options) as T[]).map((key) => (
        <Button
          key={key}
          size="sm"
          variant={key === value ? "primary" : "ghost"}
          aria-pressed={key === value}
          onPress={() => onChange(key)}
        >
          {options[key]}
        </Button>
      ))}
    </div>
  );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
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
    <div className="flex flex-col gap-6">
      {Object.entries(tokens.scales).map(([name, steps]) => (
        <div key={name} className="grid gap-3 md:grid-cols-[150px_1fr]">
          <div>
            <div className="font-semibold">{SCALE_NAMES[name]}</div>
            <div className="font-mono text-xs text-muted">{name}</div>
          </div>
          <div className="grid grid-cols-6 gap-1 sm:grid-cols-12">
            {Object.entries(steps).map(([step, hex]) => (
              <button
                key={step}
                type="button"
                className="group flex flex-col gap-1 text-left"
                aria-label={`${name}-${step} ${hex}`}
                onClick={() => copy(hex)}
              >
                <span
                  className="flex h-12 items-end rounded-md p-1.5 font-mono text-[10px] transition-transform group-hover:-translate-y-0.5"
                  style={{background: hex, color: Number(step) >= 500 ? "#fff" : "var(--color-throat-950)"}}
                >
                  {step}
                </span>
                <span className="font-mono text-[10px] text-muted">{hex}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Components() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <Card.Header>
          <Card.Title>按钮</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button>保存记录</Button>
            <Button className={RUFOUS_BUTTON}>上传照片</Button>
            <Button variant="secondary">次要</Button>
            <Button variant="tertiary">三级</Button>
            <Button variant="outline">描边</Button>
            <Button variant="ghost">幽灵</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="danger">删除</Button>
            <Button variant="danger-soft">移除</Button>
            <Button isDisabled>禁用</Button>
            <Button isDisabled variant="secondary">
              禁用
            </Button>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>标签</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col gap-3">
          {(["primary", "secondary", "soft"] as const).map((variant) => (
            <div key={variant} className="flex flex-wrap gap-2">
              <Chip variant={variant}>默认</Chip>
              <Chip color="accent" variant={variant}>
                仙鹟属
              </Chip>
              <Chip color="success" variant={variant}>
                已核验
              </Chip>
              <Chip color="warning" variant={variant}>
                待补充
              </Chip>
              <Chip color="danger" variant={variant}>
                误认
              </Chip>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-rufous-soft px-2.5 py-0.5 text-xs font-medium text-rufous-soft-foreground">
              新物种 +2
            </span>
            <span className="rounded-full bg-info-soft px-2.5 py-0.5 text-xs font-medium text-info-soft-foreground">
              迁徙季
            </span>
          </div>
        </Card.Content>
      </Card>

      <div className="flex flex-col gap-3">
        <Alert status="accent">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>同步完成</Alert.Title>
            <Alert.Description>11 月的 48 条记录已上传。</Alert.Description>
          </Alert.Content>
        </Alert>
        <Alert status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>鉴定通过</Alert.Title>
          </Alert.Content>
        </Alert>
        <Alert status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>3 张照片缺少拍摄地点</Alert.Title>
          </Alert.Content>
        </Alert>
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>上传中断</Alert.Title>
            <Alert.Description>请检查网络后重试。</Alert.Description>
          </Alert.Content>
        </Alert>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>观鸟记录 · 11 月</Card.Title>
          <Card.Description>大帽山 · 6 次出行</Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <Meter aria-label="年度目标" value={68}>
            <Label>年度目标</Label>
            <Meter.Output />
            <Meter.Track>
              <Meter.Fill />
            </Meter.Track>
          </Meter>
          <TextField name="species">
            <Label>物种</Label>
            <Input placeholder="如 Niltava sundara" />
            <Description>支持学名与中文名</Description>
          </TextField>
          <TextField isInvalid name="count" defaultValue="-1">
            <Label>数量</Label>
            <Input />
            <FieldError>数量必须大于 0</FieldError>
          </TextField>
          <div className="flex flex-wrap gap-6">
            <Switch defaultSelected>
              <Switch.Content>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                公开记录
              </Switch.Content>
            </Switch>
            <Checkbox defaultSelected>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>附带 GPS</Checkbox.Content>
            </Checkbox>
          </div>
        </Card.Content>
        <Card.Footer className="flex gap-2">
          <Modal>
            <Button variant="secondary">删除记录</Button>
            <Modal.Backdrop>
              <Modal.Container>
                <Modal.Dialog className="sm:max-w-[380px]">
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <Modal.Heading>删除这条记录？</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <p>棕腹仙鹟 · 2026-11-02 的记录和 4 张照片会一起删除。</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button slot="close" variant="tertiary">
                      取消
                    </Button>
                    <Button slot="close" variant="danger">
                      删除
                    </Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
          <Button variant="tertiary" onPress={() => toast.success("记录已保存")}>
            Toast
          </Button>
          <Button variant="tertiary" onPress={() => toast.warning("照片缺少地点")}>
            警告 Toast
          </Button>
        </Card.Footer>
      </Card>

      <Card className="lg:col-span-2">
        <Card.Content className="flex flex-col gap-4">
          <Tabs>
            <Tabs.ListContainer>
              <Tabs.List aria-label="记录视图">
                <Tabs.Tab id="list">
                  列表
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="map">
                  地图
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="stats">
                  统计
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
            <Tabs.Panel id="list">
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="观鸟记录" className="min-w-[520px]">
                    <Table.Header>
                      <Table.Column isRowHeader>物种</Table.Column>
                      <Table.Column>学名</Table.Column>
                      <Table.Column>数量</Table.Column>
                      <Table.Column>状态</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {[
                        ["棕腹仙鹟", "Niltava sundara", 3, "success", "已核验"],
                        ["棕腹大仙鹟", "Niltava davidi", 1, "warning", "待补充"],
                        ["大仙鹟", "Niltava grandis", 2, "success", "已核验"],
                        ["小仙鹟", "Niltava macgrigoriae", 1, "danger", "误认"],
                      ].map(([zh, la, n, color, status]) => (
                        <Table.Row key={String(la)}>
                          <Table.Cell>{zh}</Table.Cell>
                          <Table.Cell className="italic text-muted">{la}</Table.Cell>
                          <Table.Cell>{n}</Table.Cell>
                          <Table.Cell>
                            <Chip color={color as "success" | "warning" | "danger"} variant="soft">
                              {status}
                            </Chip>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Tabs.Panel>
            <Tabs.Panel id="map" className="py-6 text-muted">
              地图视图
            </Tabs.Panel>
            <Tabs.Panel id="stats" className="py-6 text-muted">
              统计视图
            </Tabs.Panel>
          </Tabs>
        </Card.Content>
      </Card>
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
      <Card.Content className="flex flex-col gap-6">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[520px]" role="img" aria-label="各科鸟类月度记录数">
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
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {SERIES.map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm" style={{background: `var(--chart-${i + 1})`}} />
              {s}
              <span className="font-mono text-xs text-muted">chart-{i + 1}</span>
            </span>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-muted">顺序 · niltava 100 → 900</span>
            <div className="flex h-6 overflow-hidden rounded-md">
              {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => (
                <span key={s} className="flex-1" style={{background: `var(--color-niltava-${s})`}} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-muted">发散 · rufous ↔ niltava</span>
            <div className="flex h-6 overflow-hidden rounded-md">
              {["rufous-700", "rufous-500", "rufous-300", "rufous-100", "throat-100", "niltava-100", "niltava-300", "niltava-500", "niltava-700"].map((r) => (
                <span key={r} className="flex-1" style={{background: `var(--color-${r})`}} />
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
        <Table.Content aria-label="对比度" className="min-w-[480px]">
          <Table.Header>
            <Table.Column isRowHeader>前景</Table.Column>
            <Table.Column>背景</Table.Column>
            <Table.Column>对比度</Table.Column>
            <Table.Column>目标</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map((r) => (
              <Table.Row key={`${r.fg}-${r.bg}`}>
                <Table.Cell>
                  <span className="flex items-center gap-2 font-mono text-xs">
                    <span
                      className="flex size-6 items-center justify-center rounded text-[10px] font-semibold"
                      style={{background: res[r.bg] ?? "var(--surface)", color: res[r.fg] ?? `var(--${r.fg})`}}
                    >
                      Aa
                    </span>
                    {r.fg}
                  </span>
                </Table.Cell>
                <Table.Cell className="font-mono text-xs">{r.bg}</Table.Cell>
                <Table.Cell className="font-mono text-xs tabular-nums">{r.ratio.toFixed(2)}</Table.Cell>
                <Table.Cell>
                  <Chip color={r.pass ? "success" : "danger"} variant="soft">
                    ≥ {r.target}
                  </Chip>
                </Table.Cell>
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
      <svg aria-hidden="true" className="absolute size-0">
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
      <header className="sticky top-0 z-10 border-b border-separator bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight">Niltava UI</span>
            <span className="font-mono text-xs text-muted">HeroUI v3 theme</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Segmented label="主题" value={mode} options={{light: "浅色", dark: "深色"}} onChange={setMode} />
            <Segmented label="色觉模拟" value={vision} options={VISION_LABEL} onChange={setVision} />
          </div>
        </div>
      </header>
      <main
        className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-10"
        style={{filter: vision === "normal" ? undefined : `url(#cvd-${vision})`}}
      >
        <Section title="色阶">
          <Scales />
        </Section>
        <Section title="组件">
          <Components />
        </Section>
        <Section title="图表">
          <Charts />
        </Section>
        <Section title="对比度">
          <Audit mode={mode} />
        </Section>
      </main>
    </>
  );
}
