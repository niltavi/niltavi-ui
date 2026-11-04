// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {TextArea} from "@heroui/react";

export function Variants() {
  return (
    <div className="flex w-[280px] flex-col gap-2">
      <TextArea fullWidth placeholder="Primary textarea" variant="primary" />
      <TextArea fullWidth placeholder="Secondary textarea" variant="secondary" />
    </div>
  );
}

export default Variants;
