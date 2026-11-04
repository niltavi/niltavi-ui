// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Description, Label, SearchField} from "@heroui/react";
import React from "react";

export function Controlled() {
  const t = useCopy();
  const [value, setValue] = React.useState("");

  return (
    <div className="flex flex-col gap-4">
      <SearchField name="search" value={value} onChange={setValue}>
        <Label>{t("Search")}</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input className="w-[280px]" placeholder={t("Search...")} />
          <SearchField.ClearButton />
        </SearchField.Group>
        <Description>{t("Current value:")}{" "}{value || t("(empty)")}</Description>
      </SearchField>
      <div className="flex gap-2">
        <Button variant="tertiary" onPress={() => setValue("")}>
          {t("Clear")}</Button>
        <Button variant="tertiary" onPress={() => setValue(t("Morning birdsong"))}>
          {t("Set example")}</Button>
      </div>
    </div>
  );
}

export default Controlled;
