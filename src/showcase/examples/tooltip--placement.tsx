// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Tooltip} from "@heroui/react";

export function TooltipPlacement() {
  const t = useCopy();
  return (
    <div className="grid grid-cols-3 gap-4">
      <div />
      <Tooltip delay={0}>
        <Button className="w-full" variant="tertiary">
          {t("Top")}</Button>
        <Tooltip.Content showArrow placement="top">
          <Tooltip.Arrow />
          <p>{t("Top placement")}</p>
        </Tooltip.Content>
      </Tooltip>
      <div />

      <Tooltip delay={0}>
        <Button className="w-full" variant="tertiary">
          {t("Left")}</Button>
        <Tooltip.Content showArrow placement="left">
          <Tooltip.Arrow />
          <p>{t("Left placement")}</p>
        </Tooltip.Content>
      </Tooltip>

      <div className="flex items-center justify-center">
        <span className="text-sm text-muted">{t("Hover buttons")}</span>
      </div>

      <Tooltip delay={0}>
        <Button className="w-full" variant="tertiary">
          {t("Right")}</Button>
        <Tooltip.Content showArrow placement="right">
          <Tooltip.Arrow />
          <p>{t("Right placement")}</p>
        </Tooltip.Content>
      </Tooltip>

      <div />
      <Tooltip delay={0}>
        <Button className="w-full" variant="tertiary">
          {t("Bottom")}</Button>
        <Tooltip.Content showArrow placement="bottom">
          <Tooltip.Arrow />
          <p>{t("Bottom placement")}</p>
        </Tooltip.Content>
      </Tooltip>
      <div />
    </div>
  );
}

export default TooltipPlacement;
