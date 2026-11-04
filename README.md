# Niltavi UI

English | [简体中文](docs/README.zh-CN.md)

A HeroUI v3 theme based on the plumage colors of the niltava.

## Design language

The [niltavi-website homepage](https://github.com/niltavi/niltavi-website) sets the shared direction for Niltavi products:

- **Vector illustration:** Clear silhouettes, scalable shapes, and a restrained palette.
- **Woodcut printmaking:** Broad ink shapes with tapered feather cuts and angular leaf veins. Keep ornament in illustrations so text and controls stay clear.
- **Light minimalism:** Generous space, restrained typography, and a clear reading order.
- **Flat design:** Solid colors, fine rules, modest corner radii, and low-relief surfaces.

The light theme combines warm paper (`#F5F1E6`) and forest ink (`#283E38`) with the eight plumage scales. The dark theme keeps deep blue-gray surfaces close to the background, with paper-colored text. Both modes use HeroUI's standard radius scale (8px base, 12px fields), 1px field borders, and flat surface outlines. These choices ship through `src/theme/index.css`; the preview's layout lives in `src/preview.css`. Keep woodcut details in artwork rather than form controls, and preserve focus and status cues.

Keep the preview focused on usable components, scales, charts, and contrast values. Use familiar icons for clear actions, with accessible names. Omit decorative copy, redundant navigation, empty views, and unnecessary columns. The global `niltavi-design` skill carries these preferences and the shared visual language.

## Setup

Copy the CSS files in `src/theme/` into your project, then import the theme entry point from your global stylesheet:

```css
@import "./theme/index.css";
```

This follows [HeroUI v3's CSS variable and BEM theming](https://heroui.com/en/docs/react/getting-started/theming). The entry point loads HeroUI and its Tailwind v4 build dependency, the palette, semantic variables, and shared component extensions. Keep the Tailwind v4 build integration required by HeroUI; there is no separate Tailwind theme configuration.

Light / dark switching follows HeroUI: `<html class="dark" data-theme="dark">`.

## Files

| File | Contents |
| --- | --- |
| `src/theme/index.css` | Single theme entry point |
| `src/theme/components.css` | Shared HeroUI BEM extensions referencing semantic variables |
| `src/theme/palette.css` | 8 scales × 12 steps (Tailwind v4 `@theme`, OKLCH), plus `info`, `rufous` and `chart-1…8` utilities |
| `src/theme/niltava.css` | HeroUI v3 semantic variables, shared geometry, fonts, light / dark |
| `tokens/primitives.tokens.json` | Color scales in W3C Design Tokens format |
| `tokens/light.tokens.json` / `dark.tokens.json` | Semantic tokens referencing the scales |
| `docs/palette.html` | Palette card, open directly in a browser |
| `src/showcase/` | 64 component groups and 127 adapted official examples, with source attribution and licenses |

## Colors beyond HeroUI

| Use | Usage |
| --- | --- |
| Orange button | `<Button className="button--rufous">` |
| Info chip | `<Chip className="chip--info" variant="soft">` |
| Orange chip | `<Chip className="chip--rufous" variant="soft">` |
| Charts | `var(--chart-1)` … `var(--chart-8)`, steps swap automatically in the dark theme |

Status colors look similar under red-green color blindness. Keep HeroUI's built-in icons on Alert and Toast, and don't rely on color alone to convey status.

## Maintaining the theme

Define palette colors, light/dark semantic colors, shared radius/border/shadow variables, and the font in `scripts/generate_tokens.py`. After editing the script, run:

```bash
npm run tokens
```

Use HeroUI component props for sizes and variants. Add reusable extensions to `src/theme/components.css` under `@layer components`, using the component's documented BEM classes and semantic variables. Keep layout in `src/preview.css`; avoid page-specific radius, color, or state overrides on HeroUI components. The header uses HeroUI's `ToggleButtonGroup` for selection, keyboard navigation, corner geometry, and focus.

Card choices use `checkbox--card` / `radio--card` with a `choice-card` content grid. Keep the title and description in `choice-card__body`; optional icons use `choice-card__icon` and `choice-card--with-icon`. The control stays in normal grid flow, aligned with the first text line. Use `checkbox-group--cards` / `radio-group--cards` with `choice-list` for consistent gaps; `choice-list--columns` adapts to the available width. The gallery provides the outer padding, so examples should avoid extra presentation wrappers and use flexible widths for forms.

The script checks 62 foreground / background contrast pairs and exits with an error if any fail. Run token, navigation, directory, search, and localization tests with `npm test`.

## Public showcase

The component gallery adapts [HeroUI's official demos](https://github.com/heroui-inc/heroui/tree/b2c65a5b5236550526f23d475b1ad0c6e5eab1a2/apps/docs/src/demos/en), including grouped and multiple selection, form validation, date ranges, nested menus, resizable tables, dialogs, drawers, sheets, and color controls. Search by component name or Chinese keyword. All examples use this theme; the Niltavi button and chip extensions are included. The compact header contains page navigation, Chinese / English switching, and an icon theme switch. Each page has a directory sidebar; on small screens it becomes a section selector.

Examples are maintained as local source files, pinned to the upstream commit recorded in `src/showcase/NOTICE.md`, and checked against HeroUI 3.2.7. Official example layout utilities use the same HeroUI/Tailwind theme bridge; custom theme overrides are removed. The gallery loads in a separate chunk. Some avatars and images use HeroUI's public asset CDN.

The static site uses hash routes: `#/components`, `#/components/checkbox-group`, `#/palette`, and `#/palette/colors`. Direct links and browser history work without server routing. Language and theme preferences persist locally. `src/showcase/catalog.ts` is the shared source for headings and navigation; bilingual sample copy is in `src/showcase/messages.json`. Dates and built-in controls follow the React Aria locale provider. Natural scenes belong in example content; action names and validation remain clear. Color-vision matrices remain available in `src/theme/vision.ts`, without an entry in the public header.

```bash
npm install
npm run dev
```
