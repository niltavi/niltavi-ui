// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Bold, Italic, Strikethrough, Underline} from "@gravity-ui/icons";
import {ToggleButton, ToggleButtonGroup} from "@heroui/react";

export function Attached() {
  const t = useCopy();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted">{t("Attached (default)")}</span>
        <ToggleButtonGroup selectionMode="multiple">
          <ToggleButton isIconOnly aria-label={t("Bold")} id="bold">
            <Bold />
          </ToggleButton>
          <ToggleButton isIconOnly aria-label={t("Italic")} id="italic">
            <ToggleButtonGroup.Separator />
            <Italic />
          </ToggleButton>
          <ToggleButton isIconOnly aria-label={t("Underline")} id="underline">
            <ToggleButtonGroup.Separator />
            <Underline />
          </ToggleButton>
          <ToggleButton isIconOnly aria-label={t("Strikethrough")} id="strikethrough">
            <ToggleButtonGroup.Separator />
            <Strikethrough />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted">{t("Detached")}</span>
        <ToggleButtonGroup isDetached selectionMode="multiple">
          <ToggleButton isIconOnly aria-label={t("Bold")} id="bold">
            <Bold />
          </ToggleButton>
          <ToggleButton isIconOnly aria-label={t("Italic")} id="italic">
            <Italic />
          </ToggleButton>
          <ToggleButton isIconOnly aria-label={t("Underline")} id="underline">
            <Underline />
          </ToggleButton>
          <ToggleButton isIconOnly aria-label={t("Strikethrough")} id="strikethrough">
            <Strikethrough />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
}

export default Attached;
