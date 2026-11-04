// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {ChevronDown, CircleCheckFill, CircleFill, Clock, Xmark} from "@gravity-ui/icons";
import {Chip} from "@heroui/react";

export function ChipWithIcon() {
  const t = useCopy();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Chip>
        <CircleFill width={6} />
        <Chip.Label>{t("Information")}</Chip.Label>
      </Chip>
      <Chip color="success">
        <CircleCheckFill width={12} />
        <Chip.Label>{t("Completed")}</Chip.Label>
      </Chip>
      <Chip color="warning">
        <Clock width={12} />
        <Chip.Label>{t("Pending")}</Chip.Label>
      </Chip>
      <Chip color="danger">
        <Xmark width={12} />
        <Chip.Label>{t("Failed")}</Chip.Label>
      </Chip>
      <Chip color="accent">
        <Chip.Label>{t("Label")}</Chip.Label>
        <ChevronDown width={12} />
      </Chip>
    </div>
  );
}

export default ChipWithIcon;
