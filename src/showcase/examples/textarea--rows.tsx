// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Label, TextArea} from "@heroui/react";

export function Rows() {
  const t = useCopy();
  return (
    <div className="flex w-full max-w-96 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="textarea-rows-3">{t("Short feedback")}</Label>
        <TextArea
          aria-label={t("Short feedback")}
          id="textarea-rows-3"
          placeholder={t("This week's highlights...")}
          rows={3}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="textarea-rows-6">{t("Detailed notes")}</Label>
        <TextArea
          aria-label={t("Detailed notes")}
          id="textarea-rows-6"
          placeholder={t("Write out the full meeting notes...")}
          rows={6}
          style={{resize: "vertical"}}
        />
      </div>
    </div>
  );
}

export default Rows;
