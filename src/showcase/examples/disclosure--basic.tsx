// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {Button, Disclosure} from "@heroui/react";
import {useState} from "react";
import {useCopy} from "../copy";

export function Basic() {
  const t = useCopy();
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <Disclosure className="w-full max-w-md" isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
      <Disclosure.Heading>
        <Button slot="trigger" variant="secondary">
          {t("Read a little more")}<Disclosure.Indicator />
        </Button>
      </Disclosure.Heading>
      <Disclosure.Content>
        <Disclosure.Body className="flex flex-col gap-3 p-4">
          <h3 className="font-medium">{t("An afternoon")}</h3>
          <p className="text-sm text-muted">{t("The room grew quiet after the rain. A book lay open beside a glass of water.")}</p>
          <p className="text-sm text-muted">{t("There was still time to read a few more pages.")}</p>
        </Disclosure.Body>
      </Disclosure.Content>
    </Disclosure>
  );
}

export default Basic;
