// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {ChevronDown, Clock} from "@gravity-ui/icons";
import {Description, Label, TimeField} from "@heroui/react";

export function WithPrefixAndSuffix() {
  const t = useCopy();
  return (
    <TimeField className="w-full max-w-[256px]" name="time">
      <Label>{t("Time")}</Label>
      <TimeField.Group>
        <TimeField.Prefix>
          <Clock className="size-4 text-muted" />
        </TimeField.Prefix>
        <TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input>
        <TimeField.Suffix>
          <ChevronDown className="size-4 text-muted" />
        </TimeField.Suffix>
      </TimeField.Group>
      <Description>{t("Enter a time")}</Description>
    </TimeField>
  );
}

export default WithPrefixAndSuffix;
