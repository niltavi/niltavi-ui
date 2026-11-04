// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Input, Label, Sheet, TextField} from "@heroui/react";

export function WithForm() {
  const t = useCopy();
  return (
    <Sheet placement="right">
      <Sheet.Trigger>
        <Button variant="secondary">{t("Edit Profile")}</Button>
      </Sheet.Trigger>
      <Sheet.Backdrop>
        <Sheet.Content className="w-[400px]">
          <Sheet.Dialog>
            <Sheet.CloseTrigger />
            <Sheet.Header>
              <Sheet.Heading>{t("Edit Profile")}</Sheet.Heading>
            </Sheet.Header>
            <Sheet.Body>
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
            </Sheet.Body>
            <Sheet.Footer>
              <Sheet.Close>
                <Button variant="secondary">{t("Cancel")}</Button>
              </Sheet.Close>
              <Sheet.Close>
                <Button variant="secondary">{t("Save Changes")}</Button>
              </Sheet.Close>
            </Sheet.Footer>
          </Sheet.Dialog>
        </Sheet.Content>
      </Sheet.Backdrop>
    </Sheet>
  );
}

export default WithForm;
