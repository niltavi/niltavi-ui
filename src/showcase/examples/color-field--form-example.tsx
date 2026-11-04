// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {Color} from "@heroui/react";

import {Button, ColorField, ColorSwatch, Description, Form, Label} from "@heroui/react";
import {useState} from "react";

export function FormExample() {
  const t = useCopy();
  const [value, setValue] = useState<Color | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Color submitted:", {color: value.toString("hex")});
      setValue(null);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Form className="flex w-full max-w-[280px] flex-col gap-4" onSubmit={handleSubmit}>
      <ColorField
        fullWidth
        isRequired
        className="w-full"
        name="brand-color"
        value={value}
        onChange={setValue}
      >
        <Label>{t("Brand Color")}</Label>
        <ColorField.Group>
          <ColorField.Prefix>
            <ColorSwatch color={value ?? undefined} size="xs" />
          </ColorField.Prefix>
          <ColorField.Input placeholder={t("#000000")} />
        </ColorField.Group>
        <Description>{t("Choose your brand's primary color")}</Description>
      </ColorField>
      <Button
        className="w-full"
        isDisabled={!value}
        isPending={isSubmitting}
        type="submit"
        variant="primary"
      >
        {t(isSubmitting ? "Saving..." : "Save Color")}
      </Button>
    </Form>
  );
}

export default FormExample;
