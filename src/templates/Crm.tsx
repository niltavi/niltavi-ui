import {Briefcase, Calendar, ChartColumn, Envelope, Funnel, Handset, House, Persons, Plus, Target} from "@gravity-ui/icons";
import {Button, Card, Chip, ProgressBar, Table} from "@heroui/react";
import {useState} from "react";
import {useText} from "../site/Locale";
import {AppShell, IconButton, PersonAvatar, Segmented, type NavItem} from "./shell";

const nav: NavItem[] = [
  {id: "home", en: "Home", zh: "首页", icon: House},
  {id: "pipeline", en: "Pipeline", zh: "销售管道", icon: Funnel},
  {id: "contacts", en: "Contacts", zh: "联系人", icon: Persons},
  {id: "companies", en: "Companies", zh: "公司", icon: Briefcase},
  {id: "tasks", en: "Tasks", zh: "任务", icon: Calendar, count: 6},
  {id: "reports", en: "Reports", zh: "报表", icon: ChartColumn},
];

const stages = [
  {id: "lead", en: "Lead", zh: "线索", color: "default"},
  {id: "qualified", en: "Qualified", zh: "已验证", color: "accent"},
  {id: "proposal", en: "Proposal", zh: "方案", color: "warning"},
  {id: "won", en: "Won", zh: "赢单", color: "success"},
] as const;
type Stage = typeof stages[number]["id"];

const deals: {id: string; company: string; owner: string; value: number; stage: Stage; probability: number; close: string}[] = [
  {id: "d1", company: "Fernwood Studio", owner: "Mira Chen", value: 48000, stage: "proposal", probability: 70, close: "Nov 28"},
  {id: "d2", company: "Riverbend Co.", owner: "Arjun Patel", value: 125000, stage: "qualified", probability: 45, close: "Dec 12"},
  {id: "d3", company: "Lumen Labs", owner: "Sofia Lim", value: 32000, stage: "won", probability: 100, close: "Nov 04"},
  {id: "d4", company: "Mossgate", owner: "Daniel Ong", value: 18500, stage: "lead", probability: 15, close: "Jan 09"},
  {id: "d5", company: "Kestrel Health", owner: "Hana Sato", value: 87000, stage: "proposal", probability: 60, close: "Dec 03"},
  {id: "d6", company: "Pinecrest Hotels", owner: "Leo Tan", value: 64000, stage: "qualified", probability: 40, close: "Dec 20"},
  {id: "d7", company: "Orchard & Oak", owner: "Mira Chen", value: 22000, stage: "lead", probability: 20, close: "Jan 15"},
];

const activities = [
  {icon: Handset, en: "Call with Riverbend Co. procurement", zh: "与 Riverbend Co. 采购通话", time: "10:30", who: "Arjun Patel"},
  {icon: Envelope, en: "Proposal sent to Kestrel Health", zh: "已向 Kestrel Health 发送方案", time: "09:12", who: "Hana Sato"},
  {icon: Target, en: "Lumen Labs marked as won", zh: "Lumen Labs 已赢单", time: "Yesterday", who: "Sofia Lim"},
];

