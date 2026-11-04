// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Drawer, Input, Label, TextField} from "@heroui/react";

export function WithForm() {
  const t = useCopy();
  return (
    <Drawer>
      <Button variant="secondary">{t("Edit Profile")}</Button>
      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>{t("Edit Profile")}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <form className="flex flex-col gap-4">
                <TextField className="w-full" name="name" type="text">
                  <Label>{t("Name")}</Label>
                  <Input placeholder={t("Enter your name")} variant="secondary" />
                </TextField>
                <TextField className="w-full" name="email" type="email">
                  <Label>{t("Email")}</Label>
                  <Input placeholder={t("Enter your email")} variant="secondary" />
                </TextField>
                <TextField className="w-full" name="bio">
                  <Label>{t("Bio")}</Label>
                  <Input placeholder={t("Tell us about yourself")} variant="secondary" />
                </TextField>
              </form>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" variant="secondary">
                {t("Cancel")}</Button>
              <Button slot="close">{t("Save Changes")}</Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export default WithForm;
