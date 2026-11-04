// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Bell, Comment, Envelope} from "@gravity-ui/icons";
import {Checkbox, CheckboxGroup, Description, Label} from "@heroui/react";

export function FeaturesAndAddOns() {
  const t = useCopy();
  const addOns = [
    {
      description: t("Receive updates via email"),
      icon: Envelope,
      title: t("Email Notifications"),
      value: "email",
    },
    {
      description: t("Get instant SMS notifications"),
      icon: Comment,
      title: t("SMS Alerts"),
      value: "sms",
    },
    {
      description: t("Browser and mobile push alerts"),
      icon: Bell,
      title: t("Push Notifications"),
      value: "push",
    },
  ];

  return (
    <CheckboxGroup className="checkbox-group--cards" name="notification-preferences">
      <div className="choice-group__heading">
        <Label>{t("Notification preferences")}</Label>
        <Description>{t("Choose how you want to receive updates")}</Description>
      </div>
      <div className="choice-list">
        {addOns.map((addon) => (
          <Checkbox key={addon.value} className="checkbox--card" value={addon.value} variant="secondary">
            <Checkbox.Content className="choice-card choice-card--with-icon">
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <addon.icon aria-hidden="true" className="choice-card__icon" />
              <div className="choice-card__body">
                <span>{t(addon.title)}</span>
                <Description>{t(addon.description)}</Description>
              </div>
            </Checkbox.Content>
          </Checkbox>
        ))}
      </div>
    </CheckboxGroup>
  );
}

export default FeaturesAndAddOns;
