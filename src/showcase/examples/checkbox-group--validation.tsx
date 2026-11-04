// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {toast} from "@heroui/react";
import {Button, Checkbox, CheckboxGroup, FieldError, Form, Label} from "@heroui/react";

export function Validation() {
  const t = useCopy();
  return (
    <Form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const values = formData.getAll("preferences");

        toast.success(t("Selected preferences: {values}", {values: values.map(String).join(", ")}));
      }}
    >
      <CheckboxGroup isRequired name="preferences">
        <Label>{t("Preferences")}</Label>
        <Checkbox value="email">
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            {t("Email notifications")}</Checkbox.Content>
        </Checkbox>
        <Checkbox value="sms">
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            {t("SMS notifications")}</Checkbox.Content>
        </Checkbox>
        <Checkbox value="push">
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            {t("Push notifications")}</Checkbox.Content>
        </Checkbox>
        <FieldError>{t("Please select at least one notification method.")}</FieldError>
      </CheckboxGroup>
      <Button type="submit">{t("Submit")}</Button>
    </Form>
  );
}

export default Validation;
