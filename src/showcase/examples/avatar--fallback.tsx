// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Person} from "@gravity-ui/icons";
import {Avatar} from "@heroui/react";

export function Fallback() {
  const t = useCopy();
  return (
    <div className="flex items-center gap-4">
      {/* Text fallback */}
      <Avatar>
        <Avatar.Fallback>{t("JD")}</Avatar.Fallback>
      </Avatar>

      {/* Icon fallback */}
      <Avatar>
        <Avatar.Fallback>
          <Person />
        </Avatar.Fallback>
      </Avatar>

      {/* Fallback with delay */}
      <Avatar>
        <Avatar.Image
          alt={t("Delayed Avatar")}
          src="https://invalid-url-to-show-fallback.com/image.jpg"
        />
        <Avatar.Fallback delayMs={600}>{t("NA")}</Avatar.Fallback>
      </Avatar>

      {/* Custom styled fallback */}
      <Avatar>
        <Avatar.Fallback className="border-none bg-gradient-to-br from-pink-500 to-purple-500 text-white">
          {t("GB")}</Avatar.Fallback>
      </Avatar>
    </div>
  );
}

export default Fallback;
