// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Ban, Check, CircleFill, CircleInfo, TriangleExclamation} from "@gravity-ui/icons";
import {Chip} from "@heroui/react";

export function ChipStatuses() {
  const t = useCopy();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Chip variant="primary">
          <CircleFill width={6} />
          <Chip.Label>{t("Default")}</Chip.Label>
        </Chip>
        <Chip color="success" variant="primary">
          <CircleFill width={6} />
          <Chip.Label>{t("Active")}</Chip.Label>
        </Chip>
        <Chip color="warning" variant="primary">
          <CircleFill width={6} />
          <Chip.Label>{t("Pending")}</Chip.Label>
        </Chip>
        <Chip color="danger" variant="primary">
          <CircleFill width={6} />
          <Chip.Label>{t("Inactive")}</Chip.Label>
        </Chip>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Chip>
          <CircleInfo width={12} />
          <Chip.Label>{t("New Feature")}</Chip.Label>
        </Chip>
        <Chip color="success">
          <Check width={12} />
          <Chip.Label>{t("Available")}</Chip.Label>
        </Chip>
        <Chip color="warning">
          <TriangleExclamation width={12} />
          <Chip.Label>{t("Beta")}</Chip.Label>
        </Chip>
        <Chip color="danger">
          <Ban width={12} />
          <Chip.Label>{t("Deprecated")}</Chip.Label>
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip className="chip--rufous" variant="soft">{t("新物种 +2")}</Chip>
        <Chip className="chip--info" variant="soft">{t("迁徙季")}</Chip>
      </div>
    </div>
  );
}

export default ChipStatuses;
