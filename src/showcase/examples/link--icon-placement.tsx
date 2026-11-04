// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Link} from "@heroui/react";

export function LinkIconPlacement() {
  const t = useCopy();
  return (
    <div className="flex flex-col gap-3">
      <Link href="#" onClick={(event) => event.preventDefault()}>
        {t("Icon at end (default)")}<Link.Icon />
      </Link>
      <Link className="gap-1" href="#" onClick={(event) => event.preventDefault()}>
        <Link.Icon />
        {t("Icon at start")}</Link>
    </div>
  );
}

export default LinkIconPlacement;
