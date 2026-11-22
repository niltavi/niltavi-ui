import {ArrowLeft, ArrowRightFromSquare, CircleCheckFill, Eye, EyeSlash, Layers, Lock} from "@gravity-ui/icons";
import {AlertDialog, Button, Checkbox, Description, FieldError, Form, Input, InputGroup, InputOTP, Label, Meter, TextField} from "@heroui/react";
import {useEffect, useRef, useState, type ReactNode} from "react";
import {ProjectBrand, type ProductHeaderProps} from "../../product/ProductHeader";
import {useText} from "../../site/Locale";
import {ForestScene} from "./ForestScene";

import {DEMO_CODE, isEmail as emailOk, passwordStrength} from "./validation";
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
    <aside className="nt-authlayout__brand"><ForestScene /></aside>
    <main className="nt-authlayout__main">
      <div className="nt-authlayout__logo"><ProjectBrand {...workspaceBrand} /></div>
      {children}
    </main>
  </div>;
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
