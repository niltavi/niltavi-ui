// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Tabs} from "@heroui/react";

export function Vertical() {
  const t = useCopy();
  return (
    <Tabs className="w-full max-w-lg" orientation="vertical">
      <Tabs.ListContainer>
        <Tabs.List aria-label={t("Vertical tabs")}>
          <Tabs.Tab id="account">
            {t("Account")}<Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="security">
            {t("Security")}<Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="notifications">
            {t("Notifications")}<Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="billing">
            {t("Billing")}<Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel className="px-4" id="account">
        <h3 className="mb-2 font-semibold">{t("Account Settings")}</h3>
        <p className="text-sm text-muted">{t("Manage your account information and preferences.")}</p>
      </Tabs.Panel>
      <Tabs.Panel className="px-4" id="security">
        <h3 className="mb-2 font-semibold">{t("Security Settings")}</h3>
        <p className="text-sm text-muted">
          {t("Configure two-factor authentication and password settings.")}</p>
      </Tabs.Panel>
      <Tabs.Panel className="px-4" id="notifications">
        <h3 className="mb-2 font-semibold">{t("Notification Preferences")}</h3>
        <p className="text-sm text-muted">{t("Choose how and when you want to receive notifications.")}</p>
      </Tabs.Panel>
      <Tabs.Panel className="px-4" id="billing">
        <h3 className="mb-2 font-semibold">{t("Billing Information")}</h3>
        <p className="text-sm text-muted">{t("View and manage your subscription and payment methods.")}</p>
      </Tabs.Panel>
    </Tabs>
  );
}

export default Vertical;
