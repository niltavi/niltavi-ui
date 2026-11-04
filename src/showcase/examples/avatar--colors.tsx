// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Avatar} from "@heroui/react";

export function Colors() {
  const t = useCopy();
  return (
    <div className="flex items-center gap-4">
      <Avatar color="default">
        <Avatar.Fallback>{t("DF")}</Avatar.Fallback>
      </Avatar>
      <Avatar color="accent">
        <Avatar.Fallback>{t("AC")}</Avatar.Fallback>
      </Avatar>
      <Avatar color="success">
        <Avatar.Fallback>{t("SC")}</Avatar.Fallback>
      </Avatar>
      <Avatar color="warning">
        <Avatar.Fallback>{t("WR")}</Avatar.Fallback>
      </Avatar>
      <Avatar color="danger">
        <Avatar.Fallback>{t("DG")}</Avatar.Fallback>
      </Avatar>
    </div>
  );
}

export default Colors;
