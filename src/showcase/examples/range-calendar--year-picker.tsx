// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {RangeCalendar} from "@heroui/react";

export function YearPicker() {
  const t = useCopy();
  return (
    <RangeCalendar aria-label={t("Trip dates")}>
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
  );
}

export default YearPicker;
