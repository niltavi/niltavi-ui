// Kept free of React so the site tests can load it directly.

/** Reads one string literal ("…", '…' or `…${…}…`) starting at `start`; returns the index after it. */
function readLiteral(source: string, start: number): number {
  const quote = source[start];
  if (quote !== '"' && quote !== "'" && quote !== "`") return -1;
  let i = start + 1;
  while (i < source.length) {
    const char = source[i];
    if (char === "\\") { i += 2; continue; }
    if (char === quote) return i + 1;
    if (quote === "`" && char === "$" && source[i + 1] === "{") {
      let depth = 1;
      i += 2;
      while (i < source.length && depth > 0) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") depth--;
        else if (source[i] === '"' || source[i] === "'" || source[i] === "`") { const end = readLiteral(source, i); if (end < 0) return -1; i = end; continue; }
        i++;
      }
      continue;
    }
    if (char === "\n" && quote !== "`") return -1;
    i++;
  }
  return -1;
}

const skipSpace = (source: string, i: number) => { while (/\s/.test(source[i] ?? "")) i++; return i; };

/**
 * Shows the source as the reader sees the component: every `text("English", "中文")`
 * with two literal arguments becomes the literal for `locale`. Calls with data
 * arguments, such as `text(item.en, item.zh)`, stay as they are.
 */
export function localizeSource(source: string, locale: "en" | "zh-CN"): string {
  let out = "";
  let last = 0;
  const call = /(?<![\w$.])text\(/g;
  for (let match = call.exec(source); match; match = call.exec(source)) {
    const firstStart = skipSpace(source, match.index + match[0].length);
    const firstEnd = readLiteral(source, firstStart);
    if (firstEnd < 0) continue;
    const comma = skipSpace(source, firstEnd);
    if (source[comma] !== ",") continue;
    const secondStart = skipSpace(source, comma + 1);
    const secondEnd = readLiteral(source, secondStart);
    if (secondEnd < 0) continue;
    const close = skipSpace(source, secondEnd);
    if (source[close] !== ")") continue;
    const literal = locale === "en" ? source.slice(firstStart, firstEnd) : source.slice(secondStart, secondEnd);
    out += source.slice(last, match.index) + literal;
    last = close + 1;
    call.lastIndex = last;
  }
  out += source.slice(last);

  // Plain literals read better without the braces: label={"Home"} → label="Home", >{"Home"}< → >Home<.
  out = out.replace(/=\{("[^"\\\n]*")\}/g, "=$1").replace(/>\{"([^"\\\n{}<>]*)"\}(?=<|\n|\{)/g, ">$1");

  // Drop the hook once nothing else uses it (calls, dependency lists, props).
  const noCalls = !/(?<![\w$.])text\(/.test(out);
  const withoutHook = noCalls
    ? out.replace(/^[ \t]*const text = useText\(\);\n/gm, "").replace(/\[text\]/g, "[]").replace(/, text\]/g, "]").replace(/\[text, /g, "[")
    : out;
  if (noCalls && !/(?<![\w$.\-"'`])text(?![\w$:\-])/.test(withoutHook)) {
    out = withoutHook
      .replace(/^import \{useText\} from "[^"]+";\n/m, "")
      .replace(/^import \{([^}]*)\} from ("[^"]*Locale");$/m, (line, names: string, from: string) => {
        const rest = names.split(",").map((name) => name.trim()).filter((name) => name && name !== "useText");
        return rest.length === names.split(",").length ? line : `import {${rest.join(", ")}} from ${from};`;
      });
  }
  return out;
}
