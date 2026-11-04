"""Generate the Niltava palette and HeroUI v3 theme.

Outputs:
  src/theme/palette.css      Tailwind v4 @theme primitives + custom color utilities
  src/theme/niltava.css      HeroUI v3 theme variables (light / dark)
  src/theme/tokens.json      Resolved values for the preview app
  tokens/*.tokens.json       Design Tokens (DTCG) for Figma / Tokens Studio
  docs/palette.html          Standalone color card

Exits non-zero when a foreground/background pair misses its contrast target.
"""
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# ---------- color math ----------

def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def linear_to_srgb(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055

def oklab_to_linear(L, a, b):
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    return (
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    )

def linear_to_oklab(r, g, b):
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = (math.copysign(abs(x) ** (1 / 3), x) for x in (l, m, s))
    return (
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
    )

def oklch_to_hex(L, C, h):
    """Convert OKLCH to sRGB hex, reducing chroma until the color is in gamut."""
    def rgb(c):
        return oklab_to_linear(L, c * math.cos(math.radians(h)), c * math.sin(math.radians(h)))
    lo, hi = 0.0, C
    if not all(-1e-4 <= x <= 1 + 1e-4 for x in rgb(C)):
        for _ in range(32):
            mid = (lo + hi) / 2
            if all(-1e-4 <= x <= 1 + 1e-4 for x in rgb(mid)):
                lo = mid
            else:
                hi = mid
        C = lo
    channels = [min(1, max(0, x)) for x in rgb(C)]
    return "#" + "".join(f"{round(linear_to_srgb(x) * 255):02X}" for x in channels)

def hex_to_linear(hx):
    return [srgb_to_linear(int(hx[i:i + 2], 16) / 255) for i in (1, 3, 5)]

def linear_to_hex(rgb):
    return "#" + "".join(f"{round(linear_to_srgb(min(1, max(0, x))) * 255):02X}" for x in rgb)

def hex_to_oklch(hx):
    L, a, b = linear_to_oklab(*hex_to_linear(hx))
    C = math.hypot(a, b)
    H = (math.degrees(math.atan2(b, a)) + 360) % 360 if C > 0.002 else 0
    return round(L, 4), round(C, 4), round(H, 2)

def oklch_css(hx):
    L, C, H = hex_to_oklch(hx)
    return f"oklch({L:.3f} {C:.3f} {H:.1f})" if C else f"oklch({L:.3f} 0 0)"

def mix(hx_a, hx_b, pct_b):
    """color-mix(in oklab, a, b pct_b%)."""
    A = linear_to_oklab(*hex_to_linear(hx_a))
    B = linear_to_oklab(*hex_to_linear(hx_b))
    t = pct_b / 100
    return linear_to_hex(oklab_to_linear(*[x + (y - x) * t for x, y in zip(A, B)]))

def luminance(hx):
    r, g, b = hex_to_linear(hx)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(a, b):
    x, y = luminance(a), luminance(b)
    return (max(x, y) + 0.05) / (min(x, y) + 0.05)

# ---------- scales ----------

STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975]
# One lightness curve for every hue: the same step has the same perceived lightness.
LIGHTNESS = [0.975, 0.943, 0.888, 0.812, 0.726, 0.640, 0.548, 0.472, 0.398, 0.330, 0.255, 0.185]
CHROMA_COOL = [0.10, 0.22, 0.42, 0.66, 0.88, 1.0, 1.0, 0.92, 0.80, 0.66, 0.50, 0.38]
CHROMA_WARM = [0.20, 0.38, 0.60, 0.80, 0.95, 1.0, 1.0, 0.92, 0.80, 0.66, 0.50, 0.38]

# name: (peak chroma, hue per step, chroma curve)
SCALES = {
    "niltava": (0.23, [250, 252, 256, 260, 264, 267, 268, 270, 272, 273, 274, 275], CHROMA_COOL),
    "rufous": (0.21, [78, 74, 70, 64, 57, 48, 40, 36, 33, 31, 30, 30], CHROMA_WARM),
    "glossy": (0.16, [220, 222, 225, 229, 233, 238, 242, 245, 248, 250, 252, 253], CHROMA_COOL),
    "violet": (0.24, [290, 291, 292, 293, 294, 295, 296, 297, 298, 298, 298, 298], CHROMA_COOL),
    "leaf": (0.19, [148, 149, 150, 151, 152, 154, 156, 158, 160, 162, 164, 165], CHROMA_COOL),
    "berry": (0.23, [16, 16, 17, 18, 19, 20, 21, 22, 22, 22, 22, 22], CHROMA_COOL),
    "gold": (0.18, [98, 96, 93, 90, 86, 80, 72, 66, 60, 56, 52, 50], CHROMA_WARM),
}

