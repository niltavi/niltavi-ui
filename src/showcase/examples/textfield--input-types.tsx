// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Input, Label, TextField} from "@heroui/react";

export function InputTypes() {
  const t = useCopy();
  return (
    <div className="flex w-full max-w-64 flex-col gap-4">
      <TextField name="password" type="password">
        <Label>{t("Password")}</Label>
        <Input placeholder={t("••••••••")} />
      </TextField>

      <TextField name="age" type="number">
        <Label>{t("Age")}</Label>
        <Input max="150" min="0" placeholder={t("21")} />
      </TextField>

      <TextField name="email" type="email">
        <Label>{t("Email")}</Label>
        <Input placeholder={t("user@example.com")} />
      </TextField>

      <TextField name="website" type="url">
        <Label>{t("Website")}</Label>
        <Input placeholder={t("https://example.com")} />
      </TextField>

      <TextField name="phone" type="tel">
        <Label>{t("Phone")}</Label>
        <Input placeholder={t("+1 (555) 000-0000")} />
      </TextField>
    </div>
  );
}

export default InputTypes;
