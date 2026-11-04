# Niltava UI

[English](../README.md) | 简体中文

基于仙鹟羽色的 HeroUI v3 主题。

## 设计语言

以 [niltavi-website 首页](https://github.com/niltavi/niltavi-website)为共同参考，在 Niltavi 产品中结合使用：

- **矢量图风格：** 轮廓清楚，图形可缩放，配色克制。
- **木刻版画：** 大块墨色、收尖的羽毛刀痕和带棱角的叶脉。装饰用于插画，保持文字和控件清晰。
- **轻量极简风格：** 充分留白，克制使用字体，阅读顺序明确。
- **平面风格：** 纯色色块、细分隔线、适度圆角，以及低起伏的表面。

浅色主题用暖纸（`#F5F1E6`）和森林墨色（`#283E38`）承接原有八组羽色色阶。深色主题采用与页面底色接近的深蓝灰表面，搭配暖纸色文字。两种模式统一采用 HeroUI 标准圆角比例（8px 基础圆角、12px 输入框圆角）、1px 输入框边线，以及平面轮廓。这些设置由 `src/theme/index.css` 统一引入；预览页布局放在 `src/preview.css`。木刻细节用于插画，表单控件保留清楚的焦点和状态提示。

预览页只保留有用的组件、色阶、图表和对比度值。含义明确的操作使用常见图标，并提供无障碍名称。移除装饰文案、重复导航、空视图和无用列。全局 `niltavi-design` Skill 同步记录这些偏好和共同设计语言。

## 接入

把 `src/theme/` 中的 CSS 文件复制到项目里，在全局样式中引入主题入口：

```css
@import "./theme/index.css";
```

沿用 [HeroUI v3 的 CSS 变量和 BEM 主题方式](https://heroui.com/en/docs/react/getting-started/theming)。入口统一加载 HeroUI 及其 Tailwind v4 构建依赖、色阶、语义变量和共享组件扩展。保留 HeroUI 所需的 Tailwind v4 构建集成，无需额外配置一套 Tailwind 主题。

明暗切换沿用 HeroUI 的方式：`<html class="dark" data-theme="dark">`。

## 文件

| 文件 | 内容 |
| --- | --- |
| `src/theme/index.css` | 唯一主题入口 |
| `src/theme/components.css` | 引用语义变量的共享 HeroUI BEM 扩展 |
| `src/theme/palette.css` | 8 组 × 12 阶色阶（Tailwind v4 `@theme`，OKLCH），以及 `info`、`rufous`、`chart-1…8` 工具类 |
| `src/theme/niltava.css` | HeroUI v3 语义变量、共享尺寸、字体、浅色 / 深色 |
| `tokens/primitives.tokens.json` | 色阶，W3C Design Tokens 格式 |
| `tokens/light.tokens.json` / `dark.tokens.json` | 语义 token，引用色阶 |
| `docs/palette.html` | 色卡，浏览器直接打开 |
| `src/showcase/` | 64 类组件、127 个官方改编示例，以及来源记录和许可证 |

## HeroUI 之外的颜色

| 用途 | 写法 |
| --- | --- |
| 橙色按钮 | `<Button className="button--rufous">` |
| 信息标签 | `<Chip className="chip--info" variant="soft">` |
| 橙色标签 | `<Chip className="chip--rufous" variant="soft">` |
| 图表 | `var(--chart-1)` … `var(--chart-8)`，深色主题自动换阶 |

状态色在红绿色盲下会接近，Alert、Toast 保留 HeroUI 自带图标，不要只靠颜色区分状态。

## 维护主题

色阶、明暗语义颜色、共享圆角 / 边线 / 阴影变量，以及字体，都在 `scripts/generate_tokens.py` 中定义。改脚本后运行：

```bash
npm run tokens
```

尺寸和变体优先使用 HeroUI 组件属性。可复用的扩展放在 `src/theme/components.css` 的 `@layer components` 中，使用组件文档中的 BEM 类和语义变量。布局放在 `src/preview.css`，避免在页面中单独覆盖 HeroUI 组件的圆角、颜色和状态。顶部使用 HeroUI 的 `ToggleButtonGroup` 处理选择、键盘导航、圆角和焦点。

卡片选项使用 `checkbox--card` / `radio--card`，内容区采用 `choice-card` 网格。标题和说明放在 `choice-card__body` 中；需要图标时搭配 `choice-card__icon` 和 `choice-card--with-icon`。选择标记保留在网格流中，与首行文字对齐。分组使用 `checkbox-group--cards` / `radio-group--cards` 配合 `choice-list` 统一间距，`choice-list--columns` 按可用宽度排布。展示面板统一提供外层留白，示例避免重复包裹和加边距，表单宽度应能随容器收缩。

脚本会检查 62 组前景 / 背景对比度，有不达标的会报错退出。生成器测试运行 `npm test`。

## 预览

组件展示复用 [HeroUI 官方示例](https://github.com/heroui-inc/heroui/tree/b2c65a5b5236550526f23d475b1ad0c6e5eab1a2/apps/docs/src/demos/en)，涵盖分组与多选、表单校验、日期范围、嵌套菜单、可调列宽表格、弹窗、抽屉、底部面板和颜色控件。支持按组件名或中文关键词搜索。示例全部使用当前主题，并展示 Niltavi 的按钮和标签扩展。右侧主题切换区保留带主题底色的 Surface。

示例以本地源码维护，上游提交记录在 `src/showcase/NOTICE.md`，并按 HeroUI 3.2.7 校验。官方示例的布局工具类沿用同一套 HeroUI / Tailwind 主题映射，示例中的自定义主题覆盖已移除。展示区作为独立代码块加载，部分头像和图片使用 HeroUI 的公开素材 CDN。

```bash
npm install
npm run dev
```
