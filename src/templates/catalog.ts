// Directory data stays free of React so the site tests can load it directly.
// `sources` are paths under src/templates; `file#Section` keeps only that `/* ---------- Section ---------- */` block.

/** Template library: whole scenarios, ready to run as a starting point. */
export const templateSections = [
  {id: "ai-assistant", en: "AI Assistant", zh: "AI 助手",
    description: {en: "A full-page assistant with history, model picker, streamed replies, stop, regenerate and feedback.", zh: "整页 AI 助手：历史会话、模型选择、流式回复、停止、重新生成与反馈。"},
    uses: ["TextArea", "ToggleButton", "Select", "Tooltip", "Button", "Avatar"],
    sources: ["ai/AIChatWorkspace.tsx", "ai/AIChat.tsx", "ai/useAIChat.ts", "scenarios.css#AI chat"]},
  {id: "dashboard", en: "Dashboard", zh: "仪表盘",
    description: {en: "KPI cards, a revenue trend with range switching, traffic sources and recent orders.", zh: "指标卡、可切换时间范围的营收趋势、流量来源与最近订单。"},
    uses: ["Card", "ToggleButtonGroup", "ProgressBar", "Table", "Chip", "Avatar"],
    sources: ["Dashboard.tsx", "shell.tsx", "templates.css"]},
  {id: "mail", en: "Mail", zh: "邮件",
    description: {en: "Folder navigation, a filterable inbox and a reading pane with inline reply.", zh: "文件夹导航、可筛选的收件箱，以及带快捷回复的阅读面板。"},
    uses: ["SearchField", "ToggleButtonGroup", "Chip", "Avatar", "TextArea", "Button"],
    sources: ["Mail.tsx", "shell.tsx", "templates.css"]},
  {id: "chat", en: "Chat", zh: "聊天",
    description: {en: "Conversation list with presence and unread counts, message bubbles and a composer.", zh: "带在线状态与未读数的会话列表、消息气泡和输入栏。"},
    uses: ["Badge", "Avatar", "InputGroup", "TextField", "Chip", "Button"],
    sources: ["Chat.tsx", "shell.tsx", "templates.css"]},
  {id: "crm", en: "CRM", zh: "客户管理",
    description: {en: "Pipeline metrics, a stage board that switches to a table, and an activity feed.", zh: "销售管道指标、可切换为表格的阶段看板，以及动态流。"},
    uses: ["Card", "Chip", "ProgressBar", "Table", "ToggleButtonGroup", "Avatar"],
    sources: ["Crm.tsx", "shell.tsx", "templates.css"]},
  {id: "finances", en: "Finances", zh: "财务",
    description: {en: "Balance summary, cash-flow bars, spending breakdown, budgets and transactions.", zh: "余额概览、现金流柱状图、支出构成、预算与交易记录。"},
    uses: ["Card", "Meter", "Table", "Chip", "ToggleButtonGroup", "Button"],
    sources: ["Finances.tsx", "shell.tsx", "templates.css"]},
  {id: "saas", en: "SaaS Console", zh: "SaaS 后台",
    description: {en: "One product from the door inward: sign in by code or password, reset a forgotten password, run the workspace with sidebar, menus, ⌘K, members and settings, then sign out back to the start.", zh: "从登录到工作区的一整套后台：验证码或密码登录、找回密码，进入后有侧边栏、菜单、⌘K 命令面板、成员与设置，退出后回到登录。"},
    uses: ["Form", "InputOTP", "InputGroup", "AlertDialog", "Dropdown", "Modal", "Table", "Switch"],
    sources: ["saas/AdminConsole.tsx", "saas/Navigation.tsx", "saas/Auth.tsx", "scenarios.css#Admin console & SaaS demo"]},
] as const;

