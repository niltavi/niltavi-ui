// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {ColorSlider, ColorSwatch, Label} from "@heroui/react";
import {useState} from "react";
import {parseColor} from "react-aria-components";

export function RGBChannels() {
  const t = useCopy();
  const [color, setColor] = useState(parseColor("rgb(255, 100, 50)"));

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <ColorSlider channel="red" value={color} onChange={setColor}>
        <Label>{t("Red")}</Label>
        <ColorSlider.Output />
        <ColorSlider.Track>
          <ColorSlider.Thumb />
        </ColorSlider.Track>
      </ColorSlider>
      <ColorSlider channel="green" value={color} onChange={setColor}>
        <Label>{t("Green")}</Label>
        <ColorSlider.Output />
        <ColorSlider.Track>
          <ColorSlider.Thumb />
        </ColorSlider.Track>
      </ColorSlider>
      <ColorSlider channel="blue" value={color} onChange={setColor}>
        <Label>{t("Blue")}</Label>
        <ColorSlider.Output />
        <ColorSlider.Track>
          <ColorSlider.Thumb />
        </ColorSlider.Track>
      </ColorSlider>
      <div className="flex items-center gap-2">
        <ColorSwatch color={color} size="sm" />
        <p className="text-sm text-muted">
          {t("Current color:")}<code className="font-mono">{t(color.toString("rgb"))}</code>
        </p>
      </div>
    </div>
  );
}

export default RGBChannels;
