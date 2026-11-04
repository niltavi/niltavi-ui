// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {toast} from "@heroui/react";
import {Pencil, SquarePlus, TrashBin} from "@gravity-ui/icons";
import {Description, Header, Kbd, Label, ListBox, Separator, Surface} from "@heroui/react";

export function WithSections() {
  const t = useCopy();
  return (
    <Surface className="w-full max-w-[256px] rounded-3xl shadow-surface">
      <ListBox
        aria-label={t("File actions")}
        className="w-full p-2"
        selectionMode="none"
        onAction={(key) => toast.success(t("Selected item: {key}", {key: String(key)}))}
      >
        <ListBox.Section>
          <Header>{t("Actions")}</Header>
          <ListBox.Item id="new-file" textValue={t("New file")}>
            <div className="flex h-8 items-center justify-center">
              <SquarePlus className="size-4 shrink-0 text-muted" />
            </div>
            <div className="flex flex-col">
              <Label>{t("New file")}</Label>
              <Description>{t("Create a new file")}</Description>
            </div>
            <Kbd className="ms-auto" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>{t("N")}</Kbd.Content>
            </Kbd>
          </ListBox.Item>
          <ListBox.Item id="edit-file" textValue={t("Edit file")}>
            <div className="flex h-8 items-center justify-center">
              <Pencil className="size-4 shrink-0 text-muted" />
            </div>
            <div className="flex flex-col">
              <Label>{t("Edit file")}</Label>
              <Description>{t("Make changes")}</Description>
            </div>
            <Kbd className="ms-auto" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>{t("E")}</Kbd.Content>
            </Kbd>
          </ListBox.Item>
        </ListBox.Section>
        <Separator />
        <ListBox.Section>
          <Header>{t("Danger zone")}</Header>
          <ListBox.Item id="delete-file" textValue={t("Delete file")} variant="danger">
            <div className="flex h-8 items-center justify-center">
              <TrashBin className="size-4 shrink-0 text-danger" />
            </div>
            <div className="flex flex-col">
              <Label>{t("Delete file")}</Label>
              <Description>{t("Move to trash")}</Description>
            </div>
            <Kbd className="ms-auto" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Abbr keyValue="shift" />
              <Kbd.Content>{t("D")}</Kbd.Content>
            </Kbd>
          </ListBox.Item>
        </ListBox.Section>
      </ListBox>
    </Surface>
  );
}

export default WithSections;
