// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {Label, ProgressBar} from "@heroui/react";

export function Indeterminate() {
  return (
    <ProgressBar isIndeterminate aria-label="Loading" className="w-64">
      <Label>Loading...</Label>
      <ProgressBar.Track>
        <ProgressBar.Fill />
      </ProgressBar.Track>
    </ProgressBar>
  );
}

export default Indeterminate;
