# Niltava UI

[English](../README.md) | 简体中文

基于仙鹟羽色的 HeroUI v3 主题。

## 设计语言

以 [niltavi-website 首页](https://github.com/niltavi/niltavi-website)为共同参考，在 Niltavi 产品中结合使用：

- **矢量图风格：** 轮廓清楚，图形可缩放，配色克制。
- **木刻版画：** 大块墨色、收尖的羽毛刀痕和带棱角的叶脉。装饰用于插画，保持文字和控件清晰。
- **轻量极简风格：** 充分留白，克制使用字体，阅读顺序明确。
- **平面风格：** 纯色色块、细分隔线、适度圆角，以及低起伏的表面。

浅色主题用暖纸（`#F5F1E6`）和森林墨色（`#283E38`）承接原有八组羽色色阶。深色主题采用喉墨色阶的深蓝灰背景与表面，搭配暖纸色文字。两种模式统一采用 4px 基础圆角、6px 输入框圆角、1px 输入框边线，以及平面轮廓。这些设置随两份主题样式表交付；预览页布局放在 `src/index.css`。木刻细节用于插画，表单控件保留清楚的焦点和状态提示。

预览页只保留有用的组件、色阶、图表和对比度值。含义明确的操作使用常见图标，并提供无障碍名称。移除装饰文案、重复导航、空视图和无用列。全局 `niltavi-design` Skill 同步记录这些偏好和共同设计语言。

## 接入

把 `src/theme/palette.css` 和 `src/theme/niltava.css` 复制到项目里，在全局样式中按顺序引入：

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "./theme/palette.css";
@import "./theme/niltava.css";
```

明暗切换沿用 HeroUI 的方式：`<html class="dark" data-theme="dark">`。

## 文件

| 文件 | 内容 |
| --- | --- |
| `src/theme/palette.css` | 8 组 × 12 阶色阶（Tailwind v4 `@theme`，OKLCH），以及 `info`、`rufous`、`chart-1…8` 工具类 |
| `src/theme/niltava.css` | HeroUI v3 主题变量，浅色 / 深色 |
| `tokens/primitives.tokens.json` | 色阶，W3C Design Tokens 格式 |
| `tokens/light.tokens.json` / `dark.tokens.json` | 语义 token，引用色阶 |
| `docs/palette.html` | 色卡，浏览器直接打开 |

## HeroUI 之外的颜色

| 用途 | 写法 |
| --- | --- |
| 橙色按钮 | `<Button className="[--button-bg:var(--rufous)] [--button-bg-hover:var(--rufous-hover)] [--button-bg-pressed:var(--rufous-hover)] [--button-fg:var(--rufous-foreground)]">` |
| 信息色 | `bg-info` `text-info-foreground` `bg-info-soft` `text-info-soft-foreground` |
| 图表 | `var(--chart-1)` … `var(--chart-8)`，深色主题自动换阶 |

状态色在红绿色盲下会接近，Alert、Toast 保留 HeroUI 自带图标，不要只靠颜色区分状态。

## 修改颜色

色值全部由 `scripts/generate_tokens.py` 生成，改脚本后运行：

```bash
npm run tokens
```

脚本会检查 62 组前景 / 背景对比度，有不达标的会报错退出。生成器测试运行 `npm test`。

## 预览

```bash
npm install
npm run dev
```
