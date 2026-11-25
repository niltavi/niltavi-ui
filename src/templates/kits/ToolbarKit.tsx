import {Bold, Calendar, ChartColumn, ChevronDown, CircleChevronDown, Comment, Ellipsis, FileArrowUp, Font, Italic, LayoutCells, Link as LinkIcon, ListUl, Paintbrush, Person, Plus, Sparkles, Square, SquareCheck, TextAlignCenter, TextAlignLeft, TextAlignRight, Underline} from "@gravity-ui/icons";
import {Button, Dropdown, Input, Label, Separator, ToggleButton, ToggleButtonGroup, Toolbar, Tooltip, toast} from "@heroui/react";
import {useState, type ComponentType, type ReactNode, type SVGProps} from "react";
import {useText} from "../../site/Locale";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type Align = "left" | "center" | "right";
type Tone = "default" | "accent" | "success" | "warning" | "danger";
type NumberFormat = "auto" | "number" | "percent" | "currency";
type Cell = {value: string; bold?: boolean; italic?: boolean; underline?: boolean; align?: Align; color?: Tone; fill?: Tone; format?: NumberFormat};
type Sheet = {id: string; name: string; cells: Record<string, Cell>};

const columns = ["A", "B", "C", "D", "E", "F"];
const rowCount = 14;
const tones: Tone[] = ["default", "accent", "success", "warning", "danger"];

function seedCells(): Record<string, Cell> {
  const rows = [["Species", "Site", "Count", "Share"], ["Blue niltava", "North ridge", "18", "0.36"], ["Rufous-bellied niltava", "Fern valley", "11", "0.22"], ["Large niltava", "Upper stream", "9", "0.18"], ["Small niltava", "Bamboo grove", "12", "0.24"]];
  const cells: Record<string, Cell> = {};
  rows.forEach((row, r) => row.forEach((value, c) => { cells[`${columns[c]}${r + 1}`] = {value, bold: r === 0, align: c >= 2 ? "right" : "left", format: c === 3 && r > 0 ? "percent" : undefined}; }));
  return cells;
}

function display(cell: Cell | undefined, locale: string) {
  if (!cell) return "";
  const n = Number(cell.value);
  if (!cell.format || cell.format === "auto" || cell.value === "" || Number.isNaN(n)) return cell.value;
  const options = ({number: {minimumFractionDigits: 2}, percent: {style: "percent"}, currency: {style: "currency", currency: "SGD"}} satisfies Record<string, Intl.NumberFormatOptions>)[cell.format] as Intl.NumberFormatOptions;
  return new Intl.NumberFormat(locale, options).format(n);
}

function Tip({label, children}: {label: string; children: ReactNode}) {
  return <Tooltip delay={400} closeDelay={0}>{children}<Tooltip.Content><p>{label}</p></Tooltip.Content></Tooltip>;
}

function ToolButton({label, icon: Glyph, onPress}: {label: string; icon: Icon; onPress?: (label: string) => void}) {
  return <Tip label={label}><Button isIconOnly size="sm" variant="ghost" aria-label={label} onPress={() => onPress?.(label)}><Glyph aria-hidden="true" width={16} height={16} /></Button></Tip>;
}

/* ---------- Quick actions ---------- */
export function QuickActions({onAction}: {onAction: (label: string) => void}) {
  const text = useText();
  const items: {id: string; label: string; icon: Icon}[] = [
    {id: "ask", label: text("Ask Agent", "问 Agent"), icon: Sparkles},
    {id: "csv", label: text("Import CSV", "导入 CSV"), icon: FileArrowUp},
    {id: "xlsx", label: text("Import Excel", "导入 Excel"), icon: LayoutCells},
    {id: "link", label: text("Import from link", "从链接导入"), icon: LinkIcon},
  ];
  return <Toolbar aria-label={text("Quick actions", "快捷操作")} className="kit-bar kit-bar--quick">
    {items.map(({id, label, icon: Glyph}) => <Button key={id} size="sm" variant="ghost" onPress={() => onAction(label)}>
      <Glyph aria-hidden="true" width={16} height={16} className={id === "ask" ? "kit-bar__spark" : undefined} />{label}
    </Button>)}
  </Toolbar>;
}

