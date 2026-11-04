// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Label, Meter} from "@heroui/react";

export function Colors() {
  const t = useCopy();
  return (
    <div className="flex w-full max-w-64 flex-col gap-6">
      <Meter color="default" value={50}>
        <Label>{t("Default")}</Label>
        <Meter.Output />
        <Meter.Track>
          <Meter.Fill />
        </Meter.Track>
      </Meter>
      <Meter color="accent" value={50}>
        <Label>{t("Accent")}</Label>
        <Meter.Output />
        <Meter.Track>
          <Meter.Fill />
        </Meter.Track>
      </Meter>
      <Meter color="success" value={50}>
        <Label>{t("Success")}</Label>
        <Meter.Output />
        <Meter.Track>
          <Meter.Fill />
        </Meter.Track>
      </Meter>
      <Meter color="warning" value={50}>
        <Label>{t("Warning")}</Label>
        <Meter.Output />
        <Meter.Track>
          <Meter.Fill />
        </Meter.Track>
      </Meter>
      <Meter color="danger" value={50}>
        <Label>{t("Danger")}</Label>
        <Meter.Output />
        <Meter.Track>
          <Meter.Fill />
        </Meter.Track>
      </Meter>
    </div>
  );
}

export default Colors;
