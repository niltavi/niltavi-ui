import {useEffect, useRef, useState, type Ref} from "react";
import "./vendor/niltavi-banner/screenprint.js";

export type BannerSettings = {seed?: string; wobble?: number; grain?: number; paper?: string};
type NiltaviBanner = {width: number; height: number; defaults: Required<BannerSettings>; drawPoster: (context: CanvasRenderingContext2D, settings?: BannerSettings) => void};

export const banner = (globalThis as typeof globalThis & {NiltaviBanner: NiltaviBanner}).NiltaviBanner;

export function randomSeed() {
  return crypto.getRandomValues(new Uint32Array(1))[0]!.toString(36);
}

/** Draws one niltavi-banner poster. Without `paper`, it prints on the theme's `--color-paper` token. */
export function BannerCanvas({seed, wobble, grain, paper, className = "nt-banner", canvasRef, label}: BannerSettings & {seed: string; className?: string; canvasRef?: Ref<HTMLCanvasElement>; label?: string}) {
  const own = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = own.current;
    const context = canvas?.getContext("2d", {willReadFrequently: true});
    if (!canvas || !context) return;
    const ink = paper ?? getComputedStyle(canvas).getPropertyValue("--color-paper").trim();
    banner.drawPoster(context, {seed, wobble, grain, ...(ink ? {paper: ink} : {})});
  }, [seed, wobble, grain, paper]);

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
