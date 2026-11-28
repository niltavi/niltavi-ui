---
name: niltavi-ui
description: Builds and reviews web interfaces with Niltavi UI, a HeroUI v3 + Tailwind CSS v4 theme with ready-made templates and component kits. Use when creating or changing pages, layouts, components, colors, icons, or motion in a project that uses Niltavi UI, or when the user mentions Niltavi, niltava, ui.niltavi.com, or asks for a calm, natural, minimal look.
license: MIT
metadata:
  version: "0.2.0"
---

# Niltavi UI

Niltavi UI is a theme plus working screens for React products: HeroUI v3 components, a warm paper-and-forest palette, and templates you copy instead of rebuilding.

- Live reference: https://ui.niltavi.com/
- Source: https://github.com/niltavi/niltavi-ui

## The tool

Everything that can be exact lives in one script next to this file. Run it from the project root:

```bash
node <this skill's folder>/scripts/niltavi.mjs <command>
```

It reads the current Niltavi UI repository (a local checkout, `--source <dir>`, `NILTAVI_UI_DIR`, or a cached clone it keeps up to date), so its output wins over anything written here.

| Command | Use it to |
| --- | --- |
| `init [--product]` | Copy the theme (and the shared header, footer, and theme toggle) into the project, then print the exact install and import steps |
| `list` | See every template and component kit |
| `get <id>` | Copy a template or kit, with every file it imports and the CSS it needs |
| `example [component]` | Find a working example for one component, or print it |
| `tokens [motion]` | Print the current color tokens (light and dark) or motion tokens and classes |
| `sizes` | Print the recommended sizes: header, sidebar, tab bar, breakpoints, icons, spacing |
| `check [paths]` | Check code against the rules; exits 1 on errors |
| `favicon` / `favicon check [dir]` | Print the favicon and app icon spec; check a site's icons, touch icon, and manifest |

## Workflow

Copy this checklist and work through it:

- [ ] `init` once per project; run every step it prints
- [ ] `list`, then `get` the closest template or kit; `example <component>` for single controls
- [ ] Change the content; keep the structure, classes, and tokens. Write new layout only for what's missing
- [ ] Before using a HeroUI component you haven't used here, read `https://heroui.com/docs/react/components/<kebab-name>.mdx`
- [ ] `check` the files you changed. Fix every error, then look at each warning
- [ ] View it in light and dark, at 320px and at desktop width
- [ ] When adding or changing a favicon or app icon, follow [references/favicon.md](references/favicon.md) and run `favicon check`

`check` errors are hard rules: hard-coded colors, Tailwind's default palette, HeroUI v2 APIs, icon sets other than `@gravity-ui/icons`, icon-only buttons without `aria-label`. Warnings are design advice: drop shadows, gradients and blur, palette primitives in components, `onClick` on HeroUI controls, motion outside 150–320ms, more than one primary button or rufous accent. Change a warning, or keep it on purpose with a `// niltavi-ignore <rule>` comment on or above the line.

## Judgment

The tool can't check taste. Aim for clean, simple, spacious, crafted, and natural. niltavi is made for a calm life: less information, fewer decisions, less work. Interfaces follow from that.

- Follow Apple's [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines): clear hierarchy, content before chrome, controls where people expect them.
- Treat the user as smart. No intro paragraphs, captions that repeat a heading, or helper text under obvious fields.
- Prefer a familiar icon to a word: icon-only `ghost` button, `aria-label`, `Tooltip`. Keep text for ambiguous or consequential actions.
- One primary action per view. Group with space first, a `separator` line second, a `Card` only when content needs a container.
- Pick good defaults instead of adding settings.
- Every list has an empty state, every async view a loading state, every form an error state.

These are defaults, not laws. Where the user asks for something else, or where Niltavi has no opinion (charts, illustrations, marketing pages, brand content), follow the user. Keep `check` free of errors unless the user wants otherwise.

## HeroUI v3

HeroUI v3 only: no provider, compound components (`Card.Header`), `onPress`, semantic variants. The v2/v3 differences, the variant table, and Niltavi's extra classes are in [references/components.md](references/components.md).
