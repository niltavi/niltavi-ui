// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {ComponentType, SVGProps} from "react";

import {Bars, Bell, Envelope, Gear, House, Magnifier, Person} from "@gravity-ui/icons";
import {Button, Drawer} from "@heroui/react";

export function Navigation() {
  const t = useCopy();
  const navItems: {icon: ComponentType<SVGProps<SVGSVGElement>>; label: string}[] = [
    {icon: House, label: "Home"},
    {icon: Magnifier, label: "Search"},
    {icon: Bell, label: "Notifications"},
    {icon: Envelope, label: "Messages"},
    {icon: Person, label: "Profile"},
    {icon: Gear, label: "Settings"},
  ];

  return (
    <Drawer>
      <Button variant="secondary">
        <Bars />
        {t("Menu")}</Button>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>{t("Navigation")}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                    type="button"
                  >
                    <item.icon className="size-5 text-muted" />
                    {t(item.label)}
                  </button>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export default Navigation;
