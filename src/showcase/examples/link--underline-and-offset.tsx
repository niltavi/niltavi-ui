// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Link} from "@heroui/react";

export function LinkUnderlineAndOffset() {
  const t = useCopy();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">{t("Default hover underline")}</p>
        <Link href="#" onClick={(event) => event.preventDefault()}>
          {t("Hover to see the underline")}<Link.Icon />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">{t("Always visible underline")}</p>
        <Link className="underline" href="#" onClick={(event) => event.preventDefault()}>
          {t("Underline always visible")}<Link.Icon />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">{t("No underline")}</p>
        <Link className="no-underline" href="#" onClick={(event) => event.preventDefault()}>
          {t("Link without any underline")}<Link.Icon />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">{t("Changing the underline offset")}</p>
        <div className="flex flex-col gap-3">
          <Link className="underline-offset-1" href="#" onClick={(event) => event.preventDefault()}>
            {t("Offset 1 (1px space)")}<Link.Icon />
          </Link>
          <Link className="underline-offset-2" href="#" onClick={(event) => event.preventDefault()}>
            {t("Offset 2 (2px space)")}<Link.Icon />
          </Link>
          <Link className="underline-offset-3" href="#" onClick={(event) => event.preventDefault()}>
            {t("Offset 3 (3px space)")}<Link.Icon />
          </Link>
          <Link className="underline-offset-4" href="#" onClick={(event) => event.preventDefault()}>
            {t("Offset 4 (4px space)")}<Link.Icon />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LinkUnderlineAndOffset;
