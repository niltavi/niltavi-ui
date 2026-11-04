// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Description, Label, NumberField} from "@heroui/react";

export function WithFormatOptions() {
  const t = useCopy();
  return (
    <div className="flex w-full max-w-64 flex-col gap-4">
      <NumberField
        defaultValue={99}
        minValue={0}
        name="currency-eur"
        formatOptions={{
          currency: "EUR",
          currencySign: "accounting",
          style: "currency",
        }}
      >
        <Label>{t("Currency (EUR - Accounting)")}</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input className="w-[120px]" />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <Description>{t("Accounting format with EUR currency")}</Description>
      </NumberField>
      <NumberField
        defaultValue={99.99}
        minValue={0}
        name="currency-usd"
        formatOptions={{
          currency: "USD",
          style: "currency",
        }}
      >
        <Label>{t("Currency (USD)")}</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input className="w-[120px]" />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <Description>{t("Standard USD currency format")}</Description>
      </NumberField>
      <NumberField
        defaultValue={0.5}
        formatOptions={{style: "percent"}}
        maxValue={1}
        minValue={0}
        name="percentage"
        step={0.01}
      >
        <Label>{t("Percentage")}</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input className="w-[120px]" />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <Description>{t("Percentage format (0-1, where 0.5 = 50%)")}</Description>
      </NumberField>
      <NumberField
        defaultValue={1234.56}
        minValue={0}
        name="decimal"
        formatOptions={{
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
          style: "decimal",
        }}
      >
        <Label>{t("Decimal (2 decimal places)")}</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input className="w-[120px]" />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <Description>{t("Decimal format with 2 decimal places")}</Description>
      </NumberField>
      <NumberField
        defaultValue={1000}
        minValue={0}
        name="unit"
        formatOptions={{
          style: "unit",
          unit: "kilogram",
          unitDisplay: "short",
        }}
      >
        <Label>{t("Unit (Kilograms)")}</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input className="w-[120px]" />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <Description>{t("Unit format with kilograms")}</Description>
      </NumberField>
    </div>
  );
}

export default WithFormatOptions;
