import {EmptyState, Surface} from "@heroui/react";
import {memo, useMemo, useSyncExternalStore, type ReactNode} from "react";
import {useLocale, useText} from "../site/Locale";
import {useCopy} from "./copy";
import {matchesComponent} from "./catalog";
import {components} from "./registry";

/**
 * Date and time examples format with the viewer's locale data and time zone, which the build server can't match.
 * They render after hydration; everything else is in the prerendered HTML.
 */
const clientOnlyComponents = new Set(["date-field", "time-field", "calendar", "range-calendar", "date-picker", "date-range-picker"]);
const subscribe = () => () => {};
function ClientOnly({children}: {children: ReactNode}) {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  return isClient ? children : null;
}

function Showcase({query, isHome = false}: {query: string; isHome?: boolean}) {
  const text = useText();
  const locale = useLocale();
  const t = useCopy();
  // The examples are the expensive part; keep them out of re-renders that only toggle the heading.
  const examples = useMemo(() => {
    const filtered = components.filter((component) => matchesComponent(component, query));
    return filtered.length === 0 ? <EmptyState>{text("No matching components", "没有找到匹配的组件")}</EmptyState> : filtered.map((component) => {
      return <section key={component.id} id={`showcase-${component.id}`} className="showcase-component" aria-labelledby={`showcase-${component.id}-title`}>
        <h2 id={`showcase-${component.id}-title`}>{text(component.name, component.zh)}{locale === "zh-CN" && <span>{component.name}</span>}</h2>
        <div className="showcase-examples" data-wide={component.wide || undefined}>
          {component.examples.map(({name, Component}) => <div key={name} className="showcase-variant">
            <h3>{t(name)}</h3>
            <Surface className="surface--example showcase-example">{clientOnlyComponents.has(component.id) ? <ClientOnly><Component /></ClientOnly> : <Component />}</Surface>
          </div>)}
        </div>
      </section>;
    });
  }, [query, text, t, locale]);

  return <div className="showcase">
    {!isHome && <h1>{text("Components", "组件")}</h1>}
    {examples}
  </div>;
}

export default memo(Showcase);
