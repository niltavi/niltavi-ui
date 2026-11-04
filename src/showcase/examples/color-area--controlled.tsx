// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {Color} from "@heroui/react";

import {ColorArea, ColorSwatch, parseColor} from "@heroui/react";
import {useState} from "react";

export function ColorAreaControlled() {
  const t = useCopy();
  const [color, setColor] = useState<Color>(parseColor("#9B80FF"));

  return (
    <div className="flex flex-col gap-4">
      <ColorArea colorSpace="rgb" value={color} xChannel="red" yChannel="green" onChange={setColor}>
        <ColorArea.Thumb />
      </ColorArea>
      <div className="flex w-full max-w-[300px] items-center gap-3">
        <ColorSwatch color={color} size="md" />
        <p className="text-sm text-muted">
          {t("Current color:")}{t(" ")}
          <span className="font-medium">{t(color ? color.toString("hex") : "(empty)")}</span>
        </p>
      </div>
    </div>
  );
}

export default ColorAreaControlled;
