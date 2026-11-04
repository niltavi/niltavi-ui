// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {FieldError, Label, NumberField} from "@heroui/react";

export function Validation() {
  const t = useCopy();
  return (
    <div className="flex w-full max-w-64 flex-col gap-4">
      <NumberField isInvalid isRequired minValue={0} name="quantity" value={-5}>
        <Label>{t("Quantity")}</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input className="w-[120px]" />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <FieldError>{t("Quantity must be greater than or equal to 0")}</FieldError>
      </NumberField>
      <NumberField
        isInvalid
        formatOptions={{style: "percent"}}
        maxValue={1}
        minValue={0}
        name="percentage"
        step={0.1}
        value={1.5}
      >
        <Label>{t("Percentage")}</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input className="w-[120px]" />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <FieldError>{t("Percentage must be between 0 and 100")}</FieldError>
      </NumberField>
    </div>
  );
}

export default Validation;
