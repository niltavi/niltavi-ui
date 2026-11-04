// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {Key} from "@heroui/react";

import {Label, ListBox, Select} from "@heroui/react";
import React from "react";

export function ControlledMultiple() {
  const t = useCopy();
  const [selected, setSelected] = React.useState<Key[]>(["california", "texas"]);

  return (
    <div className="space-y-4">
      <Select
        className="w-full max-w-[256px]"
        placeholder={t("Select states")}
        selectionMode="multiple"
        value={selected}
        onChange={(keys) => setSelected(keys as Key[])}
      >
        <Label>{t("States (controlled multiple)")}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox selectionMode="multiple">
            <ListBox.Item id="california" textValue={t("California")}>
              {t("California")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="texas" textValue={t("Texas")}>
              {t("Texas")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="florida" textValue={t("Florida")}>
              {t("Florida")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="new-york" textValue={t("New York")}>
              {t("New York")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="illinois" textValue={t("Illinois")}>
              {t("Illinois")}<ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="pennsylvania" textValue={t("Pennsylvania")}>
              {t("Pennsylvania")}<ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
      <p className="text-sm text-muted">
        {t("Selected:")}{t(selected.length > 0 ? selected.map((key) => t(String(key).split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" "))).join(", ") : "None")}
      </p>
    </div>
  );
}

export default ControlledMultiple;
