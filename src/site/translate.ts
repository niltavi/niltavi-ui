import type {Locale} from "./Locale";

/** Translate display copy only; non-string children retain their type and identity. */
export function translate<T>(messages: Record<string, string[]>, locale: Locale, value: T, variables?: Record<string, string | number>): T {
  if (typeof value !== "string") return value;
  const message = messages[value]?.[locale === "en" ? 0 : 1] ?? value;
  return (variables ? message.replace(/\{(\w+)\}/g, (placeholder, key: string) => String(variables[key] ?? placeholder)) : message) as T;
}
