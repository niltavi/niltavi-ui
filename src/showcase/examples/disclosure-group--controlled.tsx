// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {ChevronDown, ChevronUp} from "@gravity-ui/icons";
import {Button, Disclosure, DisclosureGroup, useDisclosureGroupNavigation} from "@heroui/react";
import {useState} from "react";
import {useCopy} from "../copy";

export function Controlled() {
  const t = useCopy();
  const [expandedKeys, setExpandedKeys] = useState(new Set<string | number>(["preview"]));

  const {isNextDisabled, isPrevDisabled, onNext, onPrevious} = useDisclosureGroupNavigation({
    expandedKeys,
    itemIds: ["preview", "download"],
    onExpandedChange: setExpandedKeys,
  });

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">niltavi UI</h3>
        <div className="flex gap-2">
          <Button isIconOnly aria-label={t("Previous disclosure")} isDisabled={isPrevDisabled} size="sm" variant="tertiary" onPress={onPrevious}><ChevronUp /></Button>
          <Button isIconOnly aria-label={t("Next disclosure")} isDisabled={isNextDisabled} size="sm" variant="tertiary" onPress={onNext}><ChevronDown /></Button>
        </div>
      </div>
      <DisclosureGroup expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
        <Disclosure id="preview">
          <Disclosure.Heading>
            <Button slot="trigger" className="w-full justify-between" variant="secondary">{t("A short excerpt")}<Disclosure.Indicator /></Button>
          </Disclosure.Heading>
          <Disclosure.Content>
            <Disclosure.Body className="p-4 text-sm text-muted">{t("The room grew quiet after the rain. A book lay open beside a glass of water.")}</Disclosure.Body>
          </Disclosure.Content>
        </Disclosure>
        <Disclosure id="download">
          <Disclosure.Heading>
            <Button slot="trigger" className="w-full justify-between" variant="secondary">{t("About the author")}<Disclosure.Indicator /></Button>
          </Disclosure.Heading>
          <Disclosure.Content>
            <Disclosure.Body className="p-4 text-sm text-muted">{t("Writing, reading, and sometimes drawing an idea before it has a name.")}</Disclosure.Body>
          </Disclosure.Content>
        </Disclosure>
      </DisclosureGroup>
    </div>
  );
}

export default Controlled;
