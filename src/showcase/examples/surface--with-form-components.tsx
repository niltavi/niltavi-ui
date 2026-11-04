// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {Input, Surface, TextArea} from "@heroui/react";

export function WithFormComponents() {
  return (
    <Surface className="flex w-full min-w-0 flex-col gap-4 rounded-3xl p-6" variant="default">
      <Input placeholder="Input with secondary variant" variant="secondary" />
      <TextArea placeholder="TextArea with secondary variant" variant="secondary" />
    </Surface>
  );
}

export default WithFormComponents;
