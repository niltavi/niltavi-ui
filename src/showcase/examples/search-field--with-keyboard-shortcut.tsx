// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Description, Kbd, Label, SearchField} from "@heroui/react";
import React from "react";

export function WithKeyboardShortcut() {
  const t = useCopy();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Shift+S
      if (e.shiftKey && e.key === "S" && !e.metaKey && !e.ctrlKey && !e.altKey
        && !(e.target instanceof HTMLElement && e.target.closest('input, textarea, [contenteditable="true"]'))) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Check for ESC key to blur the input
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    // Add global event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SearchField name="search" value={value} onChange={setValue}>
          <Label>{t("Search")}</Label>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input ref={inputRef} className="w-[280px]" placeholder={t("Search...")} />
            <SearchField.ClearButton />
          </SearchField.Group>
          <Description>{t("Use keyboard shortcut to quickly focus this field")}</Description>
        </SearchField>
      </div>
      <div className="text-muted flex items-center gap-2 text-sm">
        <span>{t("Press")}</span>
        <Kbd>
          <Kbd.Abbr keyValue="shift" />
          <Kbd.Content>{t("S")}</Kbd.Content>
        </Kbd>
        <span>{t("to focus the search field")}</span>
      </div>
    </div>
  );
}

export default WithKeyboardShortcut;