const money = (n: number) => `$${n >= 1000 ? `${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k` : n}`;

export default function CrmTemplate() {
  const text = useText();
  const [page, setPage] = useState("pipeline");
  const [view, setView] = useState<"board" | "table">("board");
  const total = deals.reduce((s, d) => s + d.value, 0);
  const weighted = deals.reduce((s, d) => s + d.value * d.probability / 100, 0);
  const stageOf = (id: Stage) => stages.find((s) => s.id === id)!;

  return <AppShell brand="Kestrel" nav={nav} active={page} onNavigate={setPage}
    title={<><h3>{text("Sales pipeline", "销售管道")}</h3><p>{text("Q4 · 7 open deals", "第四季度 · 7 个商机")}</p></>}
    actions={<><Segmented label={text("View", "视图")} value={view} onChange={setView} options={[{id: "board", label: text("Board", "看板")}, {id: "table", label: text("Table", "表格")}]} /><Button size="sm"><Plus aria-hidden="true" width={16} height={16} />{text("New deal", "新商机")}</Button></>}>
    <div className="tpl-grid tpl-grid--kpi">
      {[
        {en: "Pipeline value", zh: "管道总额", value: money(total)},
        {en: "Weighted forecast", zh: "加权预测", value: money(Math.round(weighted))},
        {en: "Win rate", zh: "赢单率", value: "32%"},
        {en: "Avg. cycle", zh: "平均周期", value: text("24 days", "24 天")},
      ].map((k) => <Card key={k.en} className="tpl-kpi"><span className="tpl-kpi__label">{text(k.en, k.zh)}</span><strong className="tpl-kpi__value">{k.value}</strong></Card>)}
    </div>
    {view === "board" ? <div className="tpl-board">
      {stages.map((stage) => {
        const items = deals.filter((d) => d.stage === stage.id);
        return <section key={stage.id} className="tpl-board__col" aria-label={text(stage.en, stage.zh)}>
          <div className="tpl-board__head"><Chip size="sm" variant="soft" color={stage.color}>{text(stage.en, stage.zh)}</Chip><span className="tpl-meta">{items.length} · {money(items.reduce((s, d) => s + d.value, 0))}</span></div>
          {items.map((d) => <Card key={d.id} className="tpl-deal">
            <div className="tpl-mail-item__top"><strong>{d.company}</strong><span className="tpl-deal__value">{money(d.value)}</span></div>
            <ProgressBar size="sm" value={d.probability} color={stage.color === "default" ? "default" : stage.color} aria-label={text("Probability", "成交概率")}><ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track></ProgressBar>
            <div className="tpl-mail-item__top"><span className="tpl-row"><PersonAvatar name={d.owner} /><span className="tpl-meta">{d.owner}</span></span><span className="tpl-meta"><Calendar aria-hidden="true" width={12} height={12} /> {d.close}</span></div>
          </Card>)}
        </section>;
      })}
    </div> : <Card className="tpl-card">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={text("Deals", "商机")} className="min-w-[620px]">
            <Table.Header>
              <Table.Column isRowHeader>{text("Company", "公司")}</Table.Column>
              <Table.Column>{text("Owner", "负责人")}</Table.Column>
              <Table.Column>{text("Stage", "阶段")}</Table.Column>
              <Table.Column>{text("Probability", "概率")}</Table.Column>
              <Table.Column>{text("Close date", "预计成交")}</Table.Column>
              <Table.Column className="text-end">{text("Value", "金额")}</Table.Column>
            </Table.Header>
            <Table.Body>
              {deals.map((d) => <Table.Row key={d.id} id={d.id}>
                <Table.Cell className="font-medium">{d.company}</Table.Cell>
                <Table.Cell><div className="flex items-center gap-2"><PersonAvatar name={d.owner} />{d.owner}</div></Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={stageOf(d.stage).color}>{text(stageOf(d.stage).en, stageOf(d.stage).zh)}</Chip></Table.Cell>
                <Table.Cell className="tabular-nums">{d.probability}%</Table.Cell>
                <Table.Cell>{d.close}</Table.Cell>
                <Table.Cell className="text-end tabular-nums">{money(d.value)}</Table.Cell>
              </Table.Row>)}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Card>}
    <Card className="tpl-card">
      <div className="tpl-card__head"><div><h4>{text("Recent activity", "最近动态")}</h4></div><IconButton label={text("Filter", "筛选")} icon={Funnel} /></div>
      <ul className="tpl-activity">
        {activities.map((a) => <li key={a.en}>
          <span className="tpl-activity__icon"><a.icon aria-hidden="true" width={14} height={14} /></span>
          <div><strong>{text(a.en, a.zh)}</strong><span className="tpl-meta">{a.who}</span></div>
          <span className="tpl-meta tpl-push">{a.time === "Yesterday" ? text("Yesterday", "昨天") : a.time}</span>
        </li>)}
      </ul>
    </Card>
  </AppShell>;
}
