// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Checkbox, Description} from "@heroui/react";
import {useState} from "react";

export function Indeterminate() {
  const t = useCopy();
  const [isIndeterminate, setIsIndeterminate] = useState(true);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Checkbox
      id="select-all"
      isIndeterminate={isIndeterminate}
      isSelected={isSelected}
      onChange={(selected: boolean) => {
        setIsSelected(selected);
        setIsIndeterminate(false);
      }}
    >
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        {t("Select all")}</Checkbox.Content>
      <Description>{t("Shows indeterminate state (dash icon)")}</Description>
    </Checkbox>
  );
}

export default Indeterminate;
