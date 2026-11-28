"""Generate the Niltavi UI favicons and app icons from the approved symbol.

Follows skills/niltavi-ui/references/favicon.md. Requires Pillow.

Outputs:
  docs/assets/icon/background.svg, foreground.svg   1024 master layers
  public/favicon.svg, favicon.ico                    rounded tile, light and dark
  public/apple-touch-icon.png                        180, full-bleed, opaque
  public/icon-192.png, icon-512.png                  rounded tile (manifest "any")
  public/icon-maskable-512.png                       full-bleed (manifest "maskable")
  public/icon-monochrome-512.png                     symbol only (manifest "monochrome")
"""

import math
import re
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageDraw
except ImportError as error:  # pragma: no cover
    raise SystemExit("generate_icons.py needs Pillow: python3 -m pip install Pillow") from error

ROOT = Path(__file__).resolve().parent.parent
SYMBOL = ROOT / "docs/assets/logo-filled.svg"
PUBLIC = ROOT / "public"
MASTER = ROOT / "docs/assets/icon"

CANVAS = 1024
GLYPH_BOX = 576  # largest square that fits the 40% safe circle
SMALL_GLYPH_BOX = {16: 12, 32: 22, 48: 32}  # enlarged for legibility at tab sizes
RADIUS = 0.225  # corner radius as a share of the side
CORNER_SPAN = 1.528  # a continuous corner starts this many radii from the corner
SUPERSAMPLE = 8

PAPER = "#F5F1E6"  # --color-paper
INK = "#283E38"  # --color-ink
NIGHT = "#0B1224"  # --color-throat-975


# ---------- Geometry ----------

def parse_path(d):
    """Return the subpaths of an absolute M/L/C/Z path as lists of points."""
    tokens = re.findall(r"[MLCZ]|-?\d*\.?\d+", d)
    subpaths, current, command, i = [], [], None, 0
    while i < len(tokens):
        token = tokens[i]
        if token in "MLCZ":
            command, i = token, i + 1
            if command == "Z":
                if current:
                    subpaths.append(current)
                current = []
            continue
        if command == "M":
            current = [(float(tokens[i]), float(tokens[i + 1]))]
            command, i = "L", i + 2
        elif command == "L":
            current.append((float(tokens[i]), float(tokens[i + 1])))
            i += 2
        elif command == "C":
            p0 = current[-1]
            p1, p2, p3 = [(float(tokens[i + k]), float(tokens[i + k + 1])) for k in (0, 2, 4)]
            for step in range(1, 17):
                t = step / 16
                u = 1 - t
                current.append((
                    u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0],
                    u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1],
                ))
            i += 6
        else:
            raise ValueError(f"unsupported path data near {token!r}")
    if current:
        subpaths.append(current)
    return subpaths


def symbol():
    text = SYMBOL.read_text(encoding="utf-8")
    d = re.search(r'\sd="([^"]+)"', text).group(1)
    points = [p for sub in parse_path(d) for p in sub]
    xs, ys = [p[0] for p in points], [p[1] for p in points]
    return d, (min(xs), min(ys), max(xs), max(ys))


def glyph_transform(bounds, box, canvas=CANVAS):
    """Scale and offset that fit the symbol in a centered square box."""
    x0, y0, x1, y1 = bounds
    scale = box / max(x1 - x0, y1 - y0)
    return scale, canvas / 2 - (x0 + x1) / 2 * scale, canvas / 2 - (y0 + y1) / 2 * scale


def tile_outline(side, steps=24):
    """Rounded square with continuous-curvature corners.

    Each corner is a superellipse quarter spanning CORNER_SPAN radii along both
    edges. Its exponent makes the curve pass where a circular corner of the same
    radius would at 45 degrees, and it meets the straight edges with zero curvature.
    """
    r = RADIUS * side
    span = CORNER_SPAN * r
    depth = (math.sqrt(2) - 1) * r / math.sqrt(2)  # circular corner's inset at 45 degrees, per axis
    n = math.log(0.5) / math.log(1 - depth / span)
    lo, hi = span, side - span
    centers = [(hi, lo), (hi, hi), (lo, hi), (lo, lo)]  # clockwise from the top right, y down
    points = []
    for index, (cx, cy) in enumerate(centers):
        for step in range(steps + 1):
            angle = math.pi / 2 * (index - 1 + step / steps)
            c, s = math.cos(angle), math.sin(angle)
            points.append((
                cx + span * math.copysign(abs(c) ** (2 / n), c),
                cy + span * math.copysign(abs(s) ** (2 / n), s),
            ))
    return points


