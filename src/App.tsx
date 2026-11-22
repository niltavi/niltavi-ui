import {Palette as PaletteIcon} from "@gravity-ui/icons";
import {ListBox, SearchField, Select, Toast} from "@heroui/react";
import {lazy, startTransition, Suspense, useEffect, useState, type MouseEvent} from "react";
import {I18nProvider} from "react-aria";

import {useActiveSection} from "./site/useActiveSection";
import {paletteSections} from "./site/paletteCatalog";
import {catalog, matchesComponent} from "./showcase/catalog";
import {LocaleContext, useText, type Locale} from "./site/Locale";
import {pages, parseRoute, routeHref, scrollToSection, type Page} from "./site/navigation";
import {editorialContent} from "./site/editorialContent";
import {skillSections} from "./site/skillsContent";
import {templateSections} from "./templates/catalog";
import {ProductFooter, ProductHeader} from "./product/ProductHeader";
import {applyTheme, preferredTheme, saveTheme, systemDarkQuery, themeKey} from "./product/theme";
import {localeFromPath, localizedHref, siteDescriptions, siteOrigin, siteTitles} from "./site/localizedUrls";
import lightLogo from "../docs/assets/niltavi-logo-light.svg";
import darkLogo from "../docs/assets/niltavi-logo-dark.svg";

