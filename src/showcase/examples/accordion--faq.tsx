// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {ChevronDown} from "@gravity-ui/icons";
import {Accordion} from "@heroui/react";

export function FAQ() {
  const t = useCopy();
  const categories = [
    {
      items: [
        {
          content:
            "Browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your purchase.",
          title: t("How do I place an order?"),
        },
        {
          content:
            "Yes, you can modify or cancel your order before it's shipped. Once your order is processed, you can't make changes.",
          title: t("Can I modify or cancel my order?"),
        },
      ],
      title: t("General"),
    },
    {
      items: [
        {
          content:
            "You can purchase a license directly from our website. Select the license type that fits your needs and proceed to checkout.",
          title: t("How do I purchase a license?"),
        },
        {
          content:
            "A standard license is for personal use or small projects, while a pro license includes commercial use rights and priority support.",
          title: t("What is the difference between a standard and a pro license?"),
        },
      ],
      title: t("Licensing"),
    },
    {
      items: [
        {
          content:
            "You can reach our support team through the contact form on our website, or email us directly at support@example.com.",
          title: t("How do I get support?"),
        },
      ],
      title: t("Support"),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">{t("Frequently Asked Questions")}</h2>
        <p className="mb-4 text-lg font-medium text-muted">
          {t("Everything you need to know about licensing and usage.")}</p>
      </div>
      {categories.map((category) => (
        <div key={category.title}>
          <p className="text-md mb-2 font-medium text-muted">{t(category.title)}</p>
          <Accordion className="w-full" variant="surface">
            {category.items.map((item, index) => (
              <Accordion.Item key={index}>
                <Accordion.Heading>
                  <Accordion.Trigger>
                    {t(item.title)}
                    <Accordion.Indicator>
                      <ChevronDown />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>{t(item.content)}</Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export default FAQ;
