// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Ellipsis} from "@gravity-ui/icons";
import {Button, Popover} from "@heroui/react";

export function PopoverWithArrow() {
  const t = useCopy();
  return (
    <div className="flex items-center gap-4">
      <Popover>
        <Button variant="secondary">{t("With Arrow")}</Button>
        <Popover.Content className="max-w-64">
          <Popover.Dialog>
            <Popover.Arrow />
            <Popover.Heading>{t("Popover with Arrow")}</Popover.Heading>
            <p className="mt-2 text-sm text-muted">
              {t("The arrow shows which element triggered the popover.")}</p>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>

      <Popover>
        <Button isIconOnly aria-label={t("More options")} variant="tertiary">
          <Ellipsis />
        </Button>
        <Popover.Content className="max-w-64" offset={10}>
          <Popover.Dialog>
            <Popover.Arrow />
            <Popover.Heading>{t("Popover with Arrow")}</Popover.Heading>
            <p className="mt-2 text-sm text-muted">
              {t("The arrow shows which element triggered the popover.")}</p>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}

export default PopoverWithArrow;
