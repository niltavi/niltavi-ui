# Components

Niltavi UI uses HeroUI v3 as is, themed through CSS variables. Learn the component from HeroUI, then apply the Niltavi additions below.

## HeroUI v3

Ignore what you know about HeroUI v2.

| | v2 (don't use) | v3 (use) |
| --- | --- | --- |
| Provider | `<HeroUIProvider>` | none |
| API | flat props: `<Card title="x">` | compound: `<Card><Card.Header>` |
| Animation | `framer-motion` | CSS, built in |
| Packages | `@heroui/system`, `@heroui/theme` | `@heroui/react`, `@heroui/styles` |
| Styling | Tailwind v3 | Tailwind v4 |

- Compose with subcomponents (`Card.Header`, `Card.Title`, `Modal.Dialog`, …); don't flatten them into props.
- Handle presses with `onPress`.
- Docs: `https://heroui.com/docs/react/components/<kebab-name>.mdx`. If `node_modules/@heroui/react/docs/` exists, read `llms.txt` and `components/<name>.md` there first; they match the installed version.
- HeroUI's own skill adds scripts for docs, source, and styles: `npx skills add heroui-inc/heroui`.

| Variant | Use for | How many |
| --- | --- | --- |
| `primary` | The action that moves the user forward | One per view |
| `secondary` | Other actions | Any |
| `tertiary` | Dismiss: cancel, skip, back | Sparingly |
| `ghost` | Low-emphasis and icon-only actions | Any |
| `outline` | Secondary actions that need an edge | Any |
| `danger` | Destructive actions, usually inside a confirming `AlertDialog` | When needed |

## Niltavi additions

Defined in the theme's `components.css` and `product.css`.

| Class or component | Use |
| --- | --- |
| `button--rufous`, `chip--rufous chip--soft` | A warm, rare highlight. At most one per screen |
| `choice-card`, `checkbox-group--cards`, `radio-group--cards`, `choice-list--columns` | Checkbox and radio groups as selectable cards (`example checkbox-group--features-and-addons`) |
| `surface--example`, `surface--controls` | Padded surfaces for demos and control groups |
| `niltavi-container` | Responsive page width |
| `ProductHeader`, `ProductFooter`, `EmailPasswordForm`, `theme.ts` | Shared product shell (`init --product`) |

To extend a component, add a BEM modifier in `@layer components` that sets the component's own variables (`--button-bg`, `--chip-fg`, …) from semantic tokens. Don't restyle HeroUI internals with deep selectors or `!important`.
