// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {
  Bold,
  Italic,
  Strikethrough,
  TextAlignCenter,
  TextAlignLeft,
  TextAlignRight,
  Underline,
} from "@gravity-ui/icons";
import {ToggleButton, ToggleButtonGroup} from "@heroui/react";

export function SelectionMode() {
  const t = useCopy();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted">{t("Single selection")}</span>
        <ToggleButtonGroup defaultSelectedKeys={["center"]} selectionMode="single">
          <ToggleButton id="left">
            <TextAlignLeft />
            {t("Left")}</ToggleButton>
          <ToggleButton id="center">
            <ToggleButtonGroup.Separator />
            <TextAlignCenter />
            {t("Center")}</ToggleButton>
          <ToggleButton id="right">
            <ToggleButtonGroup.Separator />
            <TextAlignRight />
            {t("Right")}</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted">{t("Multiple selection")}</span>
        <ToggleButtonGroup defaultSelectedKeys={["bold", "underline"]} selectionMode="multiple">
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
    </div>
  );
}

export default SelectionMode;
