# Favicons and app icons

Every Niltavi product and website uses this icon specification. The delivery follows the web standards. The design follows Apple's app icon guidelines: a square, layered master, a system-style rounded mask, and transparency only where Apple allows it.

Check a project with:

```bash
node <this skill's folder>/scripts/niltavi.mjs favicon check [project-dir]
```

Sources, read 2026-11-28:

- [WHATWG HTML, link type `icon`](https://html.spec.whatwg.org/multipage/links.html#rel-icon) (Living Standard)
- [W3C Web Application Manifest](https://www.w3.org/TR/appmanifest/) (Working Draft, 18 November 2026) and [W3C Image Resource](https://www.w3.org/TR/image-resource/)
- [Apple HIG, App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) (updated 28 October 2026)
- [Apple, Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) (`apple-touch-icon`, Apple-specific, not part of any W3C or WHATWG specification)

"Must" marks a rule `favicon check` enforces or a standard requires. "Should" marks a Niltavi default.

## 1. Master artwork

Draw one master per project and export every file from it. Don't redraw the icon per size. Niltavi UI's own icons are a working example: [`scripts/generate_icons.py`](https://github.com/niltavi/niltavi-ui/blob/main/scripts/generate_icons.py) builds the master layers and every file in section 4 from the approved symbol.

| Property | Value |
| --- | --- |
| Canvas | `1024 × 1024` px, square, unmasked (Apple's iOS, iPadOS, and macOS layout size) |
| Color space | sRGB. Display P3 only for native app icons |
| Format | Vector (SVG or PDF). Outline all text and strokes |
| Layers | One `background` layer and one or more `foreground` layers, kept as separate files |

### Layers

| Layer | Content | Transparency |
| --- | --- | --- |
| `background` | One solid color from the table in section 3. No image, texture, or pattern | Must be opaque and full-bleed: it covers all `1024 × 1024` pixels |
| `foreground` | The project's approved symbol, from the same source as the header brand mark | Transparent canvas. The shapes have clear, hard edges with no feathering. Opacity can vary between foreground layers to add depth |

Keep the layers separate in the source (`icon/background.svg`, `icon/foreground.svg`, or groups in one file). Every export composes them. Native apps hand the same layers to Icon Composer (section 6).

### Safe zone

Keep every foreground pixel inside a centered circle whose radius is 40% of the canvas: `409.6 px` on `1024`. This is the W3C maskable safe zone, and it also keeps content clear of Apple's rounded mask and the circular masks of watchOS, visionOS, and Android launchers.

- For a roughly square symbol, the bounding box is at most `576 × 576` px, centered (`224 px` from each edge).
- Center the symbol optically. Move it only to balance visual weight, never toward an edge.
- Leave the rest of the background empty. Apple: "you don't need to fill the entire icon canvas with content."

### Drawing rules

These follow the Apple HIG design and visual effects guidance and the Niltavi interface rules.

- Use the symbol only. Add no words, slogans, or the `niltavi.` prefix. A single-letter mnemonic is allowed only when it is the approved symbol.
- Use filled shapes. At `1024`, keep strokes and gaps at least `48 px` wide so they survive at `32 px`. Avoid hairlines and sharp spikes.
- Add no effects: no shadows, highlights, glows, bevels, blur, gradients, or gloss. The system adds its own, and Niltavi avoids them in any case.
- Use no photos, screenshots, UI controls, or copies of Apple hardware.
- Keep the same shapes across sizes and appearances. Only color changes between light, dark, and monochrome.

## 2. The mask

Apple's platforms mask a square icon themselves. Browsers show a favicon exactly as it is drawn. Niltavi therefore exports two shapes.

| Shape | What it is | Used for |
| --- | --- | --- |
| **Full-bleed** | The square master as is. Opaque, no rounded corners | `apple-touch-icon.png`, the manifest `maskable` icon, native app layers. Never round these yourself: Apple warns that pre-masked layers make edges look jagged |
| **Tile** | The master clipped to a rounded square. Pixels outside the mask are fully transparent | `favicon.svg`, `favicon.ico`, the manifest `any` icons, and anywhere else no system mask is applied |

Tile geometry, for side length `s`:

- Corner radius `0.225 s` (`230 px` on `1024`, `7.2 px` on `32`).
- Use continuous-curvature corners, so the tile resembles Apple's mask. Apple doesn't publish the exact curve. Niltavi draws each corner as a superellipse quarter that starts `1.528 × radius` from the corner along both edges, meets the edges with zero curvature, and passes where a circular corner of the same radius would at 45°.
- At `48 px` and smaller, a circular `rx = 0.225 s` is indistinguishable and is fine.
- No border, stroke, or shadow around the tile.

## 3. Appearances and colors

Apple offers default, dark, clear (light and dark), and tinted appearances and generates any that are missing. On the web, the light tile is the default, the SVG favicon switches to dark with a media query, and the manifest `monochrome` icon covers the tinted and clear cases.

| Appearance | Background layer | Foreground layer | Where it ships |
| --- | --- | --- | --- |
| Default (light) | `--color-paper` `#F5F1E6` | `--color-ink` `#283E38`, or one approved project color with at least 3:1 contrast against the background | `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, manifest `any` and `maskable` |
| Dark | `--color-throat-975` `#0B1224` | `--color-paper` `#F5F1E6`, or the same project color if it keeps 3:1 contrast | `favicon.svg` `@media (prefers-color-scheme: dark)`; Icon Composer dark variant |
| Mono, tinted, clear | None (transparent) | The symbol only, one solid color. Only the alpha channel counts | Manifest `monochrome`; Icon Composer mono variant |

The background colors are the theme's page canvas in each mode. Copy the hex values from `node <skill>/scripts/niltavi.mjs tokens` when the palette changes. Don't use the dark variant for `apple-touch-icon.png` or the manifest icons: a page has only one of each.

## 4. Files

Put the files at the site root (`public/` in Vite projects). `favicon.ico` and `apple-touch-icon.png` must stay at the root because browsers and iOS request those paths even without a `<link>`.

| File | Size | Shape | Alpha | Notes |
| --- | --- | --- | --- | --- |
| `favicon.ico` | `16`, `32`, `48` px, PNG-encoded entries | Tile | Transparent corners | Legacy browsers and the HTML `/favicon.ico` fallback |
| `favicon.svg` | `viewBox="0 0 1024 1024"` | Tile | Transparent corners | Default and dark in one file. Inline the colors in `<style>`, no external references or scripts |
| `apple-touch-icon.png` | `180 × 180` px | Full-bleed | **None**: RGB, or RGBA with every pixel opaque | iOS and iPadOS apply the mask. iOS fills transparent pixels with an opaque color, usually black |
| `icon-192.png` | `192 × 192` px | Tile | Transparent corners | Manifest `purpose: "any"` |
| `icon-512.png` | `512 × 512` px | Tile | Transparent corners | Manifest `purpose: "any"` |
| `icon-maskable-512.png` | `512 × 512` px | Full-bleed | None | Manifest `purpose: "maskable"`. Symbol inside the 40% safe circle |
| `icon-monochrome-512.png` | `512 × 512` px | Symbol only | Transparent background | Manifest `purpose: "monochrome"`. One solid color, black is conventional |
| `site.webmanifest` | — | — | — | Section 5 |

Small sizes:

- At `16`, `32`, and `48` px, enlarge the symbol so it stays legible: a glyph box of `12`, `22`, and `32` px, centered and snapped to whole pixels. The safe-zone rule applies from `64 px` up.
- At `16 px`, drop any detail narrower than one pixel. Keep the same shapes.
- Render rasters from the vector master. Check the `16` and `32` px results at 100% and fix them by hand if a shape blurs.

Don't add a `favicon-32.png` or other loose sizes unless an existing consumer requests that URL. `favicon.ico` already covers them.

## 5. Markup

Place this in the `<head>` of every page, in this order:

```html
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#F5F1E6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B1224" media="(prefers-color-scheme: dark)">
```

Why this order and these attributes:

- Browsers pick the most appropriate icon by `type`, `media`, and `sizes` and use the last declared one on a tie. The SVG comes last so browsers that support it choose it. ICO is the fallback.
- `sizes` must list only sizes the file contains. `any` is only for scalable formats (SVG). Write sizes in lowercase `WxH` with no leading zeros.
- `type` is advisory and has no default. Give it for SVG so browsers without SVG support skip the request.
- Don't use `rel="shortcut icon"`. It is non-conforming.
- `apple-touch-icon` ignores `media`. It has no dark variant.
- If a cache-busting query is needed, add the same `?v=` to every icon URL and change it whenever the master changes.
- When the user chooses a theme explicitly, the theme script should also update the `theme-color` meta tag to match.

`site.webmanifest`:

```json
{
  "name": "Project name",
  "short_name": "Project",
  "icons": [
    {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
    {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
    {"src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
    {"src": "/icon-monochrome-512.png", "sizes": "512x512", "type": "image/png", "purpose": "monochrome"}
  ],
  "theme_color": "#F5F1E6",
  "background_color": "#F5F1E6",
  "display": "standalone"
}
```

- Give each icon a single `purpose`. Don't write `"any maskable"`: a full-bleed square looks wrong where no mask is applied, and a tile looks wrong where one is.
- `background_color` is the light canvas. It is only shown while the app loads.
- Serve the manifest as `application/manifest+json`.

## 6. Native apps

For an iOS, iPadOS, macOS, or watchOS app, build the icon in Icon Composer from the same master:

1. Import `foreground.svg` as one or more layers. Group the layers that should share Liquid Glass settings.
2. Set the background in Icon Composer as a solid fill with the default color from section 3. Don't import a background image.
3. Annotate the Default, Dark, and Mono appearances with the colors in section 3. Leave clear and tinted to the system.
4. Keep Liquid Glass effects at their defaults unless a preview shows a problem. Add no effects of your own.
5. Export the `.icon` file for Xcode. A flattened `1024 × 1024` PNG export for marketing must be opaque.

## 7. Acceptance

`favicon check` covers the file and markup rules. Check these by eye:

- [ ] The symbol is the approved project mark, in the same shapes as the header brand mark.
- [ ] The `16` and `32` px icons are sharp and recognizable in a light and a dark browser tab.
- [ ] `apple-touch-icon.png` on an iPhone Home Screen shows no black corners or doubled rounding.
- [ ] The maskable icon passes [Maskable.app](https://maskable.app/) with the circle mask: nothing is clipped.
- [ ] The dark SVG favicon follows the system setting, and the symbol keeps 3:1 contrast in both appearances.
