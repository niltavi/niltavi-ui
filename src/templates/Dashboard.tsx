import {ArrowUpRight, Bell, ChartColumn, Gear, House, Layers, Persons, Plus, ShoppingCart} from "@gravity-ui/icons";
import {Button, Card, Chip, Label, ProgressBar, Table} from "@heroui/react";
import {useState} from "react";
import {useText} from "../site/Locale";
import {AppShell, AreaChart, Delta, IconButton, PersonAvatar, Segmented, Sparkline, type NavItem} from "./shell";

const nav: NavItem[] = [
  {id: "overview", en: "Overview", zh: "概览", icon: House},
  {id: "analytics", en: "Analytics", zh: "分析", icon: ChartColumn},
  {id: "orders", en: "Orders", zh: "订单", icon: ShoppingCart, count: 12},
  {id: "customers", en: "Customers", zh: "客户", icon: Persons},
  {id: "projects", en: "Projects", zh: "项目", icon: Layers},
  {id: "settings", en: "Settings", zh: "设置", icon: Gear},
];

const ranges = {
  "7d": {labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], now: [4.2, 5.1, 4.8, 6.3, 7.1, 6.4, 7.8], prev: [3.9, 4.4, 4.6, 5.0, 5.4, 5.8, 6.1]},
  "30d": {labels: ["W1", "W2", "W3", "W4", "W5"], now: [21, 26, 24, 31, 36], prev: [19, 21, 23, 24, 27]},
  "12m": {labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"], now: [82, 88, 91, 97, 102, 99, 110, 118, 121, 129, 134, 142], prev: [70, 72, 78, 80, 84, 88, 90, 92, 97, 101, 104, 109]},
};
type Range = keyof typeof ranges;

const kpis = [
  {en: "Revenue", zh: "营收", value: "$142,380", delta: 8.4, spark: [4, 6, 5, 7, 8, 7, 9, 11]},
  {en: "Active users", zh: "活跃用户", value: "18,204", delta: 3.1, spark: [10, 11, 10, 12, 12, 13, 13, 14]},
  {en: "Conversion", zh: "转化率", value: "4.62%", delta: -0.6, spark: [6, 5, 6, 5, 5, 4, 5, 4]},
  {en: "Avg. order", zh: "客单价", value: "$86.40", delta: 2.2, spark: [7, 7, 8, 7, 8, 9, 8, 9]},
];

const channels = [
  {en: "Organic search", zh: "自然搜索", value: 42, color: "accent"},
  {en: "Direct", zh: "直接访问", value: 26, color: "success"},
  {en: "Referral", zh: "推荐", value: 18, color: "warning"},
  {en: "Social", zh: "社交媒体", value: 14, color: "danger"},
] as const;

const orders = [
  {id: "#3201", name: "Mira Chen", product: "Field Journal", amount: "$128.00", status: "paid"},
  {id: "#3200", name: "Arjun Patel", product: "Canopy Lamp", amount: "$342.50", status: "pending"},
  {id: "#3199", name: "Sofia Lim", product: "Moss Planter", amount: "$64.00", status: "paid"},
  {id: "#3198", name: "Daniel Ong", product: "Linen Throw", amount: "$210.00", status: "refunded"},
  {id: "#3197", name: "Hana Sato", product: "Bird Print Set", amount: "$96.00", status: "paid"},
] as const;

export const statusMeta = {
  paid: {en: "Paid", zh: "已支付", color: "success"},
  pending: {en: "Pending", zh: "待处理", color: "warning"},
  refunded: {en: "Refunded", zh: "已退款", color: "danger"},
} as const;

