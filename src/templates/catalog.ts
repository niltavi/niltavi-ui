// Directory data stays free of React so the site tests can load it directly.
export const templateSections = [
  {id: "dashboard", en: "Dashboard", zh: "仪表盘",
    description: {en: "KPI cards, a revenue trend with range switching, traffic sources and recent orders.", zh: "指标卡、可切换时间范围的营收趋势、流量来源与最近订单。"},
    uses: ["Card", "ToggleButtonGroup", "ProgressBar", "Table", "Chip", "Avatar"]},
  {id: "mail", en: "Mail", zh: "邮件",
    description: {en: "Folder navigation, a filterable inbox and a reading pane with inline reply.", zh: "文件夹导航、可筛选的收件箱，以及带快捷回复的阅读面板。"},
    uses: ["SearchField", "ToggleButtonGroup", "Chip", "Avatar", "TextArea", "Button"]},
  {id: "chat", en: "Chat", zh: "聊天",
    description: {en: "Conversation list with presence and unread counts, message bubbles and a composer.", zh: "带在线状态与未读数的会话列表、消息气泡和输入栏。"},
    uses: ["Badge", "Avatar", "InputGroup", "TextField", "Chip", "Button"]},
  {id: "crm", en: "CRM", zh: "客户管理",
    description: {en: "Pipeline metrics, a stage board that switches to a table, and an activity feed.", zh: "销售管道指标、可切换为表格的阶段看板，以及动态流。"},
    uses: ["Card", "Chip", "ProgressBar", "Table", "ToggleButtonGroup", "Avatar"]},
  {id: "finances", en: "Finances", zh: "财务",
    description: {en: "Balance summary, cash-flow bars, spending breakdown, budgets and transactions.", zh: "余额概览、现金流柱状图、支出构成、预算与交易记录。"},
    uses: ["Card", "Meter", "Table", "Chip", "ToggleButtonGroup", "Button"]},
] as const;
