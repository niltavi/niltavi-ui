// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {toast} from "@heroui/react";
import {Pencil, SquarePlus, TrashBin} from "@gravity-ui/icons";
import {Description, Header, Kbd, Label, ListBox, Separator, Surface} from "@heroui/react";

export function WithSections() {
  return (
    <Surface className="w-full max-w-[256px] rounded-3xl shadow-surface">
      <ListBox
        aria-label="File actions"
        className="w-full p-2"
        selectionMode="none"
        onAction={(key) => toast.success(`Selected item: ${key}`)}
      >
        <ListBox.Section>
          <Header>Actions</Header>
          <ListBox.Item id="new-file" textValue="New file">
            <div className="flex h-8 items-center justify-center">
              <SquarePlus className="size-4 shrink-0 text-muted" />
            </div>
            <div className="flex flex-col">
              <Label>New file</Label>
              <Description>Create a new file</Description>
            </div>
            <Kbd className="ms-auto" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>N</Kbd.Content>
            </Kbd>
          </ListBox.Item>
          <ListBox.Item id="edit-file" textValue="Edit file">
            <div className="flex h-8 items-center justify-center">
              <Pencil className="size-4 shrink-0 text-muted" />
            </div>
            <div className="flex flex-col">
              <Label>Edit file</Label>
              <Description>Make changes</Description>
            </div>
            <Kbd className="ms-auto" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>E</Kbd.Content>
            </Kbd>
          </ListBox.Item>
        </ListBox.Section>
        <Separator />
        <ListBox.Section>
          <Header>Danger zone</Header>
          <ListBox.Item id="delete-file" textValue="Delete file" variant="danger">
            <div className="flex h-8 items-center justify-center">
              <TrashBin className="size-4 shrink-0 text-danger" />
            </div>
            <div className="flex flex-col">
              <Label>Delete file</Label>
              <Description>Move to trash</Description>
            </div>
            <Kbd className="ms-auto" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Abbr keyValue="shift" />
              <Kbd.Content>D</Kbd.Content>
            </Kbd>
          </ListBox.Item>
        </ListBox.Section>
      </ListBox>
    </Surface>
  );
}

export default WithSections;
