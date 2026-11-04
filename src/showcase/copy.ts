import {useCallback} from "react";
import {useLocale} from "../site/Locale";
import {translate} from "../site/translate";
import messages from "./messages.json";

export function useCopy() {
  const locale = useLocale();
  return useCallback(<T,>(value: T, variables?: Record<string, string | number>): T => translate(messages, locale, value, variables), [locale]);
}
