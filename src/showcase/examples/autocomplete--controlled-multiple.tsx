// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {Key} from "@heroui/react";

import {Autocomplete, EmptyState, Label, ListBox, SearchField, useFilter} from "@heroui/react";
import {useState} from "react";

export function ControlledMultiple() {
  const t = useCopy();
  const [selected, setSelected] = useState<Key[]>(["california", "texas"]);
  const {contains} = useFilter({sensitivity: "base"});

  const items = [
    {id: "california", name: "California"},
    {id: "texas", name: "Texas"},
    {id: "florida", name: "Florida"},
    {id: "new-york", name: "New York"},
    {id: "illinois", name: "Illinois"},
    {id: "pennsylvania", name: "Pennsylvania"},
  ];

  return (
    <div className="space-y-2">
      <Autocomplete
        className="w-full max-w-[256px]"
        placeholder={t("Select states")}
        selectionMode="multiple"
        value={selected}
        onChange={(keys) => setSelected(keys as Key[])}
      >
        <Label>{t("States")}</Label>
        <Autocomplete.Trigger>
          <Autocomplete.Value />
          <Autocomplete.ClearButton />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover>
          <Autocomplete.Filter filter={contains}>
            <SearchField autoFocus aria-label={t("Search states")} name="search" variant="secondary">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder={t("Search states...")} />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <ListBox renderEmptyState={() => <EmptyState>{t("No results found")}</EmptyState>}>
              {items.map((item) => (
                <ListBox.Item key={item.id} id={item.id} textValue={t(item.name)}>
                  {t(item.name)}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
      </Autocomplete>
      <p className="text-sm text-muted">
        {t("Selected:")}{t(selected.length > 0 ? selected.map((key) => t(String(key).split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" "))).join(", ") : "None")}
      </p>
    </div>
  );
}

export default ControlledMultiple;
