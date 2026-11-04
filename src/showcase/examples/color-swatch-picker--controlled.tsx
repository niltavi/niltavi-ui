// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {ColorSwatchPicker, parseColor} from "@heroui/react";
import {useState} from "react";

const colors = ["#F43F5E", "#D946EF", "#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#84CC16"];

export function Controlled() {
  const t = useCopy();
  const [value, setValue] = useState(parseColor("#F43F5E"));

  return (
    <div className="flex flex-col gap-4">
      <ColorSwatchPicker value={value} onChange={setValue}>
        {colors.map((color) => (
          <ColorSwatchPicker.Item key={color} color={color}>
            <ColorSwatchPicker.Swatch />
            <ColorSwatchPicker.Indicator />
          </ColorSwatchPicker.Item>
        ))}
      </ColorSwatchPicker>
      <p className="text-sm text-muted">
        {t("Selected:")}<span className="font-medium">{t(value.toString("hex"))}</span>
      </p>
    </div>
  );
}

export default Controlled;
