// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Tabs} from "@heroui/react";

const items = [
  {id: "overview", label: "Overview"},
  {id: "analytics", label: "Analytics"},
  {id: "reports", label: "Reports"},
  {id: "performance", label: "Performance"},
  {id: "engagement", label: "Engagement"},
  {id: "audience", label: "Audience"},
  {id: "acquisition", label: "Acquisition"},
  {id: "retention", label: "Retention"},
  {id: "settings", label: "Settings"},
];

export function Overflow() {
  const t = useCopy();
  return (
    <div className="w-[400px]">
      <Tabs>
        <Tabs.ListContainer>
          <Tabs.List aria-label={t("Overflow options")}>
            {items.map((item) => (
              <Tabs.Tab key={item.id} id={item.id}>
                {t(item.label)}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
        {items.map((item) => (
          <Tabs.Panel key={item.id} className="pt-4" id={item.id}>
            <p>{t(item.label)} {" "}{t("panel content.")}</p>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}

export default Overflow;
