// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Heart} from "@gravity-ui/icons";
import {ToggleButton} from "@heroui/react";

export function Variants() {
  const t = useCopy();
  return (
    <div className="flex items-center gap-3">
      <ToggleButton>
        <Heart />
        {t("Default")}</ToggleButton>
      <ToggleButton variant="ghost">
        <Heart />
        {t("Ghost")}</ToggleButton>
    </div>
  );
}

export default Variants;
