// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {Key} from "@heroui/react";

import {CircleXmarkFill} from "@gravity-ui/icons";
import {Description, EmptyState, Label, Tag, TagGroup} from "@heroui/react";
import {useState} from "react";

export function TagGroupWithRemoveButton() {
  const t = useCopy();
  type TagItem = {id: string; name: string};

  const [tags, setTags] = useState<TagItem[]>([
    {id: "news", name: "News"},
    {id: "travel", name: "Travel"},
    {id: "gaming", name: "Gaming"},
    {id: "shopping", name: "Shopping"},
  ]);

  const [frameworks, setFrameworks] = useState<TagItem[]>([
    {id: "react", name: "React"},
    {id: "vue", name: "Vue"},
    {id: "angular", name: "Angular"},
    {id: "svelte", name: "Svelte"},
  ]);

  const onRemoveTags = (keys: Set<Key>) => {
    setTags(tags.filter((tag) => !keys.has(tag.id)));
  };

  const onRemoveFrameworks = (keys: Set<Key>) => {
    setFrameworks(frameworks.filter((framework) => !keys.has(framework.id)));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full max-w-sm">
        <TagGroup selectionMode="single" onRemove={onRemoveTags}>
          <Label>{t("Default Remove Button")}</Label>
          <TagGroup.List
            items={tags}
            renderEmptyState={() => <EmptyState className="p-1">{t("No categories found")}</EmptyState>}
          >
            {(tag) => (
              <Tag key={tag.name} id={tag.id} textValue={t(tag.name)}>
                {t(tag.name)}
              </Tag>
            )}
          </TagGroup.List>
          <Description>{t("Click the X to remove tags")}</Description>
        </TagGroup>
      </div>

      <div className="w-full max-w-md">
        <TagGroup selectionMode="single" onRemove={onRemoveFrameworks}>
          <Label>{t("Custom Remove Button")}</Label>
          <TagGroup.List
            items={frameworks}
            renderEmptyState={() => <EmptyState className="p-1">{t("No frameworks found")}</EmptyState>}
          >
            {(tag) => (
              <Tag key={tag.id} id={tag.id} textValue={t(tag.name)}>
                {(renderProps) => (
                  <>
                    {t(tag.name)}
                    {t(!!renderProps.allowsRemoving && (
                      <Tag.RemoveButton>
                        <CircleXmarkFill />
                      </Tag.RemoveButton>
                    ))}
                  </>
                )}
              </Tag>
            )}
          </TagGroup.List>
          <Description>{t("Custom remove button with icon")}</Description>
        </TagGroup>
      </div>
    </div>
  );
}

export default TagGroupWithRemoveButton;
