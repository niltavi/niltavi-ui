import {useEffect, useRef, useState, type Ref} from "react";
import "./vendor/niltavi-banner/screenprint.js";

export type BannerSettings = {seed?: string; wobble?: number; grain?: number; paper?: string};
type NiltaviBanner = {width: number; height: number; defaults: Required<BannerSettings>; drawPoster: (context: CanvasRenderingContext2D, settings?: BannerSettings) => void};

export const banner = (globalThis as typeof globalThis & {NiltaviBanner: NiltaviBanner}).NiltaviBanner;

export function randomSeed() {
  return crypto.getRandomValues(new Uint32Array(1))[0]!.toString(36);
}

/** Resolves a CSS color (tokens, oklch, color-mix…) to an rgba() string the poster can print with. */
function resolveColor(host: Element, value: string) {
  const probe = document.createElement("span");
  probe.style.color = value;
  probe.style.display = "none";
  host.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const pixel = document.createElement("canvas").getContext("2d", {willReadFrequently: true});
  if (!pixel) return "";
  pixel.fillStyle = computed;
  pixel.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b}, ${(a! / 255).toFixed(3)})`;
}

/** Bumps when the page switches between light and dark. */
function useThemeVersion() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1));
    observer.observe(document.documentElement, {attributes: true, attributeFilter: ["class", "data-theme"]});
    return () => observer.disconnect();
  }, []);
  return version;
}

/**
 * Draws one niltavi-banner poster. Without `paper`, it prints on the theme's
 * `--banner-paper` token, adds the `--banner-veil` night layer in dark mode,
 * and redraws when the theme changes. Put it in an `.nt-banner-panel`.
 */
export function BannerCanvas({seed, wobble, grain, paper, className = "nt-banner", canvasRef, label}: BannerSettings & {seed: string; className?: string; canvasRef?: Ref<HTMLCanvasElement>; label?: string}) {
  const own = useRef<HTMLCanvasElement | null>(null);
  const theme = useThemeVersion();

  useEffect(() => {
    const canvas = own.current;
    const context = canvas?.getContext("2d", {willReadFrequently: true});
    if (!canvas || !context) return;
    const host = canvas.parentElement ?? canvas;
    const ink = paper ?? resolveColor(host, "var(--banner-paper)");
    banner.drawPoster(context, {seed, wobble, grain, ...(ink ? {paper: ink} : {})});
    // Theme paper in dark: lay the night veil over the whole print, as the panel does.
    const veil = paper ? "" : resolveColor(host, "var(--banner-veil)");
    if (veil && !veil.endsWith(", 0.000)")) {
      context.fillStyle = veil;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [seed, wobble, grain, paper, theme]);

  return <canvas ref={(node) => {
    own.current = node;
    if (typeof canvasRef === "function") canvasRef(node);
    else if (canvasRef) canvasRef.current = node;
  }} className={className} width={banner.width} height={banner.height} data-seed={seed}
  {...(label ? {role: "img", "aria-label": label} : {"aria-hidden": true})} />;
}

/** Screen-print poster from niltavi-banner; every mount draws a new seed. */
export function BannerScene() {
  const [seed] = useState(randomSeed);
  return <BannerCanvas seed={seed} />;
}
