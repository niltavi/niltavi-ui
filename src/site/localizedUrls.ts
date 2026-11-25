import type {Locale} from "./Locale";

export const siteOrigin = "https://ui.niltavi.com";
export const siteTitles = {en: "Niltavi UI · Components and templates", "zh-CN": "Niltavi UI · 组件与模板"};
export const siteDescriptions = {
  en: "A shared theme, components, and templates for Niltavi products.",
  "zh-CN": "Niltavi 产品共用的主题、组件和模板。",
};

export function localeFromPath(pathname: string): Locale {
  return pathname === "/zh/" || pathname === "/zh" ? "zh-CN" : "en";
}

export function localizedHref(locale: Locale, hash = "") {
  return `${locale === "zh-CN" ? "/zh/" : "/"}${hash}`;
}
