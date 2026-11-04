// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Label, ProgressBar} from "@heroui/react";

export function Indeterminate() {
  const t = useCopy();
  return (
    <ProgressBar isIndeterminate aria-label={t("Loading")} className="w-full max-w-64">
      <Label>{t("Loading...")}</Label>
      <ProgressBar.Track>
        <ProgressBar.Fill />
      </ProgressBar.Track>
    </ProgressBar>
  );
}

export default Indeterminate;
