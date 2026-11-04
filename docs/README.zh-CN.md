# Niltava UI

[English](../README.md) | 简体中文

基于仙鹟羽色的 HeroUI v3 主题。

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

脚本会检查 54 组前景 / 背景对比度，有不达标的会报错退出。

## 预览

```bash
npm install
npm run dev
```
