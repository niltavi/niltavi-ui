import {ArrowDownLeft, ArrowRightArrowLeft, ArrowUpRight, ChartLine, CreditCard, Gear, House, Plus, Receipt, Wallet} from "@gravity-ui/icons";
import {Button, Card, Chip, Label, Meter, Table} from "@heroui/react";
import {useState} from "react";
import {useText} from "../site/Locale";
import {AppShell, BarChart, Delta, Donut, IconButton, Segmented, type NavItem} from "./shell";

const nav: NavItem[] = [
  {id: "home", en: "Home", zh: "首页", icon: House},
  {id: "accounts", en: "Accounts", zh: "账户", icon: Wallet},
  {id: "cards", en: "Cards", zh: "卡片", icon: CreditCard},
  {id: "transactions", en: "Transactions", zh: "交易", icon: ArrowRightArrowLeft},
  {id: "invoices", en: "Invoices", zh: "发票", icon: Receipt, count: 3},
  {id: "insights", en: "Insights", zh: "洞察", icon: ChartLine},
  {id: "settings", en: "Settings", zh: "设置", icon: Gear},
];

const cashflow = {
  "6m": {labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"], values: [[18, 12], [21, 14], [19, 15], [24, 13], [26, 17], [28, 16]]},
  "12m": {labels: ["D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N"], values: [[15, 11], [14, 12], [16, 10], [17, 13], [19, 12], [20, 14], [18, 12], [21, 14], [19, 15], [24, 13], [26, 17], [28, 16]]},
};
type Period = keyof typeof cashflow;

const spending = [
  {en: "Payroll", zh: "薪资", value: 8200, color: "var(--chart-1)"},
  {en: "Software", zh: "软件", value: 2400, color: "var(--chart-2)"},
  {en: "Office", zh: "办公", value: 1800, color: "var(--chart-3)"},
  {en: "Travel", zh: "差旅", value: 1200, color: "var(--chart-4)"},
  {en: "Other", zh: "其他", value: 900, color: "var(--chart-5)"},
];

const transactions = [
  {id: "t1", name: "Fernwood Studio", en: "Client payment", zh: "客户付款", date: "Nov 11", amount: 12400, status: "completed"},
  {id: "t2", name: "Figma", en: "Software", zh: "软件订阅", date: "Nov 10", amount: -144, status: "completed"},
  {id: "t3", name: "Singapore Airlines", en: "Travel", zh: "差旅", date: "Nov 09", amount: -1280, status: "pending"},
  {id: "t4", name: "Lumen Labs", en: "Client payment", zh: "客户付款", date: "Nov 08", amount: 8600, status: "completed"},
  {id: "t5", name: "WeWork", en: "Office", zh: "办公", date: "Nov 05", amount: -1800, status: "completed"},
] as const;

const fmt = (n: number) => `${n < 0 ? "−" : "+"}$${Math.abs(n).toLocaleString("en-US")}`;

export default function FinancesTemplate() {
  const text = useText();
  const [page, setPage] = useState("home");
  const [period, setPeriod] = useState<Period>("6m");
  const flow = cashflow[period];
  const spent = spending.reduce((s, p) => s + p.value, 0);

  return <AppShell brand="Ledger" nav={nav} active={page} onNavigate={setPage}
    title={<><h3>{text("Finances", "财务")}</h3><p>{text("November 2026", "2026 年 11 月")}</p></>}
    actions={<><Button size="sm" variant="secondary"><ArrowRightArrowLeft aria-hidden="true" width={16} height={16} />{text("Transfer", "转账")}</Button><Button size="sm"><Plus aria-hidden="true" width={16} height={16} />{text("Invoice", "开发票")}</Button></>}>
    <div className="tpl-grid tpl-grid--finance">
      <Card className="tpl-balance">
        <span className="tpl-kpi__label">{text("Total balance", "总余额")}</span>
        <strong className="tpl-balance__value">$248,920.<small>45</small></strong>
        <span className="tpl-kpi__foot"><Delta value={6.2} /> {text("this month", "本月")}</span>
        <div className="tpl-balance__split">
          <div><span className="tpl-meta"><ArrowDownLeft aria-hidden="true" width={12} height={12} /> {text("Income", "收入")}</span><strong>$42,180</strong></div>
          <div><span className="tpl-meta"><ArrowUpRight aria-hidden="true" width={12} height={12} /> {text("Expenses", "支出")}</span><strong>$14,500</strong></div>
        </div>
      </Card>
      <Card className="tpl-card">
        <div className="tpl-card__head">
          <div><h4>{text("Cash flow", "现金流")}</h4><p>{text("Income and expenses, in thousands", "收入与支出（千元）")}</p></div>
          <Segmented label={text("Period", "周期")} value={period} onChange={setPeriod} options={[{id: "6m", label: text("6M", "6 个月")}, {id: "12m", label: text("12M", "12 个月")}]} />
        </div>
        <BarChart label={text("Cash flow chart", "现金流图表")} labels={flow.labels} values={flow.values} highlight={flow.labels.length - 1} />
        <div className="tpl-legend"><span><i style={{background: "var(--chart-1)"}} />{text("Income", "收入")}</span><span><i style={{background: "var(--chart-2)"}} />{text("Expenses", "支出")}</span></div>
      </Card>
    </div>
    <div className="tpl-grid tpl-grid--finance-b">
      <Card className="tpl-card">
        <div className="tpl-card__head"><div><h4>{text("Spending", "支出构成")}</h4></div></div>
        <div className="tpl-spending">
          <Donut label={text("Spending breakdown", "支出构成")} parts={spending} center={<><strong>${(spent / 1000).toFixed(1)}k</strong><span className="tpl-meta">{text("this month", "本月")}</span></>} />
          <ul className="tpl-spending__list">
            {spending.map((s) => <li key={s.en}><i style={{background: s.color}} /><span>{text(s.en, s.zh)}</span><strong>${s.value.toLocaleString("en-US")}</strong></li>)}
          </ul>
        </div>
      </Card>
      <Card className="tpl-card">
        <div className="tpl-card__head"><div><h4>{text("Budgets", "预算")}</h4></div><IconButton label={text("Add budget", "添加预算")} icon={Plus} /></div>
        <div className="tpl-stack">
          {[{en: "Marketing", zh: "市场", value: 72, color: "accent"}, {en: "Software", zh: "软件", value: 48, color: "success"}, {en: "Travel", zh: "差旅", value: 91, color: "danger"}].map((b) =>
            <Meter key={b.en} value={b.value} color={b.color as "accent"}><Label>{text(b.en, b.zh)}</Label><Meter.Output /><Meter.Track><Meter.Fill /></Meter.Track></Meter>)}
        </div>
        <div className="tpl-card-visual">
          <CreditCard aria-hidden="true" width={18} height={18} />
          <div><strong>•••• 4021</strong><span className="tpl-meta">{text("Corporate card · Exp 08/28", "企业卡 · 有效期 08/28")}</span></div>
          <Chip size="sm" variant="soft" color="success">{text("Active", "已启用")}</Chip>
        </div>
      </Card>
    </div>
    <Card className="tpl-card">
      <div className="tpl-card__head"><div><h4>{text("Transactions", "交易记录")}</h4></div><Button size="sm" variant="ghost">{text("Export", "导出")}</Button></div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={text("Transactions", "交易记录")} className="min-w-[560px]">
            <Table.Header>
              <Table.Column isRowHeader>{text("Merchant", "对象")}</Table.Column>
              <Table.Column>{text("Category", "类别")}</Table.Column>
              <Table.Column>{text("Date", "日期")}</Table.Column>
              <Table.Column>{text("Status", "状态")}</Table.Column>
              <Table.Column className="text-end">{text("Amount", "金额")}</Table.Column>
            </Table.Header>
            <Table.Body>
              {transactions.map((t) => <Table.Row key={t.id} id={t.id}>
                <Table.Cell><div className="flex items-center gap-2"><span className="tpl-activity__icon" data-in={t.amount > 0 || undefined}>{t.amount > 0 ? <ArrowDownLeft aria-hidden="true" width={14} height={14} /> : <ArrowUpRight aria-hidden="true" width={14} height={14} />}</span><span className="font-medium">{t.name}</span></div></Table.Cell>
                <Table.Cell>{text(t.en, t.zh)}</Table.Cell>
                <Table.Cell>{t.date}</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={t.status === "completed" ? "success" : "warning"}>{t.status === "completed" ? text("Completed", "已完成") : text("Pending", "处理中")}</Chip></Table.Cell>
                <Table.Cell className="text-end tabular-nums" data-amount={t.amount > 0 ? "in" : "out"}>{fmt(t.amount)}</Table.Cell>
              </Table.Row>)}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Card>
  </AppShell>;
}
