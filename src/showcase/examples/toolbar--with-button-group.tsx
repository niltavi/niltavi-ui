// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {
  ArrowUturnCcwLeft,
  ArrowUturnCwRight,
  Bold,
  Italic,
  TextAlignCenter,
  TextAlignLeft,
  TextAlignRight,
  Underline,
} from "@gravity-ui/icons";
import {
  Button,
  ButtonGroup,
  Separator,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from "@heroui/react";

export function WithButtonGroup() {
  const t = useCopy();
  return (
    <Toolbar aria-label={t("Editor toolbar")}>
      <ButtonGroup variant="tertiary">
        <Button>
          <ArrowUturnCcwLeft />
          {t("Undo")}</Button>
        <Button>
          <ButtonGroup.Separator />
          <ArrowUturnCwRight />
          {t("Redo")}</Button>
      </ButtonGroup>
      <Separator />
      <ToggleButtonGroup aria-label={t("Text style")} selectionMode="multiple">
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
      </ToggleButtonGroup>
      <Separator />
      <ButtonGroup variant="tertiary">
        <Button isIconOnly aria-label={t("Align left")}>
          <TextAlignLeft />
        </Button>
        <Button isIconOnly aria-label={t("Align center")}>
          <ButtonGroup.Separator />
          <TextAlignCenter />
        </Button>
        <Button isIconOnly aria-label={t("Align right")}>
          <ButtonGroup.Separator />
          <TextAlignRight />
        </Button>
      </ButtonGroup>
    </Toolbar>
  );
}

export default WithButtonGroup;
