// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Description, Label, Radio, RadioGroup} from "@heroui/react";
import {DemoIcon as Icon} from "../DemoIcon";

export function DeliveryAndPayment() {
  const t = useCopy();
  const deliveryOptions = [
    {
      description: t("4-10 business days"),
      price: "$5.00",
      title: t("Standard"),
      value: "standard",
    },
    {
      description: t("2-5 business days"),
      price: "$16.00",
      title: t("Express"),
      value: "express",
    },
    {
      description: t("1 business day"),
      price: "$25.00",
      title: t("Super Fast"),
      value: "super-fast",
    },
  ];

  const paymentOptions = [
    {
      description: t("Exp. on 01/2026"),
      icon: "uim:master-card",
      title: "**** 8304",
      value: "mastercard",
    },
    {
      description: t("Exp. on 01/2026"),
      icon: "streamline-logos:visa-logo-solid",
      title: "**** 0123",
      value: "visa",
    },
    {
      description: t("Pay with PayPal"),
      icon: "ic:baseline-paypal",
      title: t("PayPal"),
      value: "paypal",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <RadioGroup className="radio-group--cards" defaultValue="express" name="delivery" variant="secondary">
        <Label>{t("Delivery method")}</Label>
        <div className="choice-list choice-list--columns">
          {deliveryOptions.map((option) => (
            <Radio key={option.value} className="radio--card" value={option.value}>
              <Radio.Content className="choice-card">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <div className="choice-card__body">
                  <span>{t(option.title)}</span>
                  <Description>{t(option.description)}</Description>
                </div>
                <span className="choice-card__detail text-sm font-semibold">{t(option.price)}</span>
              </Radio.Content>
            </Radio>
          ))}
        </div>
      </RadioGroup>
      <RadioGroup className="radio-group--cards" defaultValue="visa" name="payment" variant="secondary">
        <Label>{t("Payment method")}</Label>
        <div className="choice-list choice-list--columns">
          {paymentOptions.map((option) => (
            <Radio key={option.value} className="radio--card" value={option.value}>
              <Radio.Content className="choice-card choice-card--with-icon">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Icon className="choice-card__icon" icon={option.icon} />
                <div className="choice-card__body">
                  <span>{t(option.title)}</span>
                  <Description>{t(option.description)}</Description>
                </div>
              </Radio.Content>
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

export default DeliveryAndPayment;