/* ---------- Format toolbar ---------- */
export function FormatToolbar({cell, onChange, onAction}: {cell: Cell; onChange: (patch: Partial<Cell>) => void; onAction: (label: string) => void}) {
  const text = useText();
  const styles = (["bold", "italic", "underline"] as const).filter((key) => cell[key]);
  const AlignIcon = {left: TextAlignLeft, center: TextAlignCenter, right: TextAlignRight}[cell.align ?? "left"];
  const toneLabel: Record<Tone, string> = {default: text("Default", "默认"), accent: text("Blue", "蓝"), success: text("Green", "绿"), warning: text("Ochre", "赭"), danger: text("Red", "红")};

  const toneMenu = (key: "color" | "fill", label: string, glyph: Icon) => <Dropdown>
    <Tip label={label}><Button isIconOnly size="sm" variant="ghost" aria-label={label} className="kit-bar__tone" data-tone={cell[key] ?? "default"} data-kind={key}>
      {(() => { const G = glyph; return <G aria-hidden="true" width={16} height={16} />; })()}
    </Button></Tip>
    <Dropdown.Popover placement="top">
      <Dropdown.Menu aria-label={label} selectionMode="single" selectedKeys={[cell[key] ?? "default"]} onAction={(k) => onChange({[key]: k as Tone})}>
        {tones.map((tone) => <Dropdown.Item key={tone} id={tone} textValue={toneLabel[tone]}>
          <span className="kit-swatch" data-tone={tone} data-kind={key} aria-hidden="true" /><Label>{toneLabel[tone]}</Label><Dropdown.ItemIndicator />
        </Dropdown.Item>)}
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown>;

  return <Toolbar aria-label={text("Format", "格式")} className="kit-bar kit-bar--format">
    <ToggleButtonGroup aria-label={text("Text style", "文字样式")} selectionMode="multiple" size="sm" selectedKeys={styles}
      onSelectionChange={(keys) => onChange({bold: keys.has("bold"), italic: keys.has("italic"), underline: keys.has("underline")})}>
      <ToggleButton isIconOnly id="bold" aria-label={text("Bold", "加粗")}><Bold aria-hidden="true" width={16} height={16} /></ToggleButton>
      <ToggleButton isIconOnly id="italic" aria-label={text("Italic", "斜体")}><Italic aria-hidden="true" width={16} height={16} /></ToggleButton>
      <ToggleButton isIconOnly id="underline" aria-label={text("Underline", "下划线")}><Underline aria-hidden="true" width={16} height={16} /></ToggleButton>
    </ToggleButtonGroup>
    <Dropdown>
      <Tip label={text("Align", "对齐")}><Button size="sm" variant="ghost" aria-label={text("Align", "对齐")} className="kit-bar__split"><AlignIcon aria-hidden="true" width={16} height={16} /><ChevronDown aria-hidden="true" width={12} height={12} /></Button></Tip>
      <Dropdown.Popover placement="top">
        <Dropdown.Menu aria-label={text("Align", "对齐")} selectionMode="single" selectedKeys={[cell.align ?? "left"]} onAction={(k) => onChange({align: k as Align})}>
          <Dropdown.Item id="left" textValue={text("Left", "左对齐")}><TextAlignLeft aria-hidden="true" width={14} height={14} /><Label>{text("Left", "左对齐")}</Label><Dropdown.ItemIndicator /></Dropdown.Item>
          <Dropdown.Item id="center" textValue={text("Center", "居中")}><TextAlignCenter aria-hidden="true" width={14} height={14} /><Label>{text("Center", "居中")}</Label><Dropdown.ItemIndicator /></Dropdown.Item>
          <Dropdown.Item id="right" textValue={text("Right", "右对齐")}><TextAlignRight aria-hidden="true" width={14} height={14} /><Label>{text("Right", "右对齐")}</Label><Dropdown.ItemIndicator /></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
    <Separator orientation="vertical" />
    {toneMenu("color", text("Text color", "文字颜色"), Font)}
    {toneMenu("fill", text("Fill color", "填充颜色"), Paintbrush)}
    <ToolButton label={text("Borders", "边框")} icon={Square} onPress={onAction} />
    <ToolButton label={text("Merge cells", "合并单元格")} icon={LayoutCells} onPress={onAction} />
    <ToolButton label={text("Insert chart", "插入图表")} icon={ChartColumn} onPress={onAction} />
    <Separator orientation="vertical" />
    <Dropdown>
      <Tip label={text("Number format", "数字格式")}><Button size="sm" variant="ghost" aria-label={text("Number format", "数字格式")} className="kit-bar__split"><span className="kit-bar__num" aria-hidden="true">123</span><ChevronDown aria-hidden="true" width={12} height={12} /></Button></Tip>
      <Dropdown.Popover placement="top">
        <Dropdown.Menu aria-label={text("Number format", "数字格式")} selectionMode="single" selectedKeys={[cell.format ?? "auto"]} onAction={(k) => onChange({format: k as NumberFormat})}>
          {([["auto", "Automatic", "自动"], ["number", "Number", "数字"], ["percent", "Percent", "百分比"], ["currency", "Currency", "货币"]] as const).map(([id, en, zh]) =>
            <Dropdown.Item key={id} id={id} textValue={text(en, zh)}><Label>{text(en, zh)}</Label><Dropdown.ItemIndicator /></Dropdown.Item>)}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
    <ToolButton label={text("Dropdown", "下拉选项")} icon={CircleChevronDown} onPress={onAction} />
    <ToolButton label={text("Person", "人员")} icon={Person} onPress={onAction} />
    <ToolButton label={text("Date", "日期")} icon={Calendar} onPress={onAction} />
    <ToolButton label={text("Checkbox", "复选框")} icon={SquareCheck} onPress={onAction} />
    <ToolButton label={text("More", "更多")} icon={Ellipsis} onPress={onAction} />
    <Separator orientation="vertical" />
    <ToolButton label={text("Comment", "评论")} icon={Comment} onPress={onAction} />
    <Button size="sm" variant="secondary" onPress={() => onAction(text("Ask Agent", "问 Agent"))}>{text("Ask Agent", "问 Agent")}</Button>
  </Toolbar>;
}

