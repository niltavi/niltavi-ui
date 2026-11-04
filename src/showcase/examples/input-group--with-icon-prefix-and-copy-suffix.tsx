// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Copy, Globe} from "@gravity-ui/icons";
import {Button, InputGroup, Label, TextField} from "@heroui/react";

export function WithIconPrefixAndCopySuffix() {
  const t = useCopy();
  return (
    <TextField className="w-full max-w-[280px]" defaultValue="heroui.com" name="website">
      <Label>{t("Website")}</Label>
      <InputGroup>
        <InputGroup.Prefix>
          <Globe className="size-4 text-muted" />
        </InputGroup.Prefix>
        <InputGroup.Input className="w-full max-w-[280px]" />
        <InputGroup.Suffix className="pe-0">
          <Button isIconOnly aria-label={t("Copy")} size="sm" variant="ghost">
            <Copy className="size-4" />
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  );
}

export default WithIconPrefixAndCopySuffix;
