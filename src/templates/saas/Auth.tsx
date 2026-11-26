import {ArrowLeft, ArrowRightFromSquare, CircleCheckFill, Envelope, Eye, EyeSlash, Layers, Lock, LogoApple, LogoGithub, Pencil} from "@gravity-ui/icons";
import {Alert, AlertDialog, Button, Checkbox, FieldError, Form, Input, InputGroup, InputOTP, Label, Link, Meter, TextField} from "@heroui/react";
import {useEffect, useRef, useState, type FormEvent, type ReactNode} from "react";
import {ProjectBrand, type ProductHeaderProps} from "../../product/ProductHeader";
import {useText} from "../../site/Locale";
import {BannerScene} from "./BannerScene";

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

/** The signed-out shell: a quiet textured panel beside whichever account screen is active. */
export const workspaceBrand: ProductHeaderProps["brand"] = {
  name: "Workspace",
  href: "#/templates/saas",
  symbol: <Layers width={30} height={30} />,
};

export function AuthLayout({children}: {children: ReactNode}) {
  return <div className="nt-authlayout">
    <aside className="nt-authlayout__brand nt-banner-panel"><BannerScene /></aside>
    <main className="nt-authlayout__main">
      <div className="nt-authlayout__logo"><ProjectBrand {...workspaceBrand} /></div>
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

/** Where the code went, fixed once sent; Edit steps back to change it. */
function SentTo({label, value, onEdit}: {label: string; value: string; onEdit: () => void}) {
  const text = useText();
  return <div className="nt-auth__sent nt-fade-in">
    <div><span>{label}</span><strong>{value}</strong></div>
    <Button size="sm" variant="ghost" onPress={onEdit}><Pencil aria-hidden="true" width={14} height={14} />{text("Edit", "编辑")}</Button>
  </div>;
}

/** Label row with "Verification code" left and "Resend" right, flush with the last OTP slot. */
function CodeLabel({left, onResend, isPending}: {left: number; onResend: () => void; isPending?: boolean}) {
  const text = useText();
  return <div className="nt-auth__codelabel">
    <Label>{text("Verification code", "验证码")}</Label>
    <Button size="sm" variant="ghost" className="nt-resend" isDisabled={left > 0} isPending={isPending} onPress={onResend}>
      {left > 0 ? text(`Resend in ${left}s`, `${left} 秒后重发`) : text("Resend code", "重新发送")}
    </Button>
  </div>;
}

/** Error shown under the code input, hidden when there is no error. */
function CodeError({error}: {error?: string}) {
  if (!error) return null;
  return <span className="field-error" data-visible>{error}</span>;
}

function Divider({children}: {children: ReactNode}) {
  return <div className="nt-auth__divider"><span>{children}</span></div>;
}

/* ---------- Sign in: verification code or password ---------- */
export function SignInScreen({onSignedIn, onForgot, onSignUp, notice}: {onSignedIn?: (account: string) => void; onForgot?: () => void; onSignUp?: () => void; notice?: string}) {
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
  const editAccount = () => { setSent(false); setCode(""); setErrors({}); };
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
        {sent
          ? <SentTo label={text("Code sent to", "验证码已发送至")} value={account.trim()} onEdit={editAccount} />
          : <TextField isInvalid={!!errors.account} value={account} onChange={setAccount} name="account" autoComplete="username" autoFocus={!!account}>
            <Label>{text("Email or phone", "邮箱或手机号")}</Label>
            <Input placeholder="you@company.com" />
            {errors.account && <FieldError>{errors.account}</FieldError>}
          </TextField>}
        {sent && <div className="nt-auth__otp nt-fade-up">
          <CodeLabel left={left} isPending={pending === "send"} onResend={sendCode} />
          <CodeInput autoFocus value={code} onChange={(v) => { setCode(v); setErrors({}); }} onComplete={(v) => submit(undefined, v)} isInvalid={!!errors.code} />
          <CodeError error={errors.code} />
        </div>}
        <Button type="submit" className="w-full" isPending={pending === "submit" || (!sent && pending === "send")} isDisabled={sent && code.length < 6}>{sent ? text("Sign in", "登录") : text("Send code", "获取验证码")}</Button>
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
      {onSignUp && <p className="nt-auth__links">{text("New here?", "还没有账号？")}<Link href="#" onClick={(event) => { event.preventDefault(); onSignUp(); }}>{text("Create an account", "注册")}</Link></p>}
    </div>
  </div>;
}

/* ---------- Password strength ---------- */
const strengthMeta = [
  {en: "", zh: "", color: "default"}, {en: "Weak", zh: "弱", color: "danger"}, {en: "Fair", zh: "一般", color: "warning"}, {en: "Good", zh: "良好", color: "accent"}, {en: "Strong", zh: "强", color: "success"},
] as const;

export function StrengthMeter({password}: {password: string}) {
  const text = useText();
  const strength = passwordStrength(password);
  return <Meter value={strength * 25} color={strengthMeta[strength].color} aria-label={text("Password strength", "密码强度")} size="sm">
    <Label>{text("Strength", "强度")}</Label><Meter.Output>{text(strengthMeta[strength].en, strengthMeta[strength].zh)}</Meter.Output><Meter.Track><Meter.Fill /></Meter.Track>
  </Meter>;
}

/* ---------- Sign up: details → verify email → done ---------- */
export function SignUpScreen({onSignIn, onSignedUp}: {onSignIn?: () => void; onSignedUp?: (account: string) => void}) {
  const text = useText();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [left, startCountdown] = useCountdown();

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!emailOk(email)) next.email = text("Enter a valid email", "请输入有效的邮箱");
    if (password.length < 8) next.password = text("At least 8 characters", "密码至少 8 位");
    if (!agreed) next.terms = text("Accept the terms to continue", "请先同意服务条款");
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true); await wait(700); setPending(false); setStep(1); startCountdown();
  };
  const verify = async (typed = code) => {
    if (typed !== DEMO_CODE) { setErrors({code: text("Incorrect code. Try 123456.", "验证码不正确，试试 123456。")}); return; }
    setErrors({}); setPending(true); await wait(700); setPending(false); setStep(2);
  };
  const steps = [text("Details", "填写信息"), text("Verify email", "验证邮箱")];

  return <div className="nt-auth nt-fade-up">
    {step < 2 && <div className="nt-auth__top">
      {step === 1 && <Button isIconOnly size="sm" variant="ghost" aria-label={text("Back", "返回")} onPress={() => { setErrors({}); setStep(0); }}><ArrowLeft aria-hidden="true" width={16} height={16} /></Button>}
      <ol className="nt-steps" aria-label={text("Progress", "进度")}>{steps.map((s, i) => <li key={s} data-state={i < step ? "done" : i === step ? "current" : undefined} aria-current={i === step ? "step" : undefined}><span className="sr-only">{s}</span></li>)}</ol>
    </div>}
    <div key={step} className="nt-slide-end nt-auth__step">
      {step === 0 && <>
        <div className="nt-auth__head"><h3>{text("Create your account", "创建账号")}</h3></div>
        <Form className="nt-auth__form" onSubmit={create} validationBehavior="aria">
          <TextField isInvalid={!!errors.email} value={email} onChange={setEmail} name="email" type="email" autoComplete="email">
            <Label>{text("Work email", "工作邮箱")}</Label>
            <InputGroup><InputGroup.Prefix><Envelope aria-hidden="true" width={14} height={14} /></InputGroup.Prefix><InputGroup.Input placeholder="you@company.com" /></InputGroup>
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </TextField>
          <PasswordField label={text("Password", "密码")} value={password} onChange={setPassword} autoComplete="new-password" isInvalid={!!errors.password} error={errors.password} />
          <StrengthMeter password={password} />
          <div className="nt-auth__terms">
            <Checkbox isSelected={agreed} onChange={(v) => { setAgreed(v); if (v) setErrors(({terms: _, ...rest}) => rest); }} isInvalid={!!errors.terms}>
              <Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>{text("I agree to the Terms and Privacy Policy", "我已阅读并同意服务条款与隐私政策")}</Checkbox.Content>
            </Checkbox>
            {errors.terms && <span className="field-error" data-visible>{errors.terms}</span>}
          </div>
          <Button type="submit" className="w-full" isPending={pending}>{text("Create account", "创建账号")}</Button>
        </Form>
        <p className="nt-auth__links nt-auth__foot">{text("Already have an account?", "已有账号？")}<Link href="#" onClick={(event) => { event.preventDefault(); onSignIn?.(); }}>{text("Sign in", "登录")}</Link></p>
      </>}
      {step === 1 && <>
        <div className="nt-auth__head"><h3>{text("Check your email", "查收验证邮件")}</h3></div>
        <Form className="nt-auth__form" validationBehavior="aria" onSubmit={(e) => { e.preventDefault(); verify(); }}>
          <SentTo label={text("Code sent to", "验证码已发送至")} value={email.trim()} onEdit={() => { setErrors({}); setCode(""); setStep(0); }} />
          <div className="nt-auth__otp">
            <CodeLabel left={left} onResend={startCountdown} />
            <CodeInput autoFocus value={code} onChange={(v) => { setCode(v); setErrors({}); }} onComplete={verify} isInvalid={!!errors.code} />
            <CodeError error={errors.code} />
          </div>
          <Button type="submit" className="w-full" isPending={pending} isDisabled={code.length < 6}>{text("Verify", "验证")}</Button>
        </Form>
      </>}
      {step === 2 && <div className="nt-auth__done">
        <CircleCheckFill aria-hidden="true" width={40} height={40} className="nt-pop" />
        <div className="nt-auth__head"><h3>{text("Your account is ready", "账号已创建")}</h3><p>{email.trim()}</p></div>
        <Button className="w-full" onPress={() => onSignedUp?.(email.trim())}>{text("Get started", "开始使用")}</Button>
      </div>}
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
        <div className="nt-auth__head"><h3>{text("Enter code", "输入验证码")}</h3></div>
        <Form className="nt-auth__form" validationBehavior="aria" onSubmit={(e) => { e.preventDefault(); run(() => code === DEMO_CODE ? "" : text("Incorrect code. Try 123456.", "验证码不正确，试试 123456。"), () => setStep(2)); }}>
          <SentTo label={text("Code sent to", "验证码已发送至")} value={email.trim()} onEdit={() => { setError(""); setCode(""); setStep(0); }} />
          <div className="nt-auth__otp">
            <CodeLabel left={left} onResend={startCountdown} />
            <CodeInput autoFocus value={code} onChange={(v) => { setCode(v); setError(""); }} isInvalid={!!error}
              onComplete={(v) => run(() => v === DEMO_CODE ? "" : text("Incorrect code. Try 123456.", "验证码不正确，试试 123456。"), () => setStep(2))} />
            <CodeError error={error} />
          </div>
          <Button type="submit" className="w-full" isPending={pending} isDisabled={code.length < 6}>{text("Verify", "验证")}</Button>
        </Form>
      </>}
      {step === 2 && <>
        <div className="nt-auth__head"><h3>{text("New password", "设置新密码")}</h3></div>
        <Form className="nt-auth__form" validationBehavior="aria" onSubmit={(e) => { e.preventDefault(); run(() => pw.length < 8 ? text("At least 8 characters", "密码至少 8 位") : pw !== pw2 ? text("Passwords do not match", "两次输入不一致") : "", () => setStep(3)); }}>
          <PasswordField label={text("New password", "新密码")} value={pw} onChange={setPw} autoComplete="new-password" />
          <StrengthMeter password={pw} />
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
