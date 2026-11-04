// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Bookmark, Heart} from "@gravity-ui/icons";
import {ToggleButton} from "@heroui/react";

export function IconOnly() {
  const t = useCopy();
  return (
    <div className="flex items-center gap-3">
      <ToggleButton isIconOnly aria-label={t("Like")}>
        <Heart />
      </ToggleButton>
      <ToggleButton isIconOnly aria-label={t("Bookmark")} variant="ghost">
        <Bookmark />
      </ToggleButton>
    </div>
  );
}

export default IconOnly;
