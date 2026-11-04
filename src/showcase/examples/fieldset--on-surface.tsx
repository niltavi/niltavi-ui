// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {toast} from "@heroui/react";
import {FloppyDisk} from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Surface,
  TextArea,
  TextField,
} from "@heroui/react";
import React from "react";

export function OnSurface() {
  const t = useCopy();
  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    toast.success(t("Form submitted successfully!"));
  };

  return (
    <div className="w-full">
      <Surface className="w-full min-w-0">
        <Form onSubmit={onSubmit}>
          <Fieldset className="w-full">
            <Fieldset.Legend>{t("Profile Settings")}</Fieldset.Legend>
            <Description>{t("Update your profile information.")}</Description>
            <Fieldset.Group>
              <TextField
                isRequired
                name="name"
                validate={(value) => {
                  if (value.length < 3) {
                    return t("Name must be at least 3 characters");
                  }

                  return null;
                }}
              >
                <Label>{t("Name")}</Label>
                <Input placeholder={t("John Doe")} variant="secondary" />
                <FieldError />
              </TextField>
              <TextField isRequired name="email" type="email">
                <Label>{t("Email")}</Label>
                <Input placeholder={t("john@example.com")} variant="secondary" />
                <FieldError />
              </TextField>
              <TextField
                isRequired
                name="bio"
                validate={(value) => {
                  if (value.length < 10) {
                    return t("Bio must be at least 10 characters");
                  }

                  return null;
                }}
              >
                <Label>{t("Bio")}</Label>
                <TextArea placeholder={t("Tell us about yourself...")} variant="secondary" />
                <Description>{t("Minimum 10 characters")}</Description>
                <FieldError />
              </TextField>
            </Fieldset.Group>
            <Fieldset.Actions>
              <Button type="submit">
                <FloppyDisk />
                {t("Save changes")}</Button>
              <Button type="reset" variant="tertiary">
                {t("Cancel")}</Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </Surface>
    </div>
  );
}

export default OnSurface;