export default function DashboardTemplate() {
  const text = useText();
  const [page, setPage] = useState("overview");
  const [range, setRange] = useState<Range>("12m");
  const data = ranges[range];
  return <AppShell brand="Canopy" nav={nav} active={page} onNavigate={setPage}
    title={<><h3>{text("Overview", "概览")}</h3><p>{text("Welcome back, Lin. Here is what is growing.", "欢迎回来，Lin。看看这周有哪些新变化。")}</p></>}
    actions={<><IconButton label={text("Notifications", "通知")} icon={Bell} /><Button size="sm"><Plus aria-hidden="true" width={16} height={16} />{text("New report", "新建报表")}</Button></>}>
    <div className="tpl-grid tpl-grid--kpi">
      {kpis.map((kpi) => <Card key={kpi.en} className="tpl-kpi">
        <span className="tpl-kpi__label">{text(kpi.en, kpi.zh)}</span>
        <div className="tpl-kpi__row"><strong className="tpl-kpi__value">{kpi.value}</strong><Sparkline values={kpi.spark} color={kpi.delta >= 0 ? "var(--success)" : "var(--danger)"} /></div>
        <span className="tpl-kpi__foot"><Delta value={kpi.delta} /> {text("vs last period", "较上期")}</span>
      </Card>)}
    </div>
    <div className="tpl-grid tpl-grid--main">
      <Card className="tpl-card">
        <div className="tpl-card__head">
          <div><h4>{text("Revenue", "营收趋势")}</h4><p>{text("Current period against the previous one", "本期与上期对比")}</p></div>
          <Segmented label={text("Time range", "时间范围")} value={range} onChange={setRange} options={[{id: "7d", label: text("7D", "7 天")}, {id: "30d", label: text("30D", "30 天")}, {id: "12m", label: text("12M", "12 个月")}]} />
        </div>
        <AreaChart label={text("Revenue chart", "营收图表")} labels={data.labels} series={[{values: data.now, color: "var(--chart-1)"}, {values: data.prev, color: "var(--chart-2)"}]} />
        <div className="tpl-legend"><span><i style={{background: "var(--chart-1)"}} />{text("This period", "本期")}</span><span><i style={{background: "var(--chart-2)"}} />{text("Previous", "上期")}</span></div>
      </Card>
      <Card className="tpl-card">
        <div className="tpl-card__head"><div><h4>{text("Traffic sources", "流量来源")}</h4><p>{text("Share of sessions", "会话占比")}</p></div></div>
        <div className="tpl-stack">
          {channels.map((c) => <ProgressBar key={c.en} value={c.value} color={c.color} aria-label={text(c.en, c.zh)}>
            <Label>{text(c.en, c.zh)}</Label><ProgressBar.Output /><ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track>
          </ProgressBar>)}
        </div>
        <Card className="tpl-callout">
          <strong>{text("Spring campaign", "春季活动")}</strong>
          <span>{text("Referral traffic is up 24% since launch.", "活动上线以来推荐流量增长 24%。")}</span>
          <Button size="sm" variant="tertiary">{text("View campaign", "查看活动")}<ArrowUpRight aria-hidden="true" width={14} height={14} /></Button>
        </Card>
      </Card>
    </div>
    <Card className="tpl-card">
      <div className="tpl-card__head"><div><h4>{text("Recent orders", "最近订单")}</h4></div><Button size="sm" variant="ghost">{text("View all", "查看全部")}</Button></div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={text("Recent orders", "最近订单")} className="min-w-[560px]">
            <Table.Header>
              <Table.Column isRowHeader>{text("Order", "订单")}</Table.Column>
              <Table.Column>{text("Customer", "客户")}</Table.Column>
              <Table.Column>{text("Product", "商品")}</Table.Column>
              <Table.Column>{text("Status", "状态")}</Table.Column>
              <Table.Column className="text-end">{text("Amount", "金额")}</Table.Column>
            </Table.Header>
            <Table.Body>
              {orders.map((o) => <Table.Row key={o.id} id={o.id}>
                <Table.Cell className="font-medium">{o.id}</Table.Cell>
                <Table.Cell><div className="flex items-center gap-2"><PersonAvatar name={o.name} />{o.name}</div></Table.Cell>
                <Table.Cell>{o.product}</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={statusMeta[o.status].color}>{text(statusMeta[o.status].en, statusMeta[o.status].zh)}</Chip></Table.Cell>
                <Table.Cell className="text-end tabular-nums">{o.amount}</Table.Cell>
              </Table.Row>)}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Card>
  </AppShell>;
}
