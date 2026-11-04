// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Spinner} from "@heroui/react";

export function SpinnerColors() {
  const t = useCopy();
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner color="current" />
        <span className="text-xs text-muted">{t("Current")}</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="accent" />
        <span className="text-xs text-muted">{t("Accent")}</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="success" />
        <span className="text-xs text-muted">{t("Success")}</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="warning" />
        <span className="text-xs text-muted">{t("Warning")}</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="danger" />
        <span className="text-xs text-muted">{t("Danger")}</span>
      </div>
    </div>
  );
}

export default SpinnerColors;
