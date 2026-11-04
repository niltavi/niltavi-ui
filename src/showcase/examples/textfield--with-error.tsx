// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {FieldError, Input, Label, TextField} from "@heroui/react";

export function WithError() {
  const t = useCopy();
  return (
    <TextField isInvalid className="w-full max-w-64" name="email" type="email">
      <Label>{t("Email")}</Label>
      <Input placeholder={t("user@example.com")} />
      <FieldError>{t("Please enter a valid email address")}</FieldError>
    </TextField>
  );
}

export default WithError;
