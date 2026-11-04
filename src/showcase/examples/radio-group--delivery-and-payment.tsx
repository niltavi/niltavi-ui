// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {Description, Label, Radio, RadioGroup} from "@heroui/react";
import {DemoIcon as Icon} from "../DemoIcon";

export function DeliveryAndPayment() {
  const deliveryOptions = [
    {
      description: "4-10 business days",
      price: "$5.00",
      title: "Standard",
      value: "standard",
    },
    {
      description: "2-5 business days",
      price: "$16.00",
      title: "Express",
      value: "express",
    },
    {
      description: "1 business day",
      price: "$25.00",
      title: "Super Fast",
      value: "super-fast",
    },
  ];

  const paymentOptions = [
    {
      description: "Exp. on 01/2026",
      icon: "uim:master-card",
      title: "**** 8304",
      value: "mastercard",
    },
    {
      description: "Exp. on 01/2026",
      icon: "streamline-logos:visa-logo-solid",
      title: "**** 0123",
      value: "visa",
    },
    {
      description: "Pay with PayPal",
      icon: "ic:baseline-paypal",
      title: "PayPal",
      value: "paypal",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <RadioGroup className="radio-group--cards" defaultValue="express" name="delivery" variant="secondary">
        <Label>Delivery method</Label>
        <div className="choice-list choice-list--columns">
          {deliveryOptions.map((option) => (
            <Radio key={option.value} className="radio--card" value={option.value}>
              <Radio.Content className="choice-card">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <div className="choice-card__body">
                  <span>{option.title}</span>
                  <Description>{option.description}</Description>
                </div>
                <span className="choice-card__detail text-sm font-semibold">{option.price}</span>
              </Radio.Content>
            </Radio>
          ))}
        </div>
      </RadioGroup>
      <RadioGroup className="radio-group--cards" defaultValue="visa" name="payment" variant="secondary">
        <Label>Payment method</Label>
        <div className="choice-list choice-list--columns">
          {paymentOptions.map((option) => (
            <Radio key={option.value} className="radio--card" value={option.value}>
              <Radio.Content className="choice-card choice-card--with-icon">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Icon className="choice-card__icon" icon={option.icon} />
                <div className="choice-card__body">
                  <span>{option.title}</span>
                  <Description>{option.description}</Description>
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
