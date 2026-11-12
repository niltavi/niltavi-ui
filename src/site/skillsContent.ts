// Display copy for the Skills page. The agent-facing rules live in skills/niltavi-ui/SKILL.md;
// each convention below names the SKILL.md heading it summarizes, and the site tests keep them aligned.
type Copy = {en: string; zh: string};
export type Convention = {id: string; heading: string; title: Copy; lead: Copy; rules: Copy[]};

export const skillName = "niltavi-ui";
export const siteUrl = "https://ui.niltavi.com/";
export const repoUrl = "https://github.com/niltavi/niltavi-ui";

export const installCommands = {
  project: `npx skills add niltavi/niltavi-ui`,
  global: `npx skills add niltavi/niltavi-ui -g`,
  manual: `git clone --depth 1 https://github.com/niltavi/niltavi-ui.git /tmp/niltavi-ui\nmkdir -p .claude/skills\ncp -R /tmp/niltavi-ui/skills/niltavi-ui .claude/skills/`,
};

export const agentDirectories = [
  {agent: "Claude Code", path: ".claude/skills/niltavi-ui/"},
  {agent: "Cursor", path: ".cursor/skills/niltavi-ui/"},
  {agent: "OpenCode", path: ".opencode/skills/niltavi-ui/"},
  {agent: "Codex", path: ".agents/skills/niltavi-ui/"},
];

export const invocations = [
  {agent: "Claude Code", command: "/niltavi-ui"},
  {agent: "Codex", command: "$niltavi-ui"},
];

export const examplePrompts: Copy[] = [
  {en: "/niltavi-ui Build a sign-up form with HeroUI, using only semantic tokens.", zh: "/niltavi-ui 用 HeroUI 写一个注册表单，颜色只用语义 Token。"},
  {en: "/niltavi-ui Review this page against the latest conventions and list every hard-coded color.", zh: "/niltavi-ui 按最新约定检查这个页面，列出所有写死的颜色。"},
  {en: "/niltavi-ui Add dark mode to the settings page without forking the palette.", zh: "/niltavi-ui 给设置页加上深色模式，不要在组件里分叉色板。"},
  {en: "/niltavi-ui Draw an empty-state illustration of a bird on a branch as an SVG.", zh: "/niltavi-ui 为空状态画一只栖在枝头的鸟，输出 SVG。"},
];

export const skillTree = `skills/niltavi-ui/
└── SKILL.md   # Conventions, setup, and the files to read first`;

