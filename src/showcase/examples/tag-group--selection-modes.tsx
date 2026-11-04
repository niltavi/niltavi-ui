// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import type {Key} from "@heroui/react";

import {Description, Label, Tag, TagGroup} from "@heroui/react";
import {useState} from "react";

export function TagGroupSelectionModes() {
  const t = useCopy();
  const [singleSelected, setSingleSelected] = useState<Iterable<Key>>(new Set(["news"]));
  const [multipleSelected, setMultipleSelected] = useState<Iterable<Key>>(
    new Set(["news", "travel"]),
  );

  return (
    <div className="flex flex-col gap-8">
      <TagGroup
        selectedKeys={singleSelected}
        selectionMode="single"
        onSelectionChange={(keys) => setSingleSelected(keys)}
      >
        <Label>{t("Single Selection")}</Label>
        <TagGroup.List>
          <Tag>{t("News")}</Tag>
          <Tag>{t("Travel")}</Tag>
          <Tag>{t("Gaming")}</Tag>
          <Tag>{t("Shopping")}</Tag>
        </TagGroup.List>
        <Description>{t("Choose one category")}</Description>
      </TagGroup>

      <TagGroup
        selectedKeys={multipleSelected}
        selectionMode="multiple"
        onSelectionChange={(keys) => setMultipleSelected(keys)}
      >
        <Label>{t("Multiple Selection")}</Label>
        <TagGroup.List>
          <Tag>{t("News")}</Tag>
          <Tag>{t("Travel")}</Tag>
          <Tag>{t("Gaming")}</Tag>
          <Tag>{t("Shopping")}</Tag>
        </TagGroup.List>
        <Description>{t("Choose multiple categories")}</Description>
      </TagGroup>
    </div>
  );
}

export default TagGroupSelectionModes;
