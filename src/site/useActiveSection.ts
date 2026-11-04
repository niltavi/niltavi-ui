import {useEffect, useState} from "react";
import {getActiveSection, type Page} from "./navigation";

/** Keep directory state tied to rendered headings, including lazy page loads. */
export function useActiveSection(page: Page, ids: string[]) {
  const [active, setActive] = useState("");
  const idKey = ids.join("|");
  useEffect(() => {
    const sections = idKey ? idKey.split("|") : [];
    let frame = 0;
    const update = () => {
      frame = 0;
      const headerBottom = document.querySelector(".preview-header")?.getBoundingClientRect().bottom ?? 0;
      const positions = sections.flatMap((id) => {
        const element = document.getElementById(`${page === "components" ? "showcase" : "palette"}-${id}`);
        return element ? [{id, top: element.getBoundingClientRect().top}] : [];
      });
      setActive(getActiveSection(positions, headerBottom + 32));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, {passive: true});
    window.addEventListener("resize", schedule);
    const observer = new MutationObserver(schedule);
    const main = document.getElementById("main-content");
    if (main) observer.observe(main, {childList: true, subtree: true, characterData: true});
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [page, idKey]);
  return ids.includes(active) ? active : ids[0];
}
