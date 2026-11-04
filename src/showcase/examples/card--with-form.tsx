// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {toast} from "@heroui/react";
import {Button, Card, Form, Input, Label, Link, TextField} from "@heroui/react";

export function WithForm() {
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
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title>{t("Login")}</Card.Title>
        <Card.Description>{t("Enter your credentials to access your account")}</Card.Description>
      </Card.Header>
      <Form onSubmit={onSubmit}>
        <Card.Content>
          <div className="flex flex-col gap-4">
            <TextField name="email" type="email">
              <Label>{t("Email")}</Label>
              <Input placeholder={t("email@example.com")} variant="secondary" />
            </TextField>
            <TextField name="password" type="password">
              <Label>{t("Password")}</Label>
              <Input placeholder={t("••••••••")} variant="secondary" />
            </TextField>
          </div>
        </Card.Content>
        <Card.Footer className="mt-4 flex flex-col gap-2">
          <Button className="w-full" type="submit">
            {t("Sign In")}</Button>
          <Link className="text-center text-sm" href="#" onClick={(event) => event.preventDefault()}>
            {t("Forgot password?")}</Link>
        </Card.Footer>
      </Form>
    </Card>
  );
}

export default WithForm;
