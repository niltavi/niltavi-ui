// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
// niltavi-ignore-file: the color values here are data the user picks, not styling.
import {useCopy} from "../copy";
import {ColorSlider, Label} from "@heroui/react";

export function AlphaChannel() {
  const t = useCopy();
  return (
    <ColorSlider channel="alpha" className="w-full max-w-xs" defaultValue="hsla(0, 100%, 50%, 0.5)">
      <Label>{t("Alpha")}</Label>
      <ColorSlider.Output />
      <ColorSlider.Track>
        <ColorSlider.Thumb />
      </ColorSlider.Track>
    </ColorSlider>
  );
}

export default AlphaChannel;
