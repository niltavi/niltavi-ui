# For Agents

## Install the Skill

```sh
npx skills add niltavi/niltavi-ui --skill niltavi-ui
```

Check that the agent's project skill directory contains `niltavi-ui/SKILL.md`. Reload skills. Use `$niltavi-ui` in Codex or `/niltavi-ui` in Claude Code. Read the [current UI Skill](../../skills/niltavi-ui/SKILL.md) before making interface changes.

## Reuse the product shell

Use an authorized checkout of a specific Niltavi UI commit. Import [the theme entry](../../src/theme/index.css) and [the shared shell](../../src/product/ProductHeader.tsx) from that checkout or copy their source at the same commit into your existing UI vendor directory. Keep the whole `src/theme` directory together so the computed backgrounds and self-hosted DM Sans font match. For static sites, compile the same [product CSS](../../src/theme/product.css) with the theme and use its project brand, control and container classes with your server-rendered markup and Gravity UI icons.

- Pass your approved project mark to `ProductHeader` with `brand.name`, `brand.href`, and `brand.symbol`. Use `variant="app"` for the full-width workspace header. Leave the content cap on the page below it.
- Pass the current language and equivalent route links in `locales`. When using a client router, pass its navigation callback to `onNavigateLocale` and retain current content until the next view is ready. Public locale URLs must also load directly with translated HTML and canonical and alternate metadata.
- Render [the theme initialization script](../../src/product/theme.ts) in the document head before the stylesheet. Initialize the client state with `preferredTheme` and call `saveTheme` for a user toggle.
- For hosted products, pass a localized `signIn` link to put the secondary action immediately before the controls.
- Use `ProductFooter` with the two existing Niltavi wordmark assets in [docs/assets](../assets).

Use [EmailPasswordForm](../../src/product/EmailPasswordForm.tsx) on separate sign-in and registration routes. The form declares POST and stays disabled until its client submit handler is ready. It sends only the typed email and password to the callback. Handle server errors in the callback and navigate to any email verification step after registration. Keep account creation, verification, and authorization in the applicable production service.

## Favicons and app icons

Follow the [favicon and app icon specification](../../skills/niltavi-ui/references/favicon.md) for every product and website. It builds each icon from one layered `1024 × 1024` master, uses a full-bleed `apple-touch-icon.png` and maskable icon with a rounded tile everywhere else, and lists the required files and `<head>` markup. Run `node <skill>/scripts/niltavi.mjs favicon check` in the project before handing the change back.

## Verify a change

```sh
npm ci
npm test
npm run build
npm run preview
```

Open the built English and Chinese URLs in a background browser. Check both themes, the computed brand and controls at 320px and desktop, and keyboard operation. Check direct loading and the locale switch on a deep link. Use the deployed service and approved test accounts when verifying product authentication and workflows.
