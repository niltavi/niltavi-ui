import {useEffect, useRef, useState} from "react";
import "./vendor/niltavi-banner/screenprint.js";

type BannerSettings = {seed?: string; wobble?: number; grain?: number};
type NiltaviBanner = {width: number; height: number; drawPoster: (context: CanvasRenderingContext2D, settings?: BannerSettings) => void};

const banner = (globalThis as typeof globalThis & {NiltaviBanner: NiltaviBanner}).NiltaviBanner;

function randomSeed() {
  return crypto.getRandomValues(new Uint32Array(1))[0]!.toString(36);
}

/** Screen-print poster from niltavi-banner; every mount draws a new seed. */
export function BannerScene() {
  const [seed] = useState(randomSeed);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d", {willReadFrequently: true});
    if (context) banner.drawPoster(context, {seed});
  }, [seed]);

  return <canvas ref={canvasRef} className="nt-banner" width={banner.width} height={banner.height} data-seed={seed} aria-hidden="true" />;
}