palette = {}
for name, (peak, hues, curve) in SCALES.items():
    palette[name] = {s: oklch_to_hex(LIGHTNESS[i], peak * curve[i], hues[i]) for i, s in enumerate(STEPS)}
palette["throat"] = {
    s: oklch_to_hex(0.982 if i == 0 else LIGHTNESS[i], 0.008 + 0.030 * min(i, 10) / 10, 268)
    for i, s in enumerate(STEPS)
}

SCALE_ORDER = ["niltava", "rufous", "glossy", "violet", "throat", "leaf", "berry", "gold"]

# Paper and ink match the website without changing the eight plumage scales.
MATERIALS = {"paper": "#F5F1E6", "ink": "#283E38"}

def ref(r):
    if r == "white":
        return "#FFFFFF"
    if r in MATERIALS:
        return MATERIALS[r]
    name, step = r.rsplit("-", 1)
    return palette[name][int(step)]

# ---------- HeroUI semantic mapping ----------
# A value is a scale/material ref, "white", or ("mix", a, b, pct_b).

LIGHT = {
    "background": "paper", "foreground": "ink",
    "surface": ("mix", "paper", "white", 15), "surface-secondary": "paper", "surface-tertiary": ("mix", "paper", "ink", 8),
    "overlay": ("mix", "paper", "white", 15), "muted": ("mix", "ink", "paper", 25),
    "default": ("mix", "paper", "ink", 7), "default-foreground": "ink",
    "accent": "niltava-600", "accent-foreground": "white",
    "field-background": ("mix", "paper", "white", 15), "field-foreground": "ink", "field-placeholder": "throat-500",
    "field-border": ("mix", "paper", "ink", 22),
    "success": "leaf-600", "success-foreground": "white",
    "warning": "gold-400", "warning-foreground": "throat-950",
    "danger": "berry-600", "danger-foreground": "white",
    "info": "glossy-600", "info-foreground": "white",
    "rufous": "rufous-600", "rufous-foreground": "white",
    "segment": ("mix", "paper", "white", 15), "segment-foreground": "ink",
    "border": ("mix", "paper", "ink", 14), "separator": ("mix", "paper", "ink", 8),
    "focus": "niltava-500", "link": "niltava-600",
    "accent-soft-foreground": "niltava-700", "success-soft-foreground": "leaf-700",
    "warning-soft-foreground": "gold-700", "danger-soft-foreground": "berry-700",
    "info-soft-foreground": "glossy-700", "rufous-soft-foreground": "rufous-700",
}
DARK = {
    "background": "throat-975", "foreground": "paper",
    "surface": "throat-950", "surface-secondary": ("mix", "throat-950", "throat-900", 35),
    "surface-tertiary": ("mix", "throat-950", "throat-900", 60),
    "overlay": ("mix", "throat-950", "throat-900", 25), "muted": "throat-400",
    "default": ("mix", "throat-950", "throat-900", 60), "default-foreground": "paper",
    "accent": "niltava-400", "accent-foreground": "niltava-975",
    "field-background": "throat-950", "field-foreground": "paper", "field-placeholder": "throat-500",
    "field-border": ("mix", "throat-950", "throat-800", 65),
    "success": "leaf-400", "success-foreground": "leaf-975",
    "warning": "gold-300", "warning-foreground": "gold-975",
    "danger": "berry-400", "danger-foreground": "berry-975",
    "info": "glossy-400", "info-foreground": "glossy-975",
    "rufous": "rufous-400", "rufous-foreground": "rufous-975",
    "segment": "throat-900", "segment-foreground": "paper",
    "border": ("mix", "throat-950", "throat-800", 45), "separator": ("mix", "throat-950", "throat-900", 35),
    "focus": "niltava-400", "link": "niltava-300",
    "accent-soft-foreground": "niltava-300", "success-soft-foreground": "leaf-300",
    "warning-soft-foreground": "gold-300", "danger-soft-foreground": "berry-300",
    "info-soft-foreground": "glossy-300", "rufous-soft-foreground": "rufous-300",
}
# Categorical chart series, chosen so every pair stays apart under protan / deutan / tritan simulation.
CHART = {
    "light": ["niltava-600", "rufous-500", "leaf-600", "violet-700", "gold-700", "berry-800", "glossy-700", "throat-500"],
    "dark": ["niltava-400", "rufous-300", "leaf-200", "violet-500", "gold-500", "berry-400", "glossy-300", "throat-400"],
}
SOFT_PCT = {"light": 15, "dark": 12}  # matches HeroUI's soft background mix

def resolve(v):
    if isinstance(v, tuple):
        _, a, b, pct = v
        return mix(ref(a), ref(b), pct)
    return ref(v)

