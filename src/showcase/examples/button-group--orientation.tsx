// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight} from "@gravity-ui/icons";
import {Button, ButtonGroup} from "@heroui/react";

export function Orientation() {
  const t = useCopy();
  return (
    <div className="flex items-start gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted">{t("Horizontal")}</span>
        <ButtonGroup orientation="horizontal" variant="tertiary">
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
          <Button isIconOnly aria-label={t("Justify")}>
            <ButtonGroup.Separator />
            <TextAlignJustify />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted">{t("Vertical")}</span>
        <ButtonGroup orientation="vertical" variant="tertiary">
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
          <Button isIconOnly aria-label={t("Justify")}>
            <ButtonGroup.Separator />
            <TextAlignJustify />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default Orientation;
