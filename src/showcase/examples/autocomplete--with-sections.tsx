// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {Key} from "@heroui/react";

import {
  Autocomplete,
  EmptyState,
  Header,
  Label,
  ListBox,
  SearchField,
  Separator,
  useFilter,
} from "@heroui/react";
import {useState} from "react";

export function WithSections() {
  const t = useCopy();
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const {contains} = useFilter({sensitivity: "base"});

  return (
    <Autocomplete
      className="w-full max-w-[256px]"
      placeholder={t("Select a country")}
      selectionMode="single"
      value={selectedKey}
      onChange={setSelectedKey}
    >
      <Label>{t("Country")}</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={contains}>
          <SearchField autoFocus aria-label={t("Search countries")} name="search" variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder={t("Search countries...")} />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>{t("No results found")}</EmptyState>}>
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
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  );
}

export default WithSections;
