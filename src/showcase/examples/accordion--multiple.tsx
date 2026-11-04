// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Accordion} from "@heroui/react";

export function Multiple() {
  const t = useCopy();
  return (
    <Accordion allowsMultipleExpanded className="w-full max-w-md">
      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger>
            {t("Getting Started")}<Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            {t("Learn the basics of HeroUI and how to integrate it into your React project. This section covers installation, setup, and your first component.")}</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger>
            {t("Core Concepts")}<Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            {t("Understand the fundamental concepts behind HeroUI, including the compound component pattern, styling with Tailwind CSS, and accessibility features.")}</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger>
            {t("Advanced Usage")}<Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            {t("Explore advanced features like custom variants, theme customization, and integration with other libraries in your React ecosystem.")}</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger>
            {t("Best Practices")}<Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            {t("Follow our recommended best practices for building performant, accessible, and maintainable applications with HeroUI components.")}</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default Multiple;
