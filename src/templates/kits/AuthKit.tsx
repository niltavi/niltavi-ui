import {ArrowRightFromSquare, CircleCheckFill} from "@gravity-ui/icons";
import {Avatar, Button} from "@heroui/react";
import {useState} from "react";
import {useText} from "../../site/Locale";
import {AuthLayout, ResetPasswordScreen, SignInScreen, SignOutDialog, SignUpScreen} from "../saas/Auth";

type View = "signin" | "signup" | "reset" | "signed-in";

/** Account flow: sign in, sign up with email verification, reset password, sign out. */
export function AuthKit() {
  const text = useText();
  const [view, setView] = useState<View>("signin");
  const [account, setAccount] = useState("lin@niltavi.com");
  const [notice, setNotice] = useState("");
  const [signOutOpen, setSignOutOpen] = useState(false);

  const go = (next: View, message = "") => { setNotice(message); setView(next); };
  const enter = (who: string) => { if (who) setAccount(who); go("signed-in"); };

  return <div className="nt-saas">
    <AuthLayout>
      {view === "signin" && <SignInScreen key="signin" notice={notice} onSignedIn={enter} onForgot={() => go("reset")} onSignUp={() => go("signup")} />}
      {view === "signup" && <SignUpScreen key="signup" onSignIn={() => go("signin")} onSignedUp={enter} />}
      {view === "reset" && <ResetPasswordScreen key="reset" onBack={() => go("signin")} onDone={() => go("signin", text("Password updated.", "密码已更新"))} />}
      {view === "signed-in" && <div className="nt-auth nt-fade-up kit-auth__signed">
        <CircleCheckFill aria-hidden="true" width={32} height={32} className="nt-pop" />
        <div className="nt-auth__head"><h3>{text("You're signed in", "已登录")}</h3></div>
        <div className="kit-auth__who">
          <Avatar size="md" color="accent"><Avatar.Fallback>{account.slice(0, 2).toUpperCase()}</Avatar.Fallback></Avatar>
          <span>{account}</span>
        </div>
        <Button variant="secondary" className="w-full" onPress={() => setSignOutOpen(true)}><ArrowRightFromSquare aria-hidden="true" width={14} height={14} />{text("Sign out", "退出登录")}</Button>
      </div>}
    </AuthLayout>
    <SignOutDialog isOpen={signOutOpen} onOpenChange={setSignOutOpen} account={account} onConfirm={() => go("signin", text("Signed out.", "已退出登录"))} />
  </div>;
}
