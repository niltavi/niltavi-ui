// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Card, CloseButton} from "@heroui/react";

export function Horizontal() {
  const t = useCopy();
  return (
    <Card className="w-full items-stretch md:flex-row">
      <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
        <img
          alt={t("Cherries")}
          className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
          loading="lazy"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <Card.Header className="gap-1">
          <Card.Title className="pe-8">{t("Become an ACME Creator!")}</Card.Title>
          <Card.Description>
            {t("Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam dolor sed amet faucibus etiam.")}</Card.Description>
          <CloseButton aria-label={t("Close banner")} className="absolute end-3 top-3" />
        </Card.Header>
        <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{t("Only 10 spots")}</span>
            <span className="text-xs text-muted">{t("Submission ends Oct 10.")}</span>
          </div>
          <Button className="w-full sm:w-auto">{t("Apply Now")}</Button>
        </Card.Footer>
      </div>
    </Card>
  );
}

export default Horizontal;
