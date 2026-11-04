// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Description, FieldError, Form, Label, Radio, RadioGroup} from "@heroui/react";
import React from "react";

export function Validation() {
  const t = useCopy();
  const [message, setMessage] = React.useState<string | null>(null);

  return (
    <Form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const value = formData.get("plan-validation");

        setMessage(t("Your chosen plan is: {value}", {value: t(String(value))}));
      }}
    >
      <RadioGroup isRequired name="plan-validation">
        <Label>{t("Subscription plan")}</Label>
        <Radio value="starter">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            {t("Starter")}</Radio.Content>
          <Description>{t("For side projects and small teams")}</Description>
        </Radio>
        <Radio value="pro">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            {t("Pro")}</Radio.Content>
          <Description>{t("Advanced reporting and analytics")}</Description>
        </Radio>
        <Radio value="teams">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            {t("Teams")}</Radio.Content>
          <Description>{t("Share access with up to 10 teammates")}</Description>
        </Radio>
        <FieldError>{t("Choose a subscription before continuing.")}</FieldError>
      </RadioGroup>
      <Button className="mt-2 w-fit" type="submit">
        {t("Submit")}</Button>
      {t(!!message && <p className="text-sm text-muted">{t(message)}</p>)}
    </Form>
  );
}

export default Validation;
