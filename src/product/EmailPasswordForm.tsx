import {Button, FieldError, Form, Input, Label, Link, TextField} from "@heroui/react";
import {useRef, useState, useSyncExternalStore, type ComponentProps, type FormEvent, type ReactNode} from "react";

type Credentials = {email: string; password: string};
type FormErrors = Partial<Record<keyof Credentials, string>> & {message?: string};
const subscribeToHydration = () => () => {};
const hydrated = () => true;
const serverRendered = () => false;

function clearFieldError(errors: FormErrors, field: keyof Credentials): FormErrors {
  const next = {...errors};
  delete next[field];
  return next;
}

type EmailPasswordFormProps = {
  mode: "sign-in" | "register";
  labels: {title: string; email: string; password: string; retry: string};
  alternate: {href: string; label: string; onClick?: ComponentProps<typeof Link>["onClick"]};
  onSubmit: (credentials: Credentials) => Promise<FormErrors | void>;
  children?: ReactNode;
};

export function EmailPasswordForm({mode, labels, alternate, onSubmit, children}: EmailPasswordFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [pending, setPending] = useState(false);
  const ready = useSyncExternalStore(subscribeToHydration, hydrated, serverRendered);
  const submitting = useRef(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ready || submitting.current) return;
    const data = new FormData(event.currentTarget);
    submitting.current = true;
    setErrors({});
    setPending(true);
    try {
      const outcome = await onSubmit({email: String(data.get("email") ?? "").trim(), password: String(data.get("password") ?? "")});
      if (outcome) setErrors(outcome);
    } catch {
      setErrors({message: labels.retry});
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };

  return <section className="niltavi-email-password">
    <h2>{labels.title}</h2>
    {children}
    <Form className="niltavi-email-password__form" method="post" onSubmit={submit} validationBehavior="native" validationErrors={errors}>
      <fieldset className="niltavi-email-password__fields" disabled={!ready}>
        <TextField name="email" type="email" autoComplete="email" isRequired onChange={() => setErrors((previous) => clearFieldError(previous, "email"))}>
          <Label>{labels.email}</Label>
          <Input />
          <FieldError />
        </TextField>
        <TextField name="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} isRequired onChange={() => setErrors((previous) => clearFieldError(previous, "password"))}>
          <Label>{labels.password}</Label>
          <Input />
          <FieldError />
        </TextField>
        <Button type="submit" isPending={pending}>{labels.title}</Button>
      </fieldset>
      {errors.message && <p role="alert">{errors.message}</p>}
    </Form>
    <Link href={alternate.href} {...(alternate.onClick ? {onClick: alternate.onClick} : {})}>{alternate.label}</Link>
  </section>;
}