def css_value(v):
    if isinstance(v, tuple):
        _, a, b, pct = v
        return f"color-mix(in oklab, {css_value(a)} {100 - pct}%, {css_value(b)} {pct}%)"
    if v == "white":
        return "var(--white)"
    return f"var(--color-{v})"

resolved = {"light": {k: resolve(v) for k, v in LIGHT.items()}, "dark": {k: resolve(v) for k, v in DARK.items()}}

# ---------- contrast audit ----------

CHECKS = [
    ("foreground", "background", 7), ("foreground", "surface", 7), ("muted", "surface", 4.5),
    ("muted", "background", 4.5), ("link", "background", 4.5), ("field-placeholder", "field-background", 3),
    ("focus", "background", 3),
    ("field-foreground", "field-background", 7), ("foreground", "overlay", 7),
    ("default-foreground", "default", 7), ("segment-foreground", "segment", 7),
]
for c in ["accent", "success", "warning", "danger", "info", "rufous"]:
    CHECKS.append((f"{c}-foreground", c, 4.5))
    CHECKS.append((f"{c}-soft-foreground", f"{c}-soft", 4.5))

audit, failed = [], False
for mode in ("light", "dark"):
    t = resolved[mode]
    for c in ["accent", "success", "warning", "danger", "info", "rufous"]:
        t[f"{c}-soft"] = mix(t["surface"], t[c], SOFT_PCT[mode])  # soft fill as it renders on surface
    for fg, bg, target in CHECKS:
        ratio = contrast(t[fg], t[bg])
        ok = ratio >= target
        failed |= not ok
        audit.append({"mode": mode, "fg": fg, "bg": bg, "ratio": round(ratio, 2), "target": target, "pass": ok})
    for i, r in enumerate(CHART[mode]):
        ratio = contrast(ref(r), t["surface"])
        ok = ratio >= 3
        failed |= not ok
        audit.append({"mode": mode, "fg": f"chart-{i + 1}", "bg": "surface", "ratio": round(ratio, 2), "target": 3, "pass": ok})

# ---------- writers ----------

HEADER = "/* Generated by scripts/generate_tokens.py. Edit the script, not this file. */\n"

def write_palette_css():
    lines = [HEADER, "@theme static {"]
    for name, hx in MATERIALS.items():
        lines.append(f"  --color-{name}: {oklch_css(hx)}; /* {hx} */")
    lines.append("")
    for name in SCALE_ORDER:
        for s in STEPS:
            lines.append(f"  --color-{name}-{s}: {oklch_css(palette[name][s])}; /* {palette[name][s]} */")
        lines.append("")
    lines.append("}\n")
    lines.append("/* Semantic colors HeroUI does not ship, exposed as Tailwind utilities (bg-info, text-rufous, bg-chart-1 ...) */")
    lines.append("@theme inline {")
    for c in ["info", "rufous"]:
        for suffix in ["", "-foreground", "-hover", "-soft", "-soft-foreground", "-soft-hover"]:
            lines.append(f"  --color-{c}{suffix}: var(--{c}{suffix});")
    for i in range(1, 9):
        lines.append(f"  --color-chart-{i}: var(--chart-{i});")
    lines.append("}\n")
    (ROOT / "src/theme/palette.css").write_text("\n".join(lines))

def theme_block(mode, mapping):
    out = []
    for k, v in mapping.items():
        out.append(f"    --{k}: {css_value(v)};")
    # Keep these in each mode block so switching themes cannot restore defaults.
    out.extend([
        "    --radius: 0.25rem;",
        "    --field-radius: 0.375rem;",
        "    --field-border-width: 1px;",
        "    --field-border-hover: var(--muted);",
        "    --field-border-focus: var(--focus);",
        "    --surface-shadow: 0 0 0 1px var(--border);",
        "    --overlay-shadow: 0 0 0 1px var(--border);",
        "    --field-shadow: 0 0 0 0 transparent;",
    ])
    pct = SOFT_PCT[mode]
    for c in ["info", "rufous"]:
        out.append(f"    --{c}-hover: color-mix(in oklab, var(--{c}) 90%, var(--{c}-foreground) 10%);")
        out.append(f"    --{c}-soft: color-mix(in oklab, var(--{c}) {pct}%, transparent);")
        out.append(f"    --{c}-soft-hover: color-mix(in oklab, var(--{c}) {pct + 5}%, transparent);")
    for i, r in enumerate(CHART[mode]):
        out.append(f"    --chart-{i + 1}: {css_value(r)};")
    alpha = "0.45" if mode == "light" else "0.6"
    out.append(f"    --backdrop: color-mix(in oklab, var(--color-throat-975) {int(float(alpha) * 100)}%, transparent);")
    return "\n".join(out)

