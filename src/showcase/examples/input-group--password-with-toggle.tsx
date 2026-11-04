// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Eye, EyeSlash} from "@gravity-ui/icons";
import {Button, InputGroup, Label, TextField} from "@heroui/react";
import {useState} from "react";

export function PasswordWithToggle() {
  const t = useCopy();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField className="w-full max-w-[280px]" name="password">
      <Label>{t("Password")}</Label>
      <InputGroup>
        <InputGroup.Input
          className="w-full max-w-[280px]"
          type={isVisible ? "text" : "password"}
          value={isVisible ? "87$2h.3diua" : "••••••••"}
        />
        <InputGroup.Suffix className="pe-0">
          <Button
            isIconOnly
            aria-label={t(isVisible ? "Hide password" : "Show password")}
            size="sm"
            variant="ghost"
            onPress={() => setIsVisible(!isVisible)}
          >
            {t(isVisible ? <Eye className="size-4" /> : <EyeSlash className="size-4" />)}
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  );
}

export default PasswordWithToggle;
