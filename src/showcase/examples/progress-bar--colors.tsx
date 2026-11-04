// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Label, ProgressBar} from "@heroui/react";

export function Colors() {
  const t = useCopy();
  return (
    <div className="flex w-full max-w-64 flex-col gap-6">
      <ProgressBar aria-label={t("Default")} color="default" value={50}>
        <Label>{t("Default")}</Label>
        <ProgressBar.Output />
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
      <ProgressBar aria-label={t("Accent")} color="accent" value={50}>
        <Label>{t("Accent")}</Label>
        <ProgressBar.Output />
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
      <ProgressBar aria-label={t("Success")} color="success" value={50}>
        <Label>{t("Success")}</Label>
        <ProgressBar.Output />
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
      <ProgressBar aria-label={t("Warning")} color="warning" value={50}>
        <Label>{t("Warning")}</Label>
        <ProgressBar.Output />
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
      <ProgressBar aria-label={t("Danger")} color="danger" value={50}>
        <Label>{t("Danger")}</Label>
        <ProgressBar.Output />
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
    </div>
  );
}

export default Colors;
