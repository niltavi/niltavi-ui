// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Form, InputOTP, Label, Spinner} from "@heroui/react";
import React from "react";

export function OnComplete() {
  const t = useCopy();
  const [value, setValue] = React.useState("");
  const [isComplete, setIsComplete] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleComplete = (code: string) => {
    setIsComplete(true);

    console.log("Code complete:", code);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setValue("");
      setIsComplete(false);
    }, 2000);
  };

  return (
    <Form className="flex w-full max-w-[280px] flex-col gap-2" onSubmit={handleSubmit}>
      <Label>{t("Verify account")}</Label>
      <InputOTP
        maxLength={6}
        value={value}
        onComplete={handleComplete}
        onChange={(val) => {
          setValue(val);
          setIsComplete(false);
        }}
      >
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>
      <Button
        className="mt-2 w-full"
        isDisabled={!isComplete}
        isPending={isSubmitting}
        type="submit"
        variant="primary"
      >
        {t(isSubmitting ? (
          <>
            <Spinner color="current" size="sm" />
            {t("Verifying...")}</>
        ) : (
          "Verify Code"
        ))}
      </Button>
    </Form>
  );
}

export default OnComplete;
