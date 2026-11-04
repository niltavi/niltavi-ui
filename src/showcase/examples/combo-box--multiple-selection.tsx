// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {ComboBox, Input, Label, ListBox} from "@heroui/react";

export function MultipleSelection() {
  const t = useCopy();
  return (
    <ComboBox className="w-full max-w-[256px]" selectionMode="multiple">
      <Label>{t("Favorite Animals")}</Label>
      <ComboBox.InputGroup>
        <Input placeholder={t("Search animals...")} />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Value placeholder={t("No animals selected")} />
      <ComboBox.Popover>
        <ListBox selectionMode="multiple">
          <ListBox.Item id="aardvark" textValue={t("Aardvark")}>
            {t("Aardvark")}<ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="cat" textValue={t("Cat")}>
            {t("Cat")}<ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="dog" textValue={t("Dog")}>
            {t("Dog")}<ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="kangaroo" textValue={t("Kangaroo")}>
            {t("Kangaroo")}<ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="panda" textValue={t("Panda")}>
            {t("Panda")}<ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="snake" textValue={t("Snake")}>
            {t("Snake")}<ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}

export default MultipleSelection;
