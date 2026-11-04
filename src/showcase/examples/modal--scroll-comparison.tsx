// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Modal, Radio, RadioGroup} from "@heroui/react";
import {useState} from "react";

export function ScrollComparison() {
  const t = useCopy();
  const [scroll, setScroll] = useState<"inside" | "outside">("inside");

  return (
    <div className="flex flex-col gap-4">
      <RadioGroup
        orientation="horizontal"
        value={scroll}
        onChange={(value) => setScroll(value as "inside" | "outside")}
      >
        <Radio value="inside">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            {t("Inside")}</Radio.Content>
        </Radio>
        <Radio value="outside">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            {t("Outside")}</Radio.Content>
        </Radio>
      </RadioGroup>

      <Modal>
        <Button variant="secondary">
          {t("Open Modal (")}{t(scroll.charAt(0).toUpperCase() + scroll.slice(1))}{t(")")}</Button>
        <Modal.Backdrop>
          <Modal.Container scroll={scroll}>
            <Modal.Dialog className="sm:max-w-[360px]">
              <Modal.Header>
                <Modal.Heading>
                  {t("Scroll:")}{t(scroll.charAt(0).toUpperCase() + scroll.slice(1))}
                </Modal.Heading>
                <p className="text-sm leading-5 text-muted">
                  {t("Compare scroll behaviors - inside keeps content scrollable within the modal, outside allows page scrolling")}</p>
              </Modal.Header>
              <Modal.Body>
                {Array.from({length: 30}).map((_, i) => (
                  <p key={i} className="mb-3">
                    {t("Paragraph")}{t(i + 1)}{t(": Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam.")}</p>
                ))}
              </Modal.Body>
              <Modal.Footer>
                <Button slot="close" variant="secondary">
                  {t("Cancel")}</Button>
                <Button slot="close">{t("Confirm")}</Button>
              </Modal.Footer>
              <Modal.CloseTrigger />
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

export default ScrollComparison;
