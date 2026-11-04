// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Dropdown, Label} from "@heroui/react";

export function WithSubmenus() {
  const t = useCopy();
  return (
    <Dropdown>
      <Button aria-label={t("Menu")} variant="secondary">
        {t("Share")}</Button>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
          <Dropdown.Item id="copy-link" textValue={t("Copy Link")}>
            <Label>{t("Copy Link")}</Label>
          </Dropdown.Item>
          <Dropdown.Item id="facebook" textValue={t("Facebook")}>
            <Label>{t("Facebook")}</Label>
          </Dropdown.Item>
          <Dropdown.Item id="twitter" textValue={t("Twitter")}>
            <Label>{t("X / Twitter")}</Label>
          </Dropdown.Item>
          <Dropdown.SubmenuTrigger>
            <Dropdown.Item id="share" textValue={t("Share")}>
              <Label>{t("Other")}</Label>
              <Dropdown.SubmenuIndicator />
            </Dropdown.Item>
            <Dropdown.Popover>
              <Dropdown.Menu>
                <Dropdown.Item id="whatsapp" textValue={t("WhatsApp")}>
                  <Label>{t("WhatsApp")}</Label>
                </Dropdown.Item>
                <Dropdown.Item id="telegram" textValue={t("Telegram")}>
                  <Label>{t("Telegram")}</Label>
                </Dropdown.Item>
                <Dropdown.Item id="discord" textValue={t("Discord")}>
                  <Label>{t("Discord")}</Label>
                </Dropdown.Item>
                <Dropdown.SubmenuTrigger>
                  <Dropdown.Item id="email" textValue={t("Email")}>
                    <Label>{t("Email")}</Label>
                    <Dropdown.SubmenuIndicator />
                  </Dropdown.Item>
                  <Dropdown.Popover>
                    <Dropdown.Menu>
                      <Dropdown.Item id="work" textValue={t("Work email")}>
                        <Label>{t("Work email")}</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="personal" textValue={t("Personal email")}>
                        <Label>{t("Personal email")}</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown.SubmenuTrigger>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.SubmenuTrigger>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default WithSubmenus;
