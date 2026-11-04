// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Tooltip} from "@heroui/react";

export function TooltipWithArrow() {
  const t = useCopy();
  return (
    <div className="flex items-center gap-4">
      <Tooltip delay={0}>
        <Button variant="secondary">{t("With Arrow")}</Button>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          <p>{t("Tooltip with arrow indicator")}</p>
        </Tooltip.Content>
      </Tooltip>

      <Tooltip delay={0}>
        <Button variant="primary">{t("Custom Offset")}</Button>
        <Tooltip.Content showArrow offset={12}>
          <Tooltip.Arrow />
          <p>{t("Custom offset from trigger")}</p>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}

export default TooltipWithArrow;
