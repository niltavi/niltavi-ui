// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Surface} from "@heroui/react";

export function Variants() {
  const t = useCopy();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">{t("Default")}</p>
        <Surface className="flex w-full min-w-0 flex-col gap-3 rounded-3xl p-6" variant="default">
          <h3 className="text-base font-semibold text-foreground">{t("Surface Content")}</h3>
          <p className="text-sm text-muted">
            {t("This is a default surface variant. It uses bg-surface styling.")}</p>
        </Surface>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">{t("Secondary")}</p>
        <Surface className="flex w-full min-w-0 flex-col gap-3 rounded-3xl p-6" variant="secondary">
          <h3 className="text-base font-semibold text-foreground">{t("Surface Content")}</h3>
          <p className="text-sm text-muted">
            {t("This is a secondary surface variant. It uses bg-surface-secondary styling.")}</p>
        </Surface>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">{t("Tertiary")}</p>
        <Surface className="flex w-full min-w-0 flex-col gap-3 rounded-3xl p-6" variant="tertiary">
          <h3 className="text-base font-semibold text-foreground">{t("Surface Content")}</h3>
          <p className="text-sm text-muted">
            {t("This is a tertiary surface variant. It uses bg-surface-tertiary styling.")}</p>
        </Surface>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">{t("Transparent")}</p>
        <Surface
          className="flex w-full min-w-0 flex-col gap-3 rounded-3xl border p-6"
          variant="transparent"
        >
          <h3 className="text-base font-semibold text-foreground">{t("Surface Content")}</h3>
          <p className="text-sm text-muted">
            {t("This is a transparent surface variant. It has no background, suitable for overlays and cards with custom backgrounds.")}</p>
        </Surface>
      </div>
    </div>
  );
}

export default Variants;
