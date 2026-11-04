// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {DateValue} from "@internationalized/date";

import {DateField, DateRangePicker, FieldError, Label, RangeCalendar} from "@heroui/react";
import {getLocalTimeZone, today} from "@internationalized/date";
import {useState} from "react";

type DateRange = {
  start: DateValue;
  end: DateValue;
};

export function WithValidation() {
  const t = useCopy();
  const [value, setValue] = useState<DateRange | null>(null);
  const currentDate = today(getLocalTimeZone());
  const isInvalid =
    value != null && (value.start.compare(currentDate) < 0 || value.end.compare(value.start) < 0);

  return (
    <DateRangePicker
      isRequired
      className="w-full max-w-80"
      endName="endDate"
      isInvalid={isInvalid}
      minValue={currentDate}
      startName="startDate"
      value={value}
      onChange={setValue}
    >
      <Label>{t("Booking period")}</Label>
      <DateField.Group fullWidth>
        <DateField.Input slot="start">
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateRangePicker.RangeSeparator />
        <DateField.Input slot="end">
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DateRangePicker.Trigger>
            <DateRangePicker.TriggerIndicator />
          </DateRangePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <FieldError>{t("Select a valid range starting today or later.")}</FieldError>
      <DateRangePicker.Popover>
        <RangeCalendar aria-label={t("Booking period")}>
          <RangeCalendar.Header>
            <RangeCalendar.YearPickerTrigger>
              <RangeCalendar.YearPickerTriggerHeading />
              <RangeCalendar.YearPickerTriggerIndicator />
            </RangeCalendar.YearPickerTrigger>
            <RangeCalendar.NavButton slot="previous" />
            <RangeCalendar.NavButton slot="next" />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {(day) => <RangeCalendar.HeaderCell>{t(day)}</RangeCalendar.HeaderCell>}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {(date) => <RangeCalendar.Cell date={date} />}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
          <RangeCalendar.YearPickerGrid>
            <RangeCalendar.YearPickerGridBody>
              {({year}) => <RangeCalendar.YearPickerCell year={year} />}
            </RangeCalendar.YearPickerGridBody>
          </RangeCalendar.YearPickerGrid>
        </RangeCalendar>
      </DateRangePicker.Popover>
    </DateRangePicker>
  );
}

export default WithValidation;