export const conventions: Convention[] = [
  {
    id: "color",
    heading: "Color and tokens",
    title: {en: "Color comes from tokens", zh: "颜色只从 Token 来"},
    lead: {
      en: "Blue for intent, a rare warm rufous, forest ink on paper. In code, that means one source of color and no exceptions.",
      zh: "蓝色表达意图，暖褐偶尔点亮，森林墨绿落在纸色上。落到代码里，就是颜色只有一个来源，没有例外。",
    },
    rules: [
      {en: "Use semantic variables and their Tailwind utilities: `background`, `foreground`, `surface`, `muted`, `accent`, `border`, `focus`, `success`, `warning`, `danger`, `info`, `rufous`.", zh: "组件只用语义变量及其 Tailwind 工具类：`background`、`foreground`、`surface`、`muted`、`accent`、`border`、`focus`、`success`、`warning`、`danger`、`info`、`rufous`。"},
      {en: "No hex, rgb, or hsl literals in components. A missing color means a missing token, not a new literal.", zh: "组件里不写 hex、rgb、hsl 字面量。缺颜色时补 Token，而不是补一个色值。"},
      {en: "`accent` marks the single primary intent in a view; `rufous` appears at most once per screen, via `.button--rufous` or `.chip--rufous`.", zh: "`accent` 只标记视图里唯一的主操作；`rufous` 每屏最多一处，通过 `.button--rufous` 或 `.chip--rufous` 使用。"},
      {en: "Charts use `--chart-1` to `--chart-8` in order, and every pair keeps its contrast in both light and dark.", zh: "图表按顺序使用 `--chart-1` 到 `--chart-8`；所有前景与背景的组合在浅色和深色下都要保持对比度。"},
    ],
  },
  {
    id: "typography",
    heading: "Typography",
    title: {en: "Type carries the hierarchy", zh: "用字体建立层级"},
    lead: {
      en: "A literary voice for headings, a clear modern voice for everything you click.",
      zh: "标题可以有文学气质，所有可点击的地方保持清晰的现代感。",
    },
    rules: [
      {en: "UI text uses `--font-sans`. Don't add font families per component.", zh: "界面文字统一使用 `--font-sans`，不在单个组件里另设字体。"},
      {en: "Serif is reserved for editorial headings; navigation, labels, forms, and buttons stay sans-serif.", zh: "衬线只用于编辑型标题；导航、标签、表单和按钮保持无衬线。"},
      {en: "Build hierarchy with size and weight (400–600). Secondary text uses `muted`, never a gray literal.", zh: "层级靠字号和字重（400–600）建立，次要文字用 `muted`，而不是写一个浅灰色值。"},
      {en: "Keep long-form lines near 60–75 characters, with `text-wrap: pretty` on paragraphs and `balance` on headings.", zh: "长文每行约 60–75 个字符，段落用 `text-wrap: pretty`，标题用 `balance`；中文正文的行高要比英文更宽松。"},
    ],
  },
  {
    id: "layout",
    heading: "Layout and space",
    title: {en: "Space before borders", zh: "先用留白，再用边框"},
    lead: {
      en: "Every interval of emptiness should earn its place. Let spacing do the grouping before you reach for a box.",
      zh: "每一处空白都应当有存在的理由。分组先交给间距，再考虑加容器。",
    },
    rules: [
      {en: "Group with spacing, divide with `separator`, and add a `Surface` only when content needs a container.", zh: "用间距分组，用 `separator` 分隔，内容确实需要容器时才加 `Surface`。"},
      {en: "Spacing follows `calc(var(--spacing) * n)`; radius comes from `--radius` and `--field-radius`.", zh: "间距使用 `calc(var(--spacing) * n)`；圆角来自 `--radius` 与 `--field-radius`，不按组件手调。"},
      {en: "Elevation is a 1px ring (`--surface-shadow`), never a drop shadow such as `shadow-lg`.", zh: "层次用 1px 描边环（`--surface-shadow`）表达，不使用 `shadow-lg` 之类的投影。"},
      {en: "Design from 320px up: one visual focus, a clear reading order, no horizontal page scroll.", zh: "从 320px 宽度开始设计：一个视觉焦点、清晰的阅读顺序、页面不出现横向滚动。"},
    ],
  },
  {
    id: "components",
    heading: "Components",
    title: {en: "Compose, don't rebuild", zh: "组合现有组件"},
    lead: {
      en: "Refinement comes from proportion and the accord of small details, not from new widgets.",
      zh: "精致感来自比例与细节的协调，而不是重新造一套控件。",
    },
    rules: [
      {en: "Start from `@heroui/react` and the patterns in `src/showcase/examples/` before writing anything custom.", zh: "先用 `@heroui/react`，并参照 `src/showcase/examples/` 里的写法，再考虑自定义。"},
      {en: "Extend with BEM modifiers in `@layer components` using semantic variables; never restyle HeroUI internals with deep selectors.", zh: "扩展用 `@layer components` 里的 BEM 修饰类，只引用语义变量；不用深层选择器改 HeroUI 内部结构。"},
      {en: "One primary button per view; supporting actions use `secondary`, `tertiary`, or `ghost`.", zh: "每个视图一个主按钮，其余操作用 `secondary`、`tertiary` 或 `ghost`。"},
      {en: "Icons come from `@gravity-ui/icons` at 16–18px; icon-only buttons need an `aria-label`.", zh: "图标来自 `@gravity-ui/icons`，尺寸 16–18px；纯图标按钮必须有 `aria-label`。"},
    ],
  },
  {
    id: "illustration",
    heading: "Illustration and texture",
    title: {en: "Follow the feather, follow the leaf", zh: "插画顺着羽毛与叶脉"},
    lead: {
      en: "Flat vector forms keep the clarity of the digital age; a few carved lines carry the warmth of woodcut.",
      zh: "平面矢量保留数字时代的清晰，少量刻线带来木刻的温度。",
    },
    rules: [
      {en: "Clear silhouettes, flat fields of color, simple geometry, and a few pale cuts that follow the form.", zh: "清晰剪影、平整色块、简洁几何，再加少量顺着形体方向的浅色刻线。"},
      {en: "Draw from muted palette steps: blue-gray, deep blue, botanical green, ochre, a little golden brown.", zh: "取色于色板中低饱和的阶梯：灰蓝、深蓝、植物绿、赭黄与少量金棕。"},
      {en: "Keep backgrounds clean: no global noise, grain, or grunge overlays.", zh: "背景保持干净，不加全局噪点、颗粒或做旧叠层。"},
      {en: "Ship optimized SVG with `width`, `height`, and `alt` text (empty `alt` when decorative).", zh: "交付优化过的 SVG，写明 `width`、`height` 与 `alt`；纯装饰时 `alt` 留空。"},
    ],
  },
  {
    id: "motion",
    heading: "Motion and accessibility",
    title: {en: "A light touch, for everyone", zh: "轻盈，也照顾每一个人"},
    lead: {
      en: "Motion should feel like a breeze, and every control should be reachable without a mouse.",
      zh: "动效像一阵微风；每个控件都应当不借助鼠标也能到达。",
    },
    rules: [
      {en: "Keep motion to 150–250ms with `ease-out`, animating `opacity` and `transform` rather than layout.", zh: "动效控制在 150–250ms、`ease-out`，只动 `opacity` 与 `transform`，不动布局。"},
      {en: "Respect `prefers-reduced-motion`.", zh: "尊重 `prefers-reduced-motion`。"},
      {en: "Every interactive element shows the `--focus` ring; don't remove outlines without a visible replacement.", zh: "所有可交互元素都显示 `--focus` 焦点环；去掉 outline 时必须有可见的替代。"},
      {en: "Before handing off, check light and dark, 320px and desktop, keyboard flow, and contrast.", zh: "交付前检查浅色与深色、320px 与桌面宽度、键盘顺序和对比度。"},
    ],
  },
  {
    id: "avoid",
    heading: "Avoid",
    title: {en: "Keep the language clear", zh: "避免偏离"},
    lead: {
      en: "The design doesn't hurry to catch the eye. Leave out anything that shouts.",
      zh: "设计不急于吸引注意。凡是在喊叫的东西，都省掉。",
    },
    rules: [
      {en: "Neon gradients, glassmorphism, glowing buttons, heavy drop shadows.", zh: "霓虹渐变、玻璃拟态、发光按钮、厚重投影。"},
      {en: "Template-looking card grids and decoration with no job.", zh: "模板化的卡片网格，以及没有用途的装饰。"},
      {en: "Heavy antiquing, dense wood grain, crosshatching, torn edges; cartoon, photoreal, or plastic 3D styles.", zh: "重度做旧、厚重木纹、密集交叉排线、破损边缘；儿童卡通、照片写实或塑料质感的 3D。"},
      {en: "Colors picked from screenshots instead of tokens.", zh: "从截图里取色，而不是使用 Token。"},
    ],
  },
];

export const skillSections: {id: string; title: Copy}[] = [
  {id: "overview", title: {en: "Overview", zh: "概览"}},
  {id: "installation", title: {en: "Installation", zh: "安装"}},
  {id: "usage", title: {en: "Usage", zh: "调用"}},
  {id: "source", title: {en: "Latest conventions", zh: "以最新约定为准"}},
  ...conventions.map(({id, title}) => ({id, title})),
  {id: "structure", title: {en: "Structure", zh: "目录结构"}},
];
