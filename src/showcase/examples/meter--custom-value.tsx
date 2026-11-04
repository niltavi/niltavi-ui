// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Label, Meter} from "@heroui/react";

export function CustomValue() {
  const t = useCopy();
  return (
    <Meter
      className="w-full max-w-64"
      formatOptions={{currency: "USD", style: "currency"}}
      maxValue={1000}
      minValue={0}
      value={750}
    >
      <Label>{t("Revenue")}</Label>
      <Meter.Output />
      <Meter.Track>
        <Meter.Fill />
      </Meter.Track>
    </Meter>
  );
}

export default CustomValue;
