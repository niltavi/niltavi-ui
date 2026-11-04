// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {Bell, Comment, Envelope} from "@gravity-ui/icons";
import {Checkbox, CheckboxGroup, Description, Label} from "@heroui/react";

export function FeaturesAndAddOns() {
  const addOns = [
    {
      description: "Receive updates via email",
      icon: Envelope,
      title: "Email Notifications",
      value: "email",
    },
    {
      description: "Get instant SMS notifications",
      icon: Comment,
      title: "SMS Alerts",
      value: "sms",
    },
    {
      description: "Browser and mobile push alerts",
      icon: Bell,
      title: "Push Notifications",
      value: "push",
    },
  ];

  return (
    <CheckboxGroup className="checkbox-group--cards" name="notification-preferences">
      <div className="choice-group__heading">
        <Label>Notification preferences</Label>
        <Description>Choose how you want to receive updates</Description>
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
                <span>{addon.title}</span>
                <Description>{addon.description}</Description>
              </div>
            </Checkbox.Content>
          </Checkbox>
        ))}
      </div>
    </CheckboxGroup>
  );
}

export default FeaturesAndAddOns;
