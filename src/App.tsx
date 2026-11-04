import {Globe, LogoGithub} from "@gravity-ui/icons";
import {Button, Dropdown, Label, Link, ListBox, SearchField, Select, Spinner, Surface, Toast} from "@heroui/react";
import {buttonVariants} from "@heroui/styles";
import {lazy, Suspense, useEffect, useState, type MouseEvent} from "react";
import {I18nProvider} from "react-aria";
import {Link as ButtonLink} from "react-aria-components";

import {useActiveSection} from "./site/useActiveSection";
import {paletteSections} from "./site/paletteCatalog";
import {catalog, matchesComponent} from "./showcase/catalog";
import {LocaleContext, useText, type Locale} from "./site/Locale";
import {pages, parseRoute, routeHref, scrollToSection, type Page} from "./site/navigation";
import {editorialContent} from "./site/editorialContent";

const Showcase = lazy(() => import("./showcase/Showcase"));
const Palette = lazy(() => import("./site/Palette"));
const Editorial = lazy(() => import("./site/Editorial"));
type Mode = "light" | "dark";



function Icon({name}: {name: "sun" | "moon" | "arrow-up"}) {
  return <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {name === "sun" ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : name === "moon" ? <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z" /> : <path d="M12 20V4m-6 6 6-6 6 6" />}
  </svg>;
}

function storedPreference(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function Site({locale, setLocale}: {locale: Locale; setLocale: (locale: Locale) => void}) {
  const text = useText();
  const [mode, setMode] = useState<Mode>(() => {
    const stored = storedPreference("niltavi-mode");
    return stored === "light" || stored === "dark" ? stored : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onHashChange = () => { setQuery(""); setRoute(parseRoute(window.location.hash)); };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
    document.documentElement.dataset.theme = mode;
    try { localStorage.setItem("niltavi-mode", mode); } catch { /* Preferences are optional. */ }
  }, [mode]);

  useEffect(() => {
    document.documentElement.lang = locale;
    const page = pages.find((item) => item.id === route.page)!;
    document.title = `${text(page.en, page.zh)} · Niltavi UI`;
    try { localStorage.setItem("niltavi-locale", locale); } catch { /* Preferences are optional. */ }
  }, [locale, route.page, text]);

  const entries = route.page === "components"
    ? catalog.filter((component) => matchesComponent(component, query)).map((component) => ({id: component.id, label: text(component.name, component.zh)}))
    : route.page === "palette"
      ? paletteSections.map((section) => ({id: section.id, label: text(section.en, section.zh)}))
      : editorialContent[route.page].sections.map((section) => ({id: section.id, label: text(section.title.en, section.title.zh)}));

  const currentSection = useActiveSection(route.page, entries.map((entry) => entry.id));

  const navigate = (page: Page, section = "") => {
    setQuery("");
    window.location.hash = routeHref(page, section);
    if (route.page === page) scrollToSection(page, section);
  };

  const navigateLink = (event: MouseEvent<HTMLAnchorElement>, page: Page, section = "") => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate(page, section);
  };

  return <>
    <Toast.Provider />
    <a href="#main-content" className="skip-link" onClick={(event) => {event.preventDefault(); document.getElementById("main-content")?.focus();}}>{text("Skip to content", "跳到内容")}</a>
    <header id="page-top" tabIndex={-1} className="preview-header">
      <div className="preview-header__inner">
        <a href={routeHref("components")} className="preview-brand" aria-label="Niltavi UI" onClick={(event) => navigateLink(event, "components")}>niltavi<span className="preview-brand__dot">.</span><span className="preview-brand__label">UI</span></a>
        <nav className="primary-nav" aria-label={text("Main navigation", "主导航")}>
          {pages.map((page) => <a key={page.id} href={routeHref(page.id)} aria-current={route.page === page.id ? "page" : undefined} onClick={(event) => navigateLink(event, page.id)}>{text(page.en, page.zh)}</a>)}
        </nav>
        <Surface className="surface--controls preview-controls">
          <ButtonLink className={buttonVariants({isIconOnly: true, size: "sm", variant: "ghost"})} href="https://github.com/niltavi/niltavi-ui" target="_blank" rel="noopener noreferrer" aria-label={text("GitHub repository", "GitHub 仓库")}><LogoGithub aria-hidden="true" width={18} height={18} /></ButtonLink>
          <Dropdown>
            <Button isIconOnly size="sm" variant="ghost" aria-label={text("Language", "语言")}><Globe aria-hidden="true" width={18} height={18} /></Button>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu aria-label={text("Language", "语言")} selectionMode="single" disallowEmptySelection selectedKeys={[locale]} onSelectionChange={(keys) => {const next = [...keys][0]; if (next === "en" || next === "zh-CN") setLocale(next);}}>
                <Dropdown.Item id="zh-CN" textValue="中文"><Label lang="zh-CN">中文</Label><Dropdown.ItemIndicator /></Dropdown.Item>
                <Dropdown.Item id="en" textValue="English"><Label lang="en">English</Label><Dropdown.ItemIndicator /></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
          <Button isIconOnly size="sm" variant="ghost" aria-label={mode === "light" ? text("Dark theme", "切换深色") : text("Light theme", "切换浅色")} onPress={() => setMode(mode === "light" ? "dark" : "light")}><Icon name={mode === "light" ? "moon" : "sun"} /></Button>
        </Surface>
      </div>
    </header>
    <div className="site-layout">
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
        <Suspense fallback={<Spinner aria-label={text("Loading", "加载中")} />}>
          {route.page === "components" ? <Showcase query={query} section={route.section} /> : route.page === "palette" ? <Palette mode={mode} section={route.section} /> : <Editorial page={route.page} section={route.section} />}
        </Suspense>
        <footer className="preview-footer">
          <Link href="https://niltavi.com">niltavi.com</Link>
          <Button isIconOnly variant="ghost" aria-label={text("Back to top", "回到顶部")} onPress={() => {window.scrollTo({top:0}); document.getElementById("page-top")?.focus({preventScroll:true});}}><Icon name="arrow-up" /></Button>
        </footer>
      </main>
    </div>
  </>;
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => storedPreference("niltavi-locale") === "en" ? "en" : "zh-CN");
  return <LocaleContext.Provider value={locale}><I18nProvider locale={locale}><Site locale={locale} setLocale={setLocale} /></I18nProvider></LocaleContext.Provider>;
}
