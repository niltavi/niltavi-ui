// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {Button} from "@heroui/react";

export function Variants() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="danger-soft">Danger Soft</Button>
      <Button className="button--rufous">上传照片</Button>
    </div>
  );
}

export default Variants;
