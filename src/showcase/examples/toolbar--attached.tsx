// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Bold, Copy, Italic, Scissors, Underline} from "@gravity-ui/icons";
import {
  Button,
  ButtonGroup,
  Separator,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from "@heroui/react";

export function Attached() {
  const t = useCopy();
  return (
    <Toolbar isAttached aria-label={t("Text formatting")}>
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
        <Button isIconOnly aria-label={t("Copy")}>
          <Copy />
        </Button>
        <Button isIconOnly aria-label={t("Cut")}>
          <ButtonGroup.Separator />
          <Scissors />
        </Button>
      </ButtonGroup>
    </Toolbar>
  );
}

export default Attached;
