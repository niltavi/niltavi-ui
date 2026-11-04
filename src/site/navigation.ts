export type Page = "components" | "palette";
export type Route = {page: Page; section: string};

export function parseRoute(hash: string): Route {
  const [page, section = ""] = hash.replace(/^#\/?/, "").split("/");
  if (page !== "components" && page !== "palette") return {page: "components", section: ""};
  return {page: page === "palette" ? "palette" : "components", section: /^[a-z0-9-]+$/.test(section) ? section : ""};
}

export function routeHref(page: Page, section = "") {
  return `#/${page}${section ? `/${section}` : ""}`;
}

export function scrollToSection(page: Page, section: string) {
  if (!section) window.scrollTo({top: 0});
  else document.getElementById(`${page === "components" ? "showcase" : "palette"}-${section}`)?.scrollIntoView({block: "start"});
}

export function getActiveSection(positions: {id: string; top: number}[], threshold: number) {
  let active = positions[0]?.id ?? "";
  for (const position of positions) {
    if (position.top <= threshold) active = position.id;
    else break;
  }
  return active;
}
