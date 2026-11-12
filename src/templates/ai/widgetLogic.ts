export type WidgetMode = "closed" | "compact" | "tall" | "full";
export type WidgetCorner = "tl" | "tr" | "bl" | "br";

/** One button walks the sizes in order and returns to the launcher. */
export const nextMode: Record<WidgetMode, WidgetMode> = {closed: "compact", compact: "tall", tall: "full", full: "closed"};

/** Nearest viewport corner for the dropped widget's centre. */
export function cornerFor(x: number, y: number, width: number, height: number): WidgetCorner {
  return `${y < height / 2 ? "t" : "b"}${x < width / 2 ? "l" : "r"}` as WidgetCorner;
}