/* ---------- Sheet tabs ---------- */
export function SheetTabs({sheets, active, onSelect, onAdd, onRename, onDuplicate, onRemove}: {
  sheets: {id: string; name: string}[];
  active: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const text = useText();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const commit = () => { if (renaming && draft.trim()) onRename(renaming, draft.trim()); setRenaming(null); };

  return <div className="kit-sheets" role="toolbar" aria-label={text("Sheets", "工作表")}>
    <ToolButton label={text("Add sheet", "新增工作表")} icon={Plus} onPress={() => onAdd()} />
    <Dropdown>
      <Tip label={text("All sheets", "全部工作表")}><Button size="sm" variant="ghost" aria-label={text("All sheets", "全部工作表")} className="kit-bar__split"><ListUl aria-hidden="true" width={16} height={16} /><ChevronDown aria-hidden="true" width={12} height={12} /></Button></Tip>
      <Dropdown.Popover placement="top start">
        <Dropdown.Menu aria-label={text("All sheets", "全部工作表")} selectionMode="single" selectedKeys={[active]} onAction={(k) => onSelect(String(k))}>
          {sheets.map((s) => <Dropdown.Item key={s.id} id={s.id} textValue={s.name}><Label>{s.name}</Label><Dropdown.ItemIndicator /></Dropdown.Item>)}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
    <div className="kit-sheets__list">
      {sheets.map((s) => renaming === s.id
        ? <Input key={s.id} aria-label={text("Sheet name", "工作表名称")} autoFocus value={draft} className="kit-sheets__rename"
          onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setRenaming(null); }} />
        : s.id === active
          ? <Dropdown key={s.id}>
            <Button size="sm" variant="secondary" className="kit-sheets__tab" aria-current="page" aria-label={text(`${s.name}, sheet options`, `${s.name}，工作表选项`)}>{s.name}<ChevronDown aria-hidden="true" width={12} height={12} /></Button>
            <Dropdown.Popover placement="top start">
              <Dropdown.Menu aria-label={text("Sheet options", "工作表选项")} disabledKeys={sheets.length < 2 ? ["delete"] : []} onAction={(k) => {
                if (k === "rename") { setDraft(s.name); setRenaming(s.id); }
                else if (k === "duplicate") onDuplicate(s.id);
                else if (k === "delete") onRemove(s.id);
              }}>
                <Dropdown.Item id="rename" textValue={text("Rename", "重命名")}><Label>{text("Rename", "重命名")}</Label></Dropdown.Item>
                <Dropdown.Item id="duplicate" textValue={text("Duplicate", "复制")}><Label>{text("Duplicate", "复制")}</Label></Dropdown.Item>
                <Dropdown.Item id="delete" textValue={text("Delete", "删除")} variant="danger"><Label>{text("Delete", "删除")}</Label></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
          : <Button key={s.id} size="sm" variant="ghost" className="kit-sheets__tab" onPress={() => onSelect(s.id)}>{s.name}</Button>)}
    </div>
  </div>;
}

