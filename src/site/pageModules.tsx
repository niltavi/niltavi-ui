import {lazy, type ComponentProps, type ComponentType} from "react";
import type {Page} from "./navigation";

/**
 * A code-split page that renders synchronously once its chunk has loaded.
 * React.lazy suspends on first render even when the import has already resolved,
 * so a loaded module is rendered directly and lazy only covers a cold load.
 */
function pageModule<T extends ComponentType<any>>(load: () => Promise<{default: T}>) {
  let loaded: T | undefined;
  let pending: Promise<unknown> | undefined;
  const preload = () => pending ??= load().then(
    (module) => { loaded = module.default; },
    (error) => { pending = undefined; throw error; },
  );
  const Lazy = lazy(() => preload().then(() => ({default: loaded!})));
  function PageComponent(props: ComponentProps<T>) {
    const Component = (loaded ?? Lazy) as ComponentType<ComponentProps<T>>;
    return <Component {...props} />;
  }
  return Object.assign(PageComponent, {preload});
}

export const Showcase = pageModule(() => import("../showcase/Showcase"));
export const Templates = pageModule(() => import("../templates/Templates"));
export const Palette = pageModule(() => import("./Palette"));
export const Skills = pageModule(() => import("./Skills"));
export const Editorial = pageModule(() => import("./Editorial"));

const modules: Record<Page, {preload: () => Promise<unknown>}> = {
  components: Showcase,
  templates: Templates,
  palette: Palette,
  skills: Skills,
  philosophy: Editorial,
};

/** Load the page in the URL first, then warm every other page so later visits render at once. */
export function preloadPages(current: Page) {
  const first = modules[current].preload();
  first.then(() => {
    const rest = () => { for (const module of Object.values(modules)) void module.preload(); };
    if ("requestIdleCallback" in window) requestIdleCallback(rest, {timeout: 2000});
    else setTimeout(rest, 200);
  }, () => {});
  return first;
}