def write_theme_css():
    css = f"""{HEADER}/*
 * HeroUI v3 theme. Import after @heroui/styles and palette.css:
 *   @import "tailwindcss";
 *   @import "@heroui/styles";
 *   @import "./theme/palette.css";
 *   @import "./theme/niltava.css";
 * Light / dark follow HeroUI's own switch: class="dark" or data-theme="dark" on <html>.
 */
@layer base {{
  :root,
  .light,
  [data-theme="light"] {{
    color-scheme: light;
{theme_block("light", LIGHT)}
  }}

  .dark,
  [data-theme="dark"] {{
    color-scheme: dark;
{theme_block("dark", DARK)}
  }}
}}
"""
    (ROOT / "src/theme/niltava.css").write_text(css)

def dtcg_color(hx):
    L, C, H = hex_to_oklch(hx)
    return {"$type": "color", "$value": {"colorSpace": "oklch", "components": [L, C, H], "hex": hx.lower()}}

def dtcg_alias(v, mode):
    if isinstance(v, tuple):
        return {"$type": "color", "$value": {"colorSpace": "oklch", "components": list(hex_to_oklch(resolve(v))), "hex": resolve(v).lower()},
                "$description": f"color-mix(in oklab, {v[1]} {100 - v[3]}%, {v[2]} {v[3]}%)"}
    if v == "white":
        return {"$type": "color", "$value": "{color.white}"}
    if v in MATERIALS:
        return {"$type": "color", "$value": f"{{color.{v}}}"}
    name, step = v.rsplit("-", 1)
    return {"$type": "color", "$value": f"{{color.{name}.{step}}}"}

def write_dtcg():
    prim = {"color": {"white": dtcg_color("#FFFFFF")}}
    prim["color"].update({name: dtcg_color(hx) for name, hx in MATERIALS.items()})
    for name in SCALE_ORDER:
        prim["color"][name] = {str(s): dtcg_color(palette[name][s]) for s in STEPS}
    (ROOT / "tokens/primitives.tokens.json").write_text(json.dumps(prim, indent=2, ensure_ascii=False) + "\n")
    for mode, mapping in (("light", LIGHT), ("dark", DARK)):
        sem = {"heroui": {k: dtcg_alias(v, mode) for k, v in mapping.items()},
               "chart": {str(i + 1): dtcg_alias(r, mode) for i, r in enumerate(CHART[mode])}}
        (ROOT / f"tokens/{mode}.tokens.json").write_text(json.dumps(sem, indent=2, ensure_ascii=False) + "\n")

def write_app_json():
    data = {
        "steps": STEPS,
        "scales": {n: {str(s): palette[n][s] for s in STEPS} for n in SCALE_ORDER},
        "oklch": {n: {str(s): oklch_css(palette[n][s]) for s in STEPS} for n in SCALE_ORDER},
        "semantic": {m: {k: (v if isinstance(v, str) else f"mix({v[1]}, {v[2]} {v[3]}%)") for k, v in mp.items()}
                     for m, mp in (("light", LIGHT), ("dark", DARK))},
        "resolved": resolved,
        "chart": CHART,
        "audit": audit,
    }
    (ROOT / "src/theme/tokens.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")

def write_card():
    files = {
        "niltava.css": (ROOT / "src/theme/niltava.css").read_text(),
        "palette.css": (ROOT / "src/theme/palette.css").read_text(),
        **{f"{n}.tokens.json": (ROOT / f"tokens/{n}.tokens.json").read_text() for n in ("primitives", "light", "dark")},
    }
    app = json.loads((ROOT / "src/theme/tokens.json").read_text())
    data = {k: app[k] for k in ("steps", "scales", "oklch", "semantic", "resolved", "chart")}
    data["files"] = files
    body = (ROOT / "scripts/palette-card.template.html").read_text().replace(
        "__DATA__", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
    card_vars = {
        "bg": "background", "surface": "surface", "surface-2": "default", "line": "border",
        "ink": "foreground", "ink-2": "muted", "ink-3": "muted", "blue": "accent",
        "rufous": "rufous", "focus": "focus",
    }
    for mode in ("light", "dark"):
        values = " ".join(f"--{key}:{resolved[mode][token]};" for key, token in card_vars.items())
        body = body.replace(f"__CARD_{mode.upper()}__", values)
    html = ('<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '<style>body{margin:0}</style>\n</head>\n<body>\n' + body + '\n</body>\n</html>\n')
    (ROOT / "docs/palette.html").write_text(html)

def main():
    write_palette_css()
    write_theme_css()
    write_dtcg()
    write_app_json()
    write_card()

    for row in audit:
        if not row["pass"]:
            print(f"FAIL {row['mode']:5} {row['fg']} on {row['bg']}: {row['ratio']} < {row['target']}")
    print(f"{sum(r['pass'] for r in audit)}/{len(audit)} contrast checks passed")
    return 1 if failed else 0

if __name__ == "__main__":
    sys.exit(main())
