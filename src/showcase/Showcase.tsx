import {EmptyState, Label, SearchField, Surface} from "@heroui/react";
import {useState} from "react";

import {components} from "./registry";

export default function Showcase() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase().replace(/[\s-]/g, "");
  const filtered = components.filter((component) =>
    `${component.name}${component.keywords}`.toLowerCase().replace(/[\s-]/g, "").includes(search),
  );

  return (
    <div className="showcase">
      <SearchField aria-label="搜索组件" className="showcase-search" value={query} onChange={setQuery}>
        <Label>搜索组件</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Button、Select、Calendar…" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      {filtered.length === 0 ? <EmptyState>没有找到匹配的组件</EmptyState> : filtered.map((component) => (
        <section key={component.id} id={`showcase-${component.id}`} className="showcase-component" aria-labelledby={`showcase-${component.id}-title`}>
          <h3 id={`showcase-${component.id}-title`}>{component.name}</h3>
          <div className="showcase-examples" data-wide={component.wide || undefined}>
            {component.examples.map(({name, Component}) => (
              <div key={name} className="showcase-variant">
                <h4>{name}</h4>
                <Surface className="surface--example showcase-example"><Component /></Surface>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
