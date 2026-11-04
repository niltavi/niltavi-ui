// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Globe, Plus, TrashBin} from "@gravity-ui/icons";
import {Button, ButtonGroup} from "@heroui/react";

export function WithIcons() {
  const t = useCopy();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-muted">{t("With icons")}</p>
        <ButtonGroup variant="secondary">
          <Button>
            <Globe />
            {t("Search")}</Button>
          <Button>
            <ButtonGroup.Separator />
            <Plus />
            {t("Add")}</Button>
          <Button>
            <ButtonGroup.Separator />
            <TrashBin />
            {t("Delete")}</Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-muted">{t("Icon only buttons")}</p>
        <ButtonGroup variant="tertiary">
          <Button isIconOnly aria-label={t("Search")}>
            <Globe />
          </Button>
          <Button isIconOnly aria-label={t("Add")}>
            <ButtonGroup.Separator />
            <Plus />
          </Button>
          <Button isIconOnly aria-label={t("Delete")}>
            <ButtonGroup.Separator />
            <TrashBin />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default WithIcons;
