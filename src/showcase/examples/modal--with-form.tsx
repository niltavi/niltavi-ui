// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Envelope} from "@gravity-ui/icons";
import {Button, Input, Label, Modal, Surface, TextField} from "@heroui/react";

export function WithForm() {
  const t = useCopy();
  return (
    <Modal>
      <Button variant="secondary">{t("Open Contact Form")}</Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <Envelope className="size-5" />
              </Modal.Icon>
              <Modal.Heading>{t("Contact Us")}</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                {t("Fill out the form below and we'll get back to you. The modal adapts automatically when the keyboard appears on mobile.")}</p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <Surface variant="default">
                <form className="flex flex-col gap-4">
                  <TextField className="w-full" name="name" type="text" variant="secondary">
                    <Label>{t("Name")}</Label>
                    <Input placeholder={t("Enter your name")} />
                  </TextField>
                  <TextField className="w-full" name="email" type="email" variant="secondary">
                    <Label>{t("Email")}</Label>
                    <Input placeholder={t("Enter your email")} />
                  </TextField>
                  <TextField className="w-full" name="phone" type="tel" variant="secondary">
                    <Label>{t("Phone")}</Label>
                    <Input placeholder={t("Enter your phone number")} />
                  </TextField>
                  <TextField className="w-full" name="company" variant="secondary">
                    <Label>{t("Company")}</Label>
                    <Input placeholder={t("Enter your company name")} />
                  </TextField>
                  <TextField className="w-full" name="message" variant="secondary">
                    <Label>{t("Message")}</Label>
                    <Input placeholder={t("Enter your message")} />
                  </TextField>
                </form>
              </Surface>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">
                {t("Cancel")}</Button>
              <Button slot="close">{t("Send Message")}</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default WithForm;
