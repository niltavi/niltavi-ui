// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {toast} from "@heroui/react";
import {Check} from "@gravity-ui/icons";
import {Button, Description, FieldError, Form, Input, Label, TextField} from "@heroui/react";

export function Basic() {
  const t = useCopy();
  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    toast.success(t("Form submitted with: {data}", {data: JSON.stringify(data, null, 2)}));
  };

  return (
    <Form className="flex w-full max-w-96 flex-col gap-4" onSubmit={onSubmit}>
      <TextField
        isRequired
        name="email"
        type="email"
        validate={(value) => {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return t("Please enter a valid email address");
          }

          return null;
        }}
      >
        <Label>{t("Email")}</Label>
        <Input placeholder={t("john@example.com")} />
        <FieldError />
      </TextField>

      <TextField
        isRequired
        minLength={8}
        name="password"
        type="password"
        validate={(value) => {
          if (value.length < 8) {
            return t("Password must be at least 8 characters");
          }
          if (!/[A-Z]/.test(value)) {
            return t("Password must contain at least one uppercase letter");
          }
          if (!/[0-9]/.test(value)) {
            return t("Password must contain at least one number");
          }

          return null;
        }}
      >
        <Label>{t("Password")}</Label>
        <Input placeholder={t("Enter your password")} />
        <Description>{t("Must be at least 8 characters with 1 uppercase and 1 number")}</Description>
        <FieldError />
      </TextField>

      <div className="flex gap-2">
        <Button type="submit">
          <Check />
          {t("Submit")}</Button>
        <Button type="reset" variant="secondary">
          {t("Reset")}</Button>
      </div>
    </Form>
  );
}

export default Basic;
