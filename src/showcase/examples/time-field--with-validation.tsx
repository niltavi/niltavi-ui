// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {Time} from "@internationalized/date";

import {Description, FieldError, Label, TimeField} from "@heroui/react";
import {parseTime} from "@internationalized/date";
import {useState} from "react";

export function WithValidation() {
  const t = useCopy();
  const [value, setValue] = useState<Time | null>(null);
  const minTime = parseTime("09:00");
  const maxTime = parseTime("17:00");
  const isInvalid = value !== null && (value.compare(minTime) < 0 || value.compare(maxTime) > 0);

  return (
    <div className="flex flex-col gap-4">
      <TimeField
        isRequired
        className="w-full max-w-[256px]"
        isInvalid={isInvalid}
        maxValue={maxTime}
        minValue={minTime}
        name="time"
        value={value}
        onChange={setValue}
      >
        <Label>{t("Time")}</Label>
        <TimeField.Group>
          <TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input>
        </TimeField.Group>
        {t(isInvalid ? (
          <FieldError>{t("Time must be between 9:00 AM and 5:00 PM")}</FieldError>
        ) : (
          <Description>{t("Enter a time between 9:00 AM and 5:00 PM")}</Description>
        ))}
      </TimeField>
    </div>
  );
}

export default WithValidation;
