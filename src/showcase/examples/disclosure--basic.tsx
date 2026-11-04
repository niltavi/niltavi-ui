// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {QrCode} from "@gravity-ui/icons";
import {Button, Disclosure} from "@heroui/react";
import {DemoIcon as Icon} from "../DemoIcon";
import React from "react";

export function Basic() {
  const t = useCopy();
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="w-full max-w-md text-center">
      <Disclosure isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
        <Disclosure.Heading>
          <Button slot="trigger" variant="secondary">
            <QrCode />
            {t("Preview HeroUI Native")}<Disclosure.Indicator />
          </Button>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body className="shadow-surface flex flex-col items-center rounded-3xl bg-surface p-4 text-center">
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
    </div>
  );
}

export default Basic;
