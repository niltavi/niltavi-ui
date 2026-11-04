// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Dropdown, Kbd, Label} from "@heroui/react";

export function WithKeyboardShortcuts() {
  const t = useCopy();
  return (
    <Dropdown>
      <Button aria-label={t("Menu")} variant="secondary">
        {t("Actions")}</Button>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
          <Dropdown.Item id="new" textValue={t("New")}>
            <Label>{t("New")}</Label>
            <Kbd className="ms-auto" slot="keyboard" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>{t("N")}</Kbd.Content>
            </Kbd>
          </Dropdown.Item>
          <Dropdown.Item id="open" textValue={t("Open")}>
            <Label>{t("Open")}</Label>
            <Kbd className="ms-auto" slot="keyboard" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>{t("O")}</Kbd.Content>
            </Kbd>
          </Dropdown.Item>
          <Dropdown.Item id="save" textValue={t("Save")}>
            <Label>{t("Save")}</Label>
            <Kbd className="ms-auto" slot="keyboard" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>{t("S")}</Kbd.Content>
            </Kbd>
          </Dropdown.Item>
          <Dropdown.Item id="delete" textValue={t("Delete")} variant="danger">
            <Label>{t("Delete")}</Label>
            <Kbd className="ms-auto" slot="keyboard" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Abbr keyValue="shift" />
              <Kbd.Content>{t("D")}</Kbd.Content>
            </Kbd>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default WithKeyboardShortcuts;