def outline_path(points):
    coords = " ".join(f"{x:.1f} {y:.1f}" for x, y in points)
    return f"M {coords} Z"


# ---------- SVG ----------

def write_svg(path, body):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{CANVAS}" height="{CANVAS}" viewBox="0 0 {CANVAS} {CANVAS}">\n{body}\n</svg>\n', encoding="utf-8")


def write_svgs(d, bounds):
    scale, dx, dy = glyph_transform(bounds, GLYPH_BOX)
    glyph = f'<path transform="matrix({scale:.5f} 0 0 {scale:.5f} {dx:.3f} {dy:.3f})" fill-rule="evenodd" d="{d}"/>'
    write_svg(MASTER / "background.svg", f'  <title>Niltavi UI icon background</title>\n  <rect width="{CANVAS}" height="{CANVAS}" fill="{PAPER}"/>')
    write_svg(MASTER / "foreground.svg", f'  <title>Niltavi UI icon foreground</title>\n  <g fill="{INK}">{glyph}</g>')
    write_svg(PUBLIC / "favicon.svg", "\n".join([
        "  <title>Niltavi UI</title>",
        f"  <style>.bg {{ fill: {PAPER}; }} .fg {{ fill: {INK}; }} @media (prefers-color-scheme: dark) {{ .bg {{ fill: {NIGHT}; }} .fg {{ fill: {PAPER}; }} }}</style>",
        f'  <path class="bg" d="{outline_path(tile_outline(CANVAS))}"/>',
        f'  <g class="fg">{glyph}</g>',
    ]))


# ---------- Raster ----------

def hex_rgb(value):
    return tuple(int(value[i:i + 2], 16) for i in (1, 3, 5))


def glyph_mask(subpaths, transform, size):
    """Even-odd coverage of the symbol at size x SUPERSAMPLE."""
    scale, dx, dy = transform
    k = size * SUPERSAMPLE / CANVAS
    mask = Image.new("1", (size * SUPERSAMPLE,) * 2, 0)
    for sub in subpaths:
        layer = Image.new("1", mask.size, 0)
        ImageDraw.Draw(layer).polygon([((x * scale + dx) * k, (y * scale + dy) * k) for x, y in sub], fill=1)
        mask = ImageChops.logical_xor(mask, layer)
    return mask.convert("L")


def render(subpaths, bounds, size, *, shape, background=PAPER, foreground=INK, box=None):
    big = size * SUPERSAMPLE
    transform = glyph_transform(bounds, box if box is not None else GLYPH_BOX)
    glyph = glyph_mask(subpaths, transform, size)
    if shape == "symbol":
        image = Image.new("RGBA", (big, big), hex_rgb(foreground) + (0,))
        image.putalpha(glyph)
    else:
        image = Image.new("RGBA", (big, big), hex_rgb(background) + (255,))
        image.paste(Image.new("RGBA", (big, big), hex_rgb(foreground) + (255,)), mask=glyph)
        if shape == "tile":
            tile = Image.new("L", (big, big), 0)
            ImageDraw.Draw(tile).polygon(tile_outline(big, steps=64), fill=255)
            image.putalpha(tile)
    small = image.convert("RGBa").resize((size, size), Image.Resampling.BOX).convert("RGBA")
    return small.convert("RGB") if shape == "full" else small


def main():
    d, bounds = symbol()
    subpaths = parse_path(d)
    write_svgs(d, bounds)

    render(subpaths, bounds, 180, shape="full").save(PUBLIC / "apple-touch-icon.png", optimize=True)
    render(subpaths, bounds, 512, shape="full").save(PUBLIC / "icon-maskable-512.png", optimize=True)
    for size in (192, 512):
        render(subpaths, bounds, size, shape="tile").save(PUBLIC / f"icon-{size}.png", optimize=True)
    render(subpaths, bounds, 512, shape="symbol", foreground="#000000").save(PUBLIC / "icon-monochrome-512.png", optimize=True)

    small = {size: render(subpaths, bounds, size, shape="tile", box=box * CANVAS / size) for size, box in SMALL_GLYPH_BOX.items()}
    small[48].save(PUBLIC / "favicon.ico", format="ICO", sizes=[(s, s) for s in small], append_images=[small[16], small[32]])
    print("Wrote", ", ".join(sorted(p.name for p in PUBLIC.glob("*") if p.suffix in {".png", ".ico", ".svg"})))


if __name__ == "__main__":
    main()
