// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Switch, SwitchGroup} from "@heroui/react";

export function Group() {
  const t = useCopy();
  return (
    <SwitchGroup>
      <Switch name="notifications">
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {t("Allow Notifications")}</Switch.Content>
      </Switch>
      <Switch name="marketing">
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {t("Marketing emails")}</Switch.Content>
      </Switch>
      <Switch name="social">
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {t("Social media updates")}</Switch.Content>
      </Switch>
    </SwitchGroup>
  );
}

export default Group;
