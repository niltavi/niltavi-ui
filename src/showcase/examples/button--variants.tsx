// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button} from "@heroui/react";

export function Variants() {
  const t = useCopy();
  return (
    <div className="flex flex-wrap gap-3">
      <Button>{t("Primary")}</Button>
      <Button variant="secondary">{t("Secondary")}</Button>
      <Button variant="tertiary">{t("Tertiary")}</Button>
      <Button variant="outline">{t("Outline")}</Button>
      <Button variant="ghost">{t("Ghost")}</Button>
      <Button variant="danger">{t("Danger")}</Button>
      <Button variant="danger-soft">{t("Danger Soft")}</Button>
      <Button className="button--rufous">{t("上传照片")}</Button>
    </div>
  );
}

export default Variants;
