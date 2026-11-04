// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {ChevronDown, ChevronUp, QrCode} from "@gravity-ui/icons";
import {
  Button,
  Disclosure,
  DisclosureGroup,
  Separator,
  useDisclosureGroupNavigation,
} from "@heroui/react";
import {DemoIcon as Icon} from "../DemoIcon";
import React from "react";
import {cn} from "@heroui/react";

export function Controlled() {
  const t = useCopy();
  const [expandedKeys, setExpandedKeys] = React.useState(new Set<string | number>(["preview"]));
  const itemIds = ["preview", "download"]; // Track our disclosure items

  const {isNextDisabled, isPrevDisabled, onNext, onPrevious} = useDisclosureGroupNavigation({
    expandedKeys,
    itemIds,
    onExpandedChange: setExpandedKeys,
  });

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-4 rounded-3xl p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t("HeroUI Native")}</h3>
          <div className="flex gap-2">
            <Button
              aria-label={t("Previous disclosure")}
              isDisabled={isPrevDisabled}
              size="sm"
              variant="secondary"
              onPress={onPrevious}
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button
              aria-label={t("Next disclosure")}
              isDisabled={isNextDisabled}
              size="sm"
              variant="secondary"
              onPress={onNext}
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>
        <DisclosureGroup expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
          <Disclosure aria-label={t("Preview HeroUI Native")} id="preview">
            <Disclosure.Heading>
              <Button
                slot="trigger"
                variant={expandedKeys.has("preview") ? "secondary" : "tertiary"}
                className={cn("w-full border-none", {
                  "bg-transparent": !expandedKeys.has("preview"),
                })}
              >
                <div className="flex w-full items-center justify-start gap-2">
                  <QrCode />
                  {t("Preview HeroUI Native")}</div>
                <Disclosure.Indicator className="text-muted" />
              </Button>
            </Disclosure.Heading>
            <Disclosure.Content>
              <Disclosure.Body className="mx-2 flex flex-col items-center gap-2 p-4 text-center">
                <p className="text-sm text-muted">
                  {t("Scan this QR code with your camera app to preview the HeroUI native components.")}</p>
                <img
                  alt={t("Expo Go QR Code")}
                  className="aspect-square w-full max-w-54 object-cover"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/qr-code-native.png"
                />
                <p className="text-sm text-muted">{t("Expo must be installed on your device.")}</p>
                <Button className="mt-4" variant="primary">
                  <Icon className="[&_path]:fill-accent-foreground" icon="logos:expo-icon" />
                  {t("Preview on Expo Go")}</Button>
              </Disclosure.Body>
            </Disclosure.Content>
          </Disclosure>
          <Separator className="my-2" />
          <Disclosure id="download">
            <Disclosure.Heading aria-label={t("Download HeroUI Native")}>
              <Button
                slot="trigger"
                variant={expandedKeys.has("download") ? "secondary" : "tertiary"}
                className={cn("w-full border-none", {
                  "bg-transparent": !expandedKeys.has("download"),
                })}
              >
                <div className="flex w-full items-center justify-start gap-2">
                  <Icon icon="tabler:brand-apple-filled" />
                  {t("Download HeroUI Native")}</div>
                <Disclosure.Indicator className="text-muted" />
              </Button>
            </Disclosure.Heading>
            <Disclosure.Content>
              <Disclosure.Body className="mx-2 flex flex-col items-center gap-2 p-4 text-center">
                <p className="text-sm text-muted">
                  {t("Scan this QR code with your camera app to preview the HeroUI native components.")}</p>
                <img
                  alt={t("Expo Go QR Code")}
                  className="aspect-square w-full max-w-54 object-cover"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/qr-code-native.png"
                />
                <p className="text-sm text-muted">{t("Expo must be installed on your device.")}</p>
                <Button className="mt-4" variant="primary">
                  <Icon icon="tabler:brand-apple-filled" />
                  {t("Download on App Store")}</Button>
              </Disclosure.Body>
            </Disclosure.Content>
          </Disclosure>
        </DisclosureGroup>
      </div>
    </div>
  );
}

export default Controlled;
