export const pages = [
  {id: "components", en: "Components", zh: "组件"},
  {id: "palette", en: "Palette", zh: "色卡"},
  {id: "prompts", en: "Prompts", zh: "提示词"},
  {id: "philosophy", en: "Philosophy", zh: "理念"},
] as const;
export type Page = typeof pages[number]["id"];
export type Route = {page: Page; section: string};

export function parseRoute(hash: string): Route {
  const [page, section = ""] = hash.replace(/^#\/?/, "").split("/");
  const match = pages.find((item) => item.id === page);
  if (!match) return {page: "components", section: ""};
  return {page: match.id, section: /^[a-z0-9-]+$/.test(section) ? section : ""};
}

export function routeHref(page: Page, section = "") {
  return `#/${page}${section ? `/${section}` : ""}`;
}

export function scrollToSection(page: Page, section: string) {
  if (!section) window.scrollTo({top: 0});
  else document.getElementById(sectionId(page, section))?.scrollIntoView({block: "start"});
}

export function sectionId(page: Page, section: string) {
  return `${page === "components" ? "showcase" : page}-${section}`;
}

export function getActiveSection(positions: {id: string; top: number}[], threshold: number) {
  let active = positions[0]?.id ?? "";
  for (const position of positions) {
    if (position.top <= threshold) active = position.id;
    else break;
  }
  return active;
}
