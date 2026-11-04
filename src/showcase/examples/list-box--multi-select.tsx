// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Avatar, Description, Label, ListBox, Surface} from "@heroui/react";

export function MultiSelect() {
  const t = useCopy();
  return (
    <Surface className="w-full max-w-[256px] rounded-3xl shadow-surface">
      <ListBox aria-label={t("Users")} selectionMode="multiple">
        <ListBox.Item id="1" textValue={t("Bob")}>
          <Avatar size="sm">
            <Avatar.Image
              alt={t("Bob")}
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
            />
            <Avatar.Fallback>{t("B")}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col">
            <Label>{t("Bob")}</Label>
            <Description>{t("bob@heroui.com")}</Description>
          </div>
          <ListBox.ItemIndicator />
        </ListBox.Item>
        <ListBox.Item id="2" textValue={t("Fred")}>
          <Avatar size="sm">
            <Avatar.Image
              alt={t("Fred")}
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"
            />
            <Avatar.Fallback>{t("F")}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col">
            <Label>{t("Fred")}</Label>
            <Description>{t("fred@heroui.com")}</Description>
          </div>
          <ListBox.ItemIndicator />
        </ListBox.Item>
        <ListBox.Item id="3" textValue={t("Martha")}>
          <Avatar size="sm">
            <Avatar.Image
              alt={t("Martha")}
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
            />
            <Avatar.Fallback>{t("M")}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col">
            <Label>{t("Martha")}</Label>
            <Description>{t("martha@heroui.com")}</Description>
          </div>
          <ListBox.ItemIndicator />
        </ListBox.Item>
      </ListBox>
    </Surface>
  );
}

export default MultiSelect;
