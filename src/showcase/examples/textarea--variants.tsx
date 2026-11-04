// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {TextArea} from "@heroui/react";

export function Variants() {
  const t = useCopy();
  return (
    <div className="flex w-full max-w-[280px] flex-col gap-2">
      <TextArea fullWidth placeholder={t("Primary textarea")} variant="primary" />
      <TextArea fullWidth placeholder={t("Secondary textarea")} variant="secondary" />
    </div>
  );
}

export default Variants;
