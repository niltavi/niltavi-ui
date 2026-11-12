import {ArrowLeft, ArrowRightFromSquare, CircleCheckFill, Envelope, Eye, EyeSlash, Lock, LogoApple, LogoGithub} from "@gravity-ui/icons";
import {Alert, AlertDialog, Button, Checkbox, Description, FieldError, Form, Input, InputGroup, InputOTP, Label, Link, Meter, TextField} from "@heroui/react";
import {useEffect, useId, useRef, useState, type FormEvent, type ReactNode} from "react";
import {useText} from "../../site/Locale";

import {DEMO_CODE, isEmail as emailOk, isPhone as phoneOk, passwordStrength} from "./validation";
export {DEMO_CODE, passwordStrength};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return [left, () => setLeft(60)] as const;
}

/** Soft, non-repeating texture: fractal noise mapped to a faint ink tint, drawn once over the whole panel. */
function Texture() {
  const id = useId().replace(/:/g, "");
  return <svg className="nt-authlayout__texture" aria-hidden="true" focusable="false">
    <filter id={`${id}-cloud`}><feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="4" seed="11" /><feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .14  0 0 0 0 .2  1.8 0 0 0 -.7" /></filter>
    <filter id={`${id}-grain`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" /><feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .14  0 0 0 0 .2  1.6 0 0 0 -.65" /></filter>
    <rect width="100%" height="100%" filter={`url(#${id}-cloud)`} className="nt-authlayout__cloud" />
    <rect width="100%" height="100%" filter={`url(#${id}-grain)`} className="nt-authlayout__grain" />
  </svg>;
}

/** The signed-out shell: a quiet textured panel beside whichever account screen is active. */
export function AuthLayout({children, product = "Niltavi"}: {children: ReactNode; product?: string}) {
  const brand = <div className="nt-auth__brand"><span className="tpl-nav__logo" aria-hidden="true">{product.slice(0, 1)}</span><strong>{product}</strong></div>;
  return <div className="nt-authlayout">
    <aside className="nt-authlayout__brand"><Texture />{brand}</aside>
    <main className="nt-authlayout__main">
      <div className="nt-authlayout__mobile-brand">{brand}</div>
      {children}
    </main>
  </div>;
}

function Notice({children}: {children: ReactNode}) {
  return <Alert status="success" className="nt-fade-down"><Alert.Indicator /><Alert.Content><Alert.Description>{children}</Alert.Description></Alert.Content></Alert>;
}

export function PasswordField({label, value, onChange, isInvalid, error, autoComplete = "current-password", name = "password"}: {label: string; value: string; onChange: (v: string) => void; isInvalid?: boolean; error?: string; autoComplete?: string; name?: string}) {
  const text = useText();
  const [visible, setVisible] = useState(false);
  return <TextField isInvalid={isInvalid} value={value} onChange={onChange} name={name} type={visible ? "text" : "password"} autoComplete={autoComplete}>
    <Label>{label}</Label>
    <InputGroup>
      <InputGroup.Prefix><Lock aria-hidden="true" width={14} height={14} /></InputGroup.Prefix>
      <InputGroup.Input placeholder="••••••••" />
      <InputGroup.Suffix className="pe-0">
        <Button isIconOnly size="sm" variant="ghost" aria-label={visible ? text("Hide password", "隐藏密码") : text("Show password", "显示密码")} onPress={() => setVisible((v) => !v)}>
          {visible ? <EyeSlash aria-hidden="true" width={14} height={14} /> : <Eye aria-hidden="true" width={14} height={14} />}
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
    {error && <FieldError>{error}</FieldError>}
  </TextField>;
}

function CodeInput({value, onChange, isInvalid, onComplete, autoFocus}: {value: string; onChange: (v: string) => void; isInvalid?: boolean; onComplete?: (v: string) => void; autoFocus?: boolean}) {
  const text = useText();
  const wrap = useRef<HTMLDivElement>(null);
  // Move focus into the code once it appears, so typing continues where the user expects.
  useEffect(() => { if (autoFocus) wrap.current?.querySelector("input")?.focus(); }, [autoFocus]);
  return <div ref={wrap}><InputOTP maxLength={6} value={value} isInvalid={isInvalid} onChange={(v) => { onChange(v); if (v.length === 6) onComplete?.(v); }} aria-label={text("Verification code", "验证码")}>
    <InputOTP.Group><InputOTP.Slot index={0} /><InputOTP.Slot index={1} /><InputOTP.Slot index={2} /></InputOTP.Group>
    <InputOTP.Separator />
    <InputOTP.Group><InputOTP.Slot index={3} /><InputOTP.Slot index={4} /><InputOTP.Slot index={5} /></InputOTP.Group>
  </InputOTP></div>;
}

function Divider({children}: {children: ReactNode}) {
  return <div className="nt-auth__divider"><span>{children}</span></div>;
}

/* ---------- Sign in: verification code or password ---------- */
export function SignInScreen({onSignedIn, onForgot, notice}: {onSignedIn?: (account: string) => void; onForgot?: () => void; notice?: string}) {
  const text = useText();
  const [method, setMethod] = useState<"code" | "password">("code");
  const [account, setAccount] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<"" | "send" | "submit">("");
  const [left, startCountdown] = useCountdown();

  const sendCode = async () => {
    if (!emailOk(account) && !phoneOk(account)) { setErrors({account: text("Enter a valid email or phone number", "请输入有效的邮箱或手机号")}); return; }
    setErrors({}); setPending("send"); await wait(700); setPending(""); setSent(true); startCountdown();
  };
  const submit = async (event?: FormEvent, typed?: string) => {
    event?.preventDefault();
    const next: Record<string, string> = {};
    if (method === "code") {
      if (!sent) return sendCode();
      if ((typed ?? code) !== DEMO_CODE) next.code = text("Incorrect code. Try 123456.", "验证码不正确，试试 123456。");
    } else {
      if (!emailOk(account)) next.account = text("Enter a valid email", "请输入有效的邮箱");
      if (password.length < 8) next.password = text("At least 8 characters", "密码至少 8 位");
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending("submit"); await wait(800); setPending("");
    onSignedIn?.(account);
  };

  const switchMethod = () => { setMethod(method === "code" ? "password" : "code"); setErrors({}); };

  return <div className="nt-auth nt-auth--signin nt-fade-up">
    <h3 className="nt-auth__title">{text("Sign in", "登录")}</h3>
    {notice && <Notice>{notice}</Notice>}
    {method === "code"
      ? <Form key="code" className="nt-auth__form nt-fade-in" onSubmit={submit} validationBehavior="aria">
        <TextField isInvalid={!!errors.account} value={account} onChange={(v) => { setAccount(v); setSent(false); setCode(""); }} name="account" autoComplete="username">
          <Label>{text("Email or phone", "邮箱或手机号")}</Label>
          <div className="nt-auth__inline">
            <Input placeholder="you@company.com" className="flex-1" />
            <Button variant="secondary" onPress={sendCode} isPending={pending === "send"} isDisabled={left > 0} className="shrink-0">
              {left > 0 ? `${left}s` : sent ? text("Resend", "重发") : text("Send code", "获取验证码")}
            </Button>
          </div>
          {errors.account && <FieldError>{errors.account}</FieldError>}
        </TextField>
        {sent && <div className="nt-auth__otp nt-fade-up">
          <Label>{text("Verification code", "验证码")}</Label>
          <CodeInput autoFocus value={code} onChange={(v) => { setCode(v); setErrors({}); }} onComplete={(v) => submit(undefined, v)} isInvalid={!!errors.code} />
          {errors.code ? <span className="field-error" data-visible>{errors.code}</span> : <Description>{text("Demo code 123456", "演示验证码 123456")}</Description>}
        </div>}
        <Button type="submit" className="w-full" isPending={pending === "submit"} isDisabled={sent && code.length < 6}>{sent ? text("Sign in", "登录") : text("Continue", "继续")}</Button>
      </Form>
      : <Form key="password" className="nt-auth__form nt-fade-in" onSubmit={submit} validationBehavior="aria">
        <TextField isInvalid={!!errors.account} value={account} onChange={setAccount} name="email" type="email" autoComplete="username">
          <Label>{text("Email", "邮箱")}</Label>
          <InputGroup><InputGroup.Prefix><Envelope aria-hidden="true" width={14} height={14} /></InputGroup.Prefix><InputGroup.Input placeholder="you@company.com" /></InputGroup>
          {errors.account && <FieldError>{errors.account}</FieldError>}
        </TextField>
        <PasswordField label={text("Password", "密码")} value={password} onChange={setPassword} isInvalid={!!errors.password} error={errors.password} />
        <Button type="submit" className="w-full" isPending={pending === "submit"}>{text("Sign in", "登录")}</Button>
      </Form>}
    <div className="nt-auth__alt">
      <Divider>{text("or", "或")}</Divider>
      <div className="nt-auth__social">
        <Button isIconOnly variant="secondary" aria-label={text("Continue with GitHub", "使用 GitHub 登录")}><LogoGithub aria-hidden="true" width={18} height={18} /></Button>
        <Button isIconOnly variant="secondary" aria-label={text("Continue with Apple", "使用 Apple 登录")}><LogoApple aria-hidden="true" width={18} height={18} /></Button>
      </div>
      <p className="nt-auth__links">
        <Link href="#" onClick={(event) => { event.preventDefault(); switchMethod(); }}>{method === "code" ? text("Use password", "使用密码登录") : text("Use a code", "使用验证码登录")}</Link>
        {method === "password" && <><span aria-hidden="true">·</span><Link href="#" onClick={(event) => { event.preventDefault(); onForgot?.(); }}>{text("Forgot password?", "忘记密码")}</Link></>}
      </p>
    </div>
  </div>;
}

/* ---------- Forgot password: email → code → new password → done ---------- */
export function ResetPasswordScreen({onBack, onDone}: {onBack?: () => void; onDone?: () => void}) {
  const text = useText();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [left, startCountdown] = useCountdown();
  const strength = passwordStrength(pw);
  const strengthMeta = [
    {en: "", zh: "", color: "default"}, {en: "Weak", zh: "弱", color: "danger"}, {en: "Fair", zh: "一般", color: "warning"}, {en: "Good", zh: "良好", color: "accent"}, {en: "Strong", zh: "强", color: "success"},
  ] as const;

  const run = async (check: () => string, after: () => void) => {
    const message = check();
    setError(message);
    if (message) return;
    setPending(true); await wait(700); setPending(false); after();
  };
  const steps = [text("Email", "邮箱"), text("Verify", "验证"), text("New password", "新密码")];

  return <div className="nt-auth nt-fade-up">
    <div className="nt-auth__top">
      {step < 3 && <Button isIconOnly size="sm" variant="ghost" aria-label={text("Back", "返回")} onPress={() => { setError(""); if (step === 0) onBack?.(); else setStep(step - 1); }}><ArrowLeft aria-hidden="true" width={16} height={16} /></Button>}
      {step < 3 && <ol className="nt-steps" aria-label={text("Progress", "进度")}>{steps.map((s, i) => <li key={s} data-state={i < step ? "done" : i === step ? "current" : undefined} aria-current={i === step ? "step" : undefined}><span className="sr-only">{s}</span></li>)}</ol>}
    </div>
    <div key={step} className="nt-slide-end nt-auth__step">
      {step === 0 && <>
        <div className="nt-auth__head"><h3>{text("Reset password", "找回密码")}</h3></div>
        <Form className="nt-auth__form" validationBehavior="aria" onSubmit={(e) => { e.preventDefault(); run(() => emailOk(email) ? "" : text("Enter a valid email", "请输入有效的邮箱"), () => { setStep(1); startCountdown(); }); }}>
          <TextField isInvalid={!!error} value={email} onChange={setEmail} type="email" autoComplete="email" autoFocus>
            <Label>{text("Email", "邮箱")}</Label><Input placeholder="you@company.com" />{error && <FieldError>{error}</FieldError>}
          </TextField>
          <Button type="submit" className="w-full" isPending={pending}>{text("Send code", "发送验证码")}</Button>
        </Form>
      </>}
      {step === 1 && <>
        <div className="nt-auth__head"><h3>{text("Enter code", "输入验证码")}</h3><p>{email}</p></div>
        <Form className="nt-auth__form" validationBehavior="aria" onSubmit={(e) => { e.preventDefault(); run(() => code === DEMO_CODE ? "" : text("Incorrect code. Try 123456.", "验证码不正确，试试 123456。"), () => setStep(2)); }}>
          <div className="nt-auth__otp"><CodeInput autoFocus value={code} onChange={(v) => { setCode(v); setError(""); }} isInvalid={!!error}
            onComplete={(v) => run(() => v === DEMO_CODE ? "" : text("Incorrect code. Try 123456.", "验证码不正确，试试 123456。"), () => setStep(2))} />
            {error ? <span className="field-error" data-visible>{error}</span> : <Description>{text("Demo code 123456", "演示验证码 123456")}</Description>}</div>
          <Button type="submit" className="w-full" isPending={pending} isDisabled={code.length < 6}>{text("Verify", "验证")}</Button>
          <Button variant="ghost" size="sm" isDisabled={left > 0} onPress={startCountdown}>{left > 0 ? text(`Resend in ${left}s`, `${left} 秒后可重发`) : text("Resend code", "重新发送")}</Button>
        </Form>
      </>}
      {step === 2 && <>
        <div className="nt-auth__head"><h3>{text("New password", "设置新密码")}</h3></div>
        <Form className="nt-auth__form" validationBehavior="aria" onSubmit={(e) => { e.preventDefault(); run(() => pw.length < 8 ? text("At least 8 characters", "密码至少 8 位") : pw !== pw2 ? text("Passwords do not match", "两次输入不一致") : "", () => setStep(3)); }}>
          <PasswordField label={text("New password", "新密码")} value={pw} onChange={setPw} autoComplete="new-password" />
          <Meter value={strength * 25} color={strengthMeta[strength].color} aria-label={text("Password strength", "密码强度")} size="sm">
            <Label>{text("Strength", "强度")}</Label><Meter.Output>{text(strengthMeta[strength].en, strengthMeta[strength].zh)}</Meter.Output><Meter.Track><Meter.Fill /></Meter.Track>
          </Meter>
          <PasswordField label={text("Confirm password", "确认密码")} value={pw2} onChange={setPw2} autoComplete="new-password" name="confirm" isInvalid={!!error} error={error} />
          <Button type="submit" className="w-full" isPending={pending}>{text("Update password", "更新密码")}</Button>
        </Form>
      </>}
      {step === 3 && <div className="nt-auth__done">
        <CircleCheckFill aria-hidden="true" width={40} height={40} className="nt-pop" />
        <div className="nt-auth__head"><h3>{text("Password updated", "密码已更新")}</h3></div>
        <Button className="w-full" onPress={onDone ?? onBack}>{text("Back to sign in", "返回登录")}</Button>
      </div>}
    </div>
  </div>;
}

/* ---------- Sign out confirmation ---------- */
export function SignOutDialog({isOpen, onOpenChange, onConfirm, account}: {isOpen: boolean; onOpenChange: (open: boolean) => void; onConfirm?: (allDevices: boolean) => void; account?: string}) {
  const text = useText();
  const [all, setAll] = useState(false);
  const [pending, setPending] = useState(false);
  const confirm = async () => { setPending(true); await wait(600); setPending(false); onOpenChange(false); onConfirm?.(all); };
  return <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
    <AlertDialog.Container>
      <AlertDialog.Dialog className="sm:max-w-[400px]">
        <AlertDialog.Header>
          <AlertDialog.Icon status="accent"><ArrowRightFromSquare aria-hidden="true" width={18} height={18} /></AlertDialog.Icon>
          <AlertDialog.Heading>{text("Sign out?", "确认退出登录？")}</AlertDialog.Heading>
        </AlertDialog.Header>
        <AlertDialog.Body className="flex flex-col gap-3">
          <p>{account ? text(`You are signed in as ${account}. Unsaved changes will be lost.`, `当前登录账号为 ${account}，未保存的内容将会丢失。`) : text("Unsaved changes will be lost.", "未保存的内容将会丢失。")}</p>
          <Checkbox isSelected={all} onChange={setAll}><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>{text("Sign out of all devices", "同时退出所有设备")}</Checkbox.Content></Checkbox>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button slot="close" variant="tertiary">{text("Cancel", "取消")}</Button>
          <Button onPress={confirm} isPending={pending}>{text("Sign out", "退出登录")}</Button>
        </AlertDialog.Footer>
      </AlertDialog.Dialog>
    </AlertDialog.Container>
  </AlertDialog.Backdrop>;
}
