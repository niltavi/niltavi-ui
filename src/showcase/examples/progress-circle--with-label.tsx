// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Label, ProgressCircle} from "@heroui/react";

export function WithLabel() {
  const t = useCopy();
  return (
    <div className="flex items-center gap-3">
      <ProgressCircle aria-label={t("Loading")} value={75}>
        <ProgressCircle.Track>
          <ProgressCircle.TrackCircle />
          <ProgressCircle.FillCircle />
        </ProgressCircle.Track>
      </ProgressCircle>
      <Label>{t("75% Complete")}</Label>
    </div>
  );
}

export default WithLabel;
