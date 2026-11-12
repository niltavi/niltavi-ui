---
name: niltavi-ui
description: Build and review frontend UI in the Niltavi visual language (HeroUI v3 + Tailwind v4 + the Niltava theme). Use when creating or changing pages, components, styles, illustrations, or color choices for a project that uses Niltavi UI, or when the user mentions Niltavi, niltava, ui.niltavi.com, or asks for a calm, natural-history editorial look.
license: MIT
---

# Niltavi UI

Niltavi is a quiet, natural-history editorial language for digital products: vivid color held in a world of restraint. Warm paper, forest-ink text, one clear blue for intent, a touch of warm rufous, and generous space. This skill turns that intent into concrete frontend rules.

## Source of truth

The conventions live in two places, and **the latest version of both always wins over this file**:

- Live reference: https://ui.niltavi.com/ — components, palette, contrast tables.
- Repository: https://github.com/niltavi/niltavi-ui (branch `main`).

Before writing UI, read the current files instead of relying on memory:

- `src/theme/niltava.css` — semantic HeroUI variables for light and dark.
- `src/theme/palette.css` — primitive color scales (`--color-niltava-*`, `--color-rufous-*`, …).
- `src/theme/components.css` — Niltavi BEM extensions such as `.button--rufous`.
- `tokens/*.tokens.json` — the same tokens in DTCG format.
- `src/showcase/examples/` — reference compositions for every component.

Raw files are at `https://raw.githubusercontent.com/niltavi/niltavi-ui/main/<path>`. If a rule here disagrees with the repository or the live site, follow the repository and tell the user which rule changed. Never invent a token, variant, or color that the repository does not define.

## Setup

1. Install the stack: `npm i @heroui/react @heroui/styles` and `npm i -D tailwindcss @tailwindcss/vite`.
2. Copy the repository's `src/theme/` folder into the project and import it once from the app's entry stylesheet: `@import "./theme/index.css";`. It already pulls in Tailwind and `@heroui/styles`.
3. Switch themes the HeroUI way: `class="dark"` or `data-theme="dark"` on `<html>`. Never fork the palette per theme in component code.
4. Treat `palette.css` and `niltava.css` as generated output. In the Niltavi repository, change `scripts/generate_tokens.py` and run `npm run tokens`; in a consuming app, override semantic variables in your own layer rather than editing the copied files.

## Color and tokens

- Style with semantic variables and their Tailwind utilities: `background`, `foreground`, `surface`, `muted`, `accent`, `border`, `separator`, `focus`, `success`, `warning`, `danger`, `info`, `rufous`. Reach for primitives (`--color-niltava-600`) only inside illustration or data visualization.
- No hex, rgb, or hsl literals in components. If a color is missing, the answer is a token, not a literal.
- `accent` (niltava blue) marks the single primary intent in a view. `rufous` is a warm, rare highlight: one per screen at most, for example `.button--rufous` or `.chip--rufous`.
- Soft states use the `*-soft` and `*-soft-foreground` pairs; do not build tints with opacity on text.
- Charts use `--chart-1` … `--chart-8` in order, so light and dark both stay legible.
- Every foreground/background pair must keep the contrast shown on the live palette page. Check both themes.

## Typography

- UI text uses `--font-sans` (DM Sans, then PingFang SC / Microsoft YaHei). Do not add font families per component.
- Editorial headings may use a serif stack for a literary, atlas-like voice; navigation, labels, forms, and buttons stay sans.
- Keep hierarchy in size and weight (400–600), not color. Use `muted` for secondary text, never a lighter gray literal.
- Long-form text: about 60–75 characters per line, `text-wrap: pretty` on paragraphs, `balance` on headings. Chinese body text needs more line height than English.
- Write copy for people: short, specific labels. No implementation notes in the UI.

## Layout and space

- Let space create order before borders do. Group with spacing, separate with `separator`, and add a `Surface` only when content needs a container.
- Use the Tailwind spacing scale (`calc(var(--spacing) * n)`); avoid one-off pixel values.
- Radius comes from the theme (`--radius`, `--field-radius`). Do not hand-tune radii per component.
- Elevation is a 1px ring (`--surface-shadow`, `--overlay-shadow`), not a drop shadow. Do not add `shadow-lg` and similar.
- Design mobile first: keep reading order, one visual focus, and reachable controls at 320px wide. No horizontal page scroll; wide tables scroll inside their own container.

## Components

- Compose from `@heroui/react` before writing anything custom. Match the patterns in `src/showcase/examples/`.
- Extend with BEM modifiers in `@layer components` (`.button--rufous`, `.surface--example`), using semantic variables only. Do not restyle HeroUI internals with deep selectors.
- One primary button per view; supporting actions use `secondary`, `tertiary`, or `ghost`.
- Icons come from `@gravity-ui/icons` at 16–18px, with `aria-hidden` when decorative and an `aria-label` on icon-only buttons.
- Feedback uses HeroUI states (`isInvalid`, `isDisabled`, `isPending`) and `toast`, not ad hoc banners.

## Illustration and texture

- Illustrations follow a flat-vector, woodcut-inspired style: clear silhouettes, flat fields of color, simple geometry, and a few pale cuts that follow the form of feathers, leaves, and branches.
- Draw from the palette primitives at muted steps: blue-gray, deep blue, botanical green, ochre, a little golden brown.
- Keep backgrounds clean. No global noise, grain, or grunge overlays. If paper texture is requested, keep it very low contrast.
- Ship illustrations as optimized SVG with `width`, `height`, and meaningful `alt` text (empty `alt` when decorative).

## Motion and accessibility

- Motion is short (150–250ms) and eases out. Animate opacity and transform, not layout.
- Respect `prefers-reduced-motion`.
- Every interactive element is reachable by keyboard and shows the `--focus` ring. Do not remove outlines without a visible replacement.
- Use semantic landmarks and headings in order. Prefer HeroUI / React Aria components, which carry the right roles.
- Before handing off, check light and dark, 320px and desktop widths, keyboard flow, and contrast.

## Avoid

- Neon gradients, glassmorphism, glowing buttons, heavy drop shadows.
- Template-looking card grids and decoration that has no job.
- Heavy antiquing, dense wood grain, crosshatching, torn edges.
- Cartoon, photorealistic, or plastic 3D illustration styles.
- Colors picked from screenshots instead of tokens.

## Before you finish

Re-read the current theme files from the repository, confirm every color is a token, and confirm the result reads well in both themes. If you deviated from a convention on purpose, say so and why.
