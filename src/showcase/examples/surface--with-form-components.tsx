// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Input, Surface, TextArea} from "@heroui/react";

export function WithFormComponents() {
  const t = useCopy();
  return (
    <Surface className="flex w-full min-w-0 flex-col gap-4 rounded-3xl p-6" variant="default">
      <Input placeholder={t("Input with secondary variant")} variant="secondary" />
      <TextArea placeholder={t("TextArea with secondary variant")} variant="secondary" />
    </Surface>
  );
}

export default WithFormComponents;
