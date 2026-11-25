import {ArrowDownToLine, Shuffle} from "@gravity-ui/icons";
import {Button, Description, Input, Label, Slider, TextField, toast} from "@heroui/react";
import {useRef, useState} from "react";
import {useText} from "../../site/Locale";
import {Segmented} from "../shell";
import {banner, BannerCanvas, randomSeed} from "../saas/BannerScene";

type Paper = "theme" | "original";

function Amount({label, value, onCommit}: {label: string; value: number; onCommit: (value: number) => void}) {
  // Drag updates the readout; the poster redraws once on release.
  const [draft, setDraft] = useState(value);
  return <Slider className="w-full" minValue={0} maxValue={100} value={draft} onChange={(v) => setDraft(v as number)} onChangeEnd={(v) => onCommit(v as number)}>
    <Label>{label}</Label>
    <Slider.Output />
    <Slider.Track><Slider.Fill /><Slider.Thumb /></Slider.Track>
  </Slider>;
}

/** niltavi-banner generator: seed, wobble, grain and paper, with PNG download. */
export function BannerKit() {
  const text = useText();
  const [seed, setSeed] = useState(randomSeed);
  const [draftSeed, setDraftSeed] = useState(seed);
  const [wobble, setWobble] = useState(banner.defaults.wobble);
  const [grain, setGrain] = useState(banner.defaults.grain);
  const [paper, setPaper] = useState<Paper>("theme");
  const canvas = useRef<HTMLCanvasElement | null>(null);

  const shuffle = () => { const next = randomSeed(); setSeed(next); setDraftSeed(next); };
  const download = () => {
    canvas.current?.toBlob((blob) => {
      if (!blob) { toast.danger(text("Could not export the poster.", "海报导出失败。")); return; }
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), {href: url, download: `niltavi-banner-${seed}.png`});
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  };

  return <div className="kit-banner">
    {/* The stage matches whichever paper the poster is printed on. */}
    <div className={paper === "original" ? "kit-banner__stage" : "kit-banner__stage nt-banner-panel"} style={paper === "original" ? {background: banner.defaults.paper} : undefined}>
      <BannerCanvas key={paper} seed={seed} wobble={wobble} grain={grain} paper={paper === "original" ? banner.defaults.paper : undefined}
        className="kit-banner__canvas" canvasRef={canvas} label={text(`Poster, seed ${seed}`, `海报，种子 ${seed}`)} />
    </div>
    <form className="kit-banner__controls" onSubmit={(event) => { event.preventDefault(); if (draftSeed.trim()) setSeed(draftSeed.trim()); }}>
      <TextField value={draftSeed} onChange={setDraftSeed} onBlur={() => { if (draftSeed.trim()) setSeed(draftSeed.trim()); }}>
        <Label>{text("Seed", "种子")}</Label>
        <div className="nt-auth__inline">
          <Input className="flex-1" />
          <Button isIconOnly variant="secondary" aria-label={text("New seed", "换一个种子")} onPress={shuffle}><Shuffle aria-hidden="true" width={16} height={16} /></Button>
        </div>
        <Description>{text("The same seed always draws the same poster.", "同一个种子总是画出同一张海报。")}</Description>
      </TextField>
      <Amount label={text("Wobble", "抖动")} value={wobble} onCommit={setWobble} />
      <Amount label={text("Grain", "颗粒")} value={grain} onCommit={setGrain} />
      <div className="kit-banner__field">
        <Label>{text("Paper", "纸色")}</Label>
        <Segmented label={text("Paper", "纸色")} value={paper} onChange={setPaper}
          options={[{id: "theme", label: text("Follow theme", "跟随主题")}, {id: "original", label: text("Original", "原版")}]} />
      </div>
      <div className="kit-banner__actions">
        <Button variant="secondary" onPress={shuffle}><Shuffle aria-hidden="true" width={16} height={16} />{text("Shuffle", "随机")}</Button>
        <Button onPress={download}><ArrowDownToLine aria-hidden="true" width={16} height={16} />{text("Download PNG", "下载 PNG")}</Button>
      </div>
    </form>
  </div>;
}