const Showcase = lazy(() => import("./showcase/Showcase"));
const Palette = lazy(() => import("./site/Palette"));
const Editorial = lazy(() => import("./site/Editorial"));
const Skills = lazy(() => import("./site/Skills"));
const Templates = lazy(() => import("./templates/Templates"));
function Site({locale, changeLocale}: {locale: Locale; changeLocale: (href: string) => void}) {
  const text = useText();
  const [mode, setMode] = useState(preferredTheme);
  const [hash, setHash] = useState(window.location.hash);
  const route = parseRoute(hash);
  const isHome = hash === "";
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onHashChange = () => startTransition(() => { setQuery(""); setHash(window.location.hash); });
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const preference = matchMedia(systemDarkQuery);
    const update = () => {
      const next = preferredTheme();
      applyTheme(next);
      setMode(next);
    };
    const onStorage = (event: StorageEvent) => { if (event.key === themeKey || event.key === null) update(); };
    preference.addEventListener("change", update);
    window.addEventListener("storage", onStorage);
    return () => {
      preference.removeEventListener("change", update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    const page = pages.find((item) => item.id === route.page)!;
    document.title = isHome ? siteTitles[locale] : `${text(page.en, page.zh)} · Niltavi UI`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", siteDescriptions[locale]);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", siteOrigin + localizedHref(locale));
  }, [isHome, locale, route.page, text]);

  const entries = route.page === "components"
    ? catalog.filter((component) => matchesComponent(component, query)).map((component) => ({id: component.id, label: text(component.name, component.zh)}))
    : route.page === "templates"
      ? templateSections.map((section) => ({id: section.id, label: text(section.en, section.zh)}))
    : route.page === "palette"
      ? paletteSections.map((section) => ({id: section.id, label: text(section.en, section.zh)}))
      : (route.page === "skills" ? skillSections : editorialContent[route.page].sections).map((section) => ({id: section.id, label: text(section.title.en, section.title.zh)}));

  const currentSection = useActiveSection(route.page, entries.map((entry) => entry.id));

  const navigate = (page: Page, section = "") => {
    const target = routeHref(page, section);
    if (hash === target) {
      setQuery("");
      scrollToSection(page, section);
    } else {
      window.location.hash = target;
    }
  };

  const navigateLink = (event: MouseEvent<HTMLAnchorElement>, page: Page, section = "") => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate(page, section);
  };

  return <>
    <Toast.Provider />
    <a href="#main-content" className="skip-link" onClick={(event) => {event.preventDefault(); document.getElementById("main-content")?.focus();}}>{text("Skip to content", "跳到内容")}</a>
    <ProductHeader className="preview-header"
      brand={{
        name: "UI", href: localizedHref(locale), symbol: <PaletteIcon width={32} height={32} />,
        onClick: (event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault();
          if (hash) changeLocale(localizedHref(locale));
          window.scrollTo({top: 0});
        },
      }}
      theme={mode}
      onToggleTheme={() => {
        const next = mode === "light" ? "dark" : "light";
        saveTheme(next);
        setMode(next);
      }}
      locale={locale}
      locales={[
        {locale: "en", label: "English", href: localizedHref("en", hash)},
        {locale: "zh-CN", label: "简体中文", href: localizedHref("zh-CN", hash)},
      ]}
      onNavigateLocale={changeLocale}
      githubHref="https://github.com/niltavi/niltavi-ui"
      labels={{light: text("Switch to light theme", "切换浅色主题"), dark: text("Switch to dark theme", "切换深色主题"), language: text("Language", "语言"), github: text("GitHub repository", "GitHub 仓库")}}>
      <nav className="primary-nav" aria-label={text("Main navigation", "主导航")}>
        {pages.map((page) => <a key={page.id} href={routeHref(page.id)} aria-current={!isHome && route.page === page.id ? "page" : undefined} onClick={(event) => navigateLink(event, page.id)}>{text(page.en, page.zh)}</a>)}
      </nav>
    </ProductHeader>
    <div className="site-layout niltavi-container">
      <aside className="site-sidebar">
        {route.page === "components" && <SearchField aria-label={text("Search components", "搜索组件")} className="showcase-search" value={query} onChange={setQuery}>
          <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder={text("Search…", "搜索…")} /><SearchField.ClearButton aria-label={text("Clear search", "清空搜索")} /></SearchField.Group>
        </SearchField>}
        <nav className="toc-links" aria-label={text("On this page", "本页目录")}>
          {entries.map((entry) => <a key={entry.id} href={routeHref(route.page, entry.id)} aria-current={currentSection === entry.id ? "location" : undefined} onClick={(event) => navigateLink(event, route.page, entry.id)}>{entry.label}</a>)}
        </nav>
        <Select placeholder={text("Contents", "目录")} isDisabled={entries.length === 0} className="toc-mobile" aria-label={text("On this page", "本页目录")} value={currentSection ?? null} onChange={(key) => {if (typeof key === "string") navigate(route.page, key);}}>
          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
          <Select.Popover><ListBox>{entries.map((entry) => <ListBox.Item key={entry.id} id={entry.id} textValue={entry.label}>{entry.label}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover>
        </Select>
      </aside>
      <main id="main-content" tabIndex={-1} className="preview-main">
        {isHome && <div className="site-intro">
          <h1>Niltavi UI</h1>
          <p>{siteDescriptions[locale]}</p>
          <a href="/llms.txt">{text("Install with an agent", "让 Agent 安装")}</a>
        </div>}
        <Suspense fallback={<p role="status">{text("Loading examples…", "正在加载示例…")}</p>}>
          {route.page === "components" ? <Showcase query={query} section={route.section} isHome={isHome} /> : route.page === "templates" ? <Templates section={route.section} /> : route.page === "palette" ? <Palette mode={mode} section={route.section} /> : route.page === "skills" ? <Skills section={route.section} /> : <Editorial page={route.page} section={route.section} />}
        </Suspense>
      </main>
    </div>
    <ProductFooter lightLogo={lightLogo} darkLogo={darkLogo} />
  </>;
}

export default function App() {
  const [locale, setLocale] = useState(() => localeFromPath(window.location.pathname));
  const syncLocale = () => startTransition(() => setLocale(localeFromPath(window.location.pathname)));
  useEffect(() => {
    window.addEventListener("popstate", syncLocale);
    return () => window.removeEventListener("popstate", syncLocale);
  }, []);
  const changeLocale = (href: string) => {
    const previousHash = window.location.hash;
    if (href === window.location.pathname + previousHash) return;
    window.history.pushState(null, "", href);
    syncLocale();
    if (window.location.hash !== previousHash) window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  return <LocaleContext.Provider value={locale}><I18nProvider locale={locale}><Site locale={locale} changeLocale={changeLocale} /></I18nProvider></LocaleContext.Provider>;
}
