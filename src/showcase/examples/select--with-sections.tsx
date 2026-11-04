// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Header, Label, ListBox, Select, Separator} from "@heroui/react";

export function WithSections() {
  const t = useCopy();
  return (
    <Select className="w-full max-w-[256px]" placeholder={t("Select a country")}>
      <Label>{t("Country")}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Section>
            <Header>{t("North America")}</Header>
            <ListBox.Item id="usa" textValue={t("United States")}>
              {t("United States")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="canada" textValue={t("Canada")}>
              {t("Canada")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="mexico" textValue={t("Mexico")}>
              {t("Mexico")}<ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox.Section>
          <Separator />
          <ListBox.Section>
            <Header>{t("Europe")}</Header>
            <ListBox.Item id="uk" textValue={t("United Kingdom")}>
              {t("United Kingdom")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="france" textValue={t("France")}>
              {t("France")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="germany" textValue={t("Germany")}>
              {t("Germany")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="spain" textValue={t("Spain")}>
              {t("Spain")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="italy" textValue={t("Italy")}>
              {t("Italy")}<ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox.Section>
          <Separator />
          <ListBox.Section>
            <Header>{t("Asia")}</Header>
            <ListBox.Item id="japan" textValue={t("Japan")}>
              {t("Japan")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="china" textValue={t("China")}>
              {t("China")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="india" textValue={t("India")}>
              {t("India")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="south-korea" textValue={t("South Korea")}>
              {t("South Korea")}<ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox.Section>
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

export default WithSections;