/* ---------- Composite sheet ---------- */
export function ToolbarKit() {
  const text = useText();
  const [sheets, setSheets] = useState<Sheet[]>(() => [{id: "s1", name: "Sheet1", cells: seedCells()}]);
  const [active, setActive] = useState("s1");
  const [selected, setSelected] = useState("A2");
  const [count, setCount] = useState(1);
  const sheet = sheets.find((s) => s.id === active) ?? sheets[0]!;
  const cell = sheet.cells[selected] ?? {value: ""};
  const locale = text("en", "zh-CN");

  const patch = (change: Partial<Cell>) => setSheets((all) => all.map((s) => s.id !== sheet.id ? s : {...s, cells: {...s.cells, [selected]: {...(s.cells[selected] ?? {value: ""}), ...change}}}));
  const act = (label: string) => toast(`${label} · ${selected}`);
  const add = () => { const n = count + 1; const id = `s${Date.now()}`; setCount(n); setSheets((all) => [...all, {id, name: `Sheet${n}`, cells: {}}]); setActive(id); };

  return <div className="kit-sheet">
    <div className="kit-sheet__grid" role="grid" aria-label={sheet.name}>
      <div role="row" className="kit-sheet__row">
        <span className="kit-sheet__corner" />
        {columns.map((c) => <span key={c} role="columnheader" className="kit-sheet__head">{c}</span>)}
      </div>
      {Array.from({length: rowCount}, (_, r) => <div key={r} role="row" className="kit-sheet__row">
        <span role="rowheader" className="kit-sheet__head">{r + 1}</span>
        {columns.map((c) => {
          const id = `${c}${r + 1}`, data = sheet.cells[id];
          return <button key={id} type="button" role="gridcell" className="kit-sheet__cell" aria-selected={selected === id} onClick={() => setSelected(id)}
            data-align={data?.align} data-bold={data?.bold || undefined} data-italic={data?.italic || undefined} data-underline={data?.underline || undefined}
            data-color={data?.color !== "default" ? data?.color : undefined} data-fill={data?.fill !== "default" ? data?.fill : undefined}>{display(data, locale)}</button>;
        })}
      </div>)}
    </div>
    <div className="kit-sheet__float">
      <QuickActions onAction={act} />
      <FormatToolbar cell={cell} onChange={patch} onAction={act} />
    </div>
    <SheetTabs sheets={sheets} active={sheet.id} onSelect={setActive} onAdd={add}
      onRename={(id, name) => setSheets((all) => all.map((s) => s.id === id ? {...s, name} : s))}
      onDuplicate={(id) => { const from = sheets.find((s) => s.id === id)!; const copy = {...from, id: `s${Date.now()}`, name: text(`${from.name} copy`, `${from.name} 副本`)}; setSheets((all) => [...all, copy]); setActive(copy.id); }}
      onRemove={(id) => { const rest = sheets.filter((s) => s.id !== id); setSheets(rest); setActive(rest[0]!.id); }} />
  </div>;
}
