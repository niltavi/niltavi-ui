export type ProductTheme = "light" | "dark";

export const themeKey = "niltavi-mode";
export const systemDarkQuery = "(prefers-color-scheme: dark)";

export function preferredTheme(): ProductTheme {
  let saved: string | null = null;
  try { saved = localStorage.getItem(themeKey); } catch { /* Preferences are optional. */ }
  if (saved === "light" || saved === "dark") return saved;
  return matchMedia(systemDarkQuery).matches ? "dark" : "light";
}

export function applyTheme(theme: ProductTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function saveTheme(theme: ProductTheme) {
  applyTheme(theme);
  try { localStorage.setItem(themeKey, theme); } catch { /* Preferences are optional. */ }
}

// Insert before external styles so the first paint uses exactly the same preference.
export const themeInitialization = `(() => {
  const root = document.documentElement;
  let theme;
  try {theme = localStorage.getItem(${JSON.stringify(themeKey)});} catch {}
  if (theme !== "light" && theme !== "dark")
    theme = matchMedia(${JSON.stringify(systemDarkQuery)}).matches ? "dark" : "light";
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();`;
