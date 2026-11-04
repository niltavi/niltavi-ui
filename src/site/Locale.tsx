import {createContext, useCallback, useContext} from "react";

export type Locale = "en" | "zh-CN";
export const LocaleContext = createContext<Locale>("zh-CN");
export const useLocale = () => useContext(LocaleContext);
export function useText() {
  const locale = useLocale();
  return useCallback((en: string, zh: string) => locale === "en" ? en : zh, [locale]);
}
