// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Checkbox, Description} from "@heroui/react";

export function WithDescription() {
  const t = useCopy();
  return (
    <Checkbox name="description-notifications">
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        {t("Email notifications")}</Checkbox.Content>
      <Description>{t("Get notified when someone mentions you in a comment")}</Description>
    </Checkbox>
  );
}

export default WithDescription;
