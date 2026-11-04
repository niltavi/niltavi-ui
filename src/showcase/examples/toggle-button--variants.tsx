// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {Heart} from "@gravity-ui/icons";
import {ToggleButton} from "@heroui/react";

export function Variants() {
  return (
    <div className="flex items-center gap-3">
      <ToggleButton>
        <Heart />
        Default
      </ToggleButton>
      <ToggleButton variant="ghost">
        <Heart />
        Ghost
      </ToggleButton>
    </div>
  );
}

export default Variants;