/** Component kits: smaller building blocks to drop into any layout. */
export const componentKits = [
  {id: "kit-sidebar", en: "Collapsible sidebar", zh: "可折叠侧边栏",
    description: {en: "Grouped navigation with badges, nested items, a workspace switcher and account menu. Collapses to an icon rail with tooltips.", zh: "分组导航、角标、二级菜单、工作区切换与账号菜单。收起后变成带提示的图标栏。"},
    uses: ["Button", "Tooltip", "Dropdown", "Avatar"],
    sources: ["kits/SidebarKit.tsx", "saas/Navigation.tsx#Sidebar", "saas/Navigation.tsx#Workspace switcher", "saas/Navigation.tsx#User menu", "scenarios.css#Sidebar", "kits/kits.css#Sidebar"]},
  {id: "kit-auth", en: "Sign-in and sign-up", zh: "登录与注册",
    description: {en: "The whole account flow: sign in by code or password, create an account with email verification, reset a forgotten password, and sign out with confirmation.", zh: "完整账号流程：验证码或密码登录、注册并验证邮箱、找回密码，以及带确认的退出登录。"},
    uses: ["Form", "TextField", "InputOTP", "InputGroup", "Meter", "Checkbox", "AlertDialog"],
    sources: ["kits/AuthKit.tsx", "saas/Auth.tsx", "saas/validation.ts", "scenarios.css#Auth", "kits/kits.css#Auth"]},
  {id: "kit-responsive", en: "Responsive layout", zh: "自适应布局",
    description: {en: "One shell that follows its own width: a sidebar on desktop, an icon rail on tablet, and a top bar with a drawer and bottom tabs on mobile.", zh: "同一套外壳随自身宽度切换：桌面端侧边栏，平板端图标栏，移动端顶栏加抽屉菜单与底部标签栏。"},
    uses: ["Drawer", "ToggleButtonGroup", "Button", "Avatar"],
    sources: ["kits/ResponsiveKit.tsx", "kits/kits.css#Responsive"]},
  {id: "kit-agent", en: "Agent chat", zh: "Agent 对话",
    description: {en: "A chat panel with streamed replies behind a corner button. One button steps through compact, full height and full size; drag it to any corner.", zh: "右下角按钮唤起的对话面板，支持流式回复。一个按钮依次切换小窗、纵向展开和铺满，可拖到任意一角。"},
    uses: ["TextArea", "Button", "Tooltip"],
    sources: ["kits/AgentKit.tsx", "ai/AIWidget.tsx", "ai/widgetLogic.ts", "ai/AIChat.tsx", "ai/useAIChat.ts", "scenarios.css#Floating assistant", "kits/kits.css#Agent"]},
  {id: "kit-banner", en: "Banner generator", zh: "Banner 生成",
    description: {en: "Screen-print posters from niltavi-banner. Each seed draws a new poster; adjust wobble, grain and paper, then download a PNG.", zh: "来自 niltavi-banner 的丝网印刷海报。每个种子画出一张新海报，可调抖动、颗粒和纸色，并下载 PNG。"},
    uses: ["TextField", "Slider", "ToggleButtonGroup", "Button"],
    sources: ["kits/BannerKit.tsx", "saas/BannerScene.tsx", "kits/kits.css#Banner", "saas/vendor/niltavi-banner/screenprint.js"]},
  {id: "kit-toolbar", en: "Bottom toolbar", zh: "底部工具栏",
    description: {en: "A document-style bottom bar: quick actions, a floating format toolbar for the selection, and sheet tabs you can add, rename and remove.", zh: "文档类应用的底栏：快捷操作、跟随选区的浮动格式工具栏，以及可新增、重命名和删除的工作表标签。"},
    uses: ["Toolbar", "ToggleButton", "Dropdown", "Tooltip", "Button"],
    sources: ["kits/ToolbarKit.tsx", "kits/kits.css#Toolbar"]},
  {id: "kit-type", en: "Typography", zh: "字体规范",
    description: {en: "Font families, the type scale with live sizes, and the reading rules for English and Chinese text.", zh: "字体家族、带实时数值的字号层级，以及中英文排版规则。"},
    uses: ["Typography", "Chip"],
    sources: ["kits/TypographyKit.tsx", "kits/kits.css#Typography"]},
] as const;

export const templateDirectory = [...templateSections, ...componentKits];

/** Page groups, in page order; the site sidebar uses them as headings. */
export const templateGroups = [
  {id: "library", en: "Template library", zh: "模板库", items: templateSections},
  {id: "kits", en: "Component kits", zh: "组件套装", items: componentKits},
] as const;
