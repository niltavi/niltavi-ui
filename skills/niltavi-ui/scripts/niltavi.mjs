#!/usr/bin/env node
// Niltavi UI command line. Zero dependencies; Node 18+.
// Run `node niltavi.mjs help` for the commands.

import {execFileSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";

const REPO_URL = "https://github.com/niltavi/niltavi-ui.git";
const SITE_URL = "https://ui.niltavi.com/";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

const HELP = `niltavi — Niltavi UI tools

Usage: node niltavi.mjs <command> [options]

  source                 Print the Niltavi UI checkout this tool reads from
  init [--dir <path>] [--product] [--force]
                         Copy the theme (and optionally the product shell) into this project
  list                   List templates and component kits
  get <id> [--dest <path>] [--force]
                         Copy a template or kit, with everything it imports, into this project
  example [query]        List showcase examples, or print one by exact name
  tokens [color|motion] [--json]
                         Print the current semantic tokens or motion tokens
  sizes [--json]         Print the recommended layout sizes
  check [paths...] [--json]
                         Check code against the Niltavi rules; exits 1 on errors

Common options:
  --source <dir>         Use this Niltavi UI checkout (or set NILTAVI_UI_DIR)
  --refresh              Update the cached checkout now

Docs: ${SITE_URL}`;

// ---------- Arguments ----------

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) { positional.push(arg); continue; }
    const name = arg.slice(2);
    const next = argv[i + 1];
    if (["dir", "dest", "source"].includes(name) && next !== undefined) { flags[name] = next; i++; } else flags[name] = true;
  }
  return {positional, flags};
}

function fail(message) {
  console.error(`niltavi: ${message}`);
  process.exit(2);
}

// ---------- Source checkout ----------

function isNiltaviRepo(dir) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    return pkg.name === "niltavi-ui" && fs.existsSync(path.join(dir, "src/theme/niltava.css"));
  } catch { return false; }
}

function git(args, cwd) {
  return execFileSync("git", args, {cwd, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8"}).trim();
}

function resolveSource(flags) {
  const explicit = flags.source || process.env.NILTAVI_UI_DIR;
  if (explicit) {
    const dir = path.resolve(explicit);
    if (!isNiltaviRepo(dir)) fail(`${dir} is not a Niltavi UI checkout`);
    return dir;
  }
  for (let dir = process.cwd(); ; dir = path.dirname(dir)) {
    if (isNiltaviRepo(dir)) return dir;
    if (path.dirname(dir) === dir) break;
  }
  const cacheRoot = process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache");
  const dir = path.join(cacheRoot, "niltavi-ui", "repo");
  try {
    if (!fs.existsSync(path.join(dir, ".git"))) {
      fs.mkdirSync(path.dirname(dir), {recursive: true});
      console.error(`niltavi: cloning ${REPO_URL} into ${dir}`);
      git(["clone", "--depth", "1", REPO_URL, dir]);
    } else {
      const stamp = path.join(dir, ".git", "niltavi-fetched");
      const age = fs.existsSync(stamp) ? Date.now() - fs.statSync(stamp).mtimeMs : Infinity;
      if (flags.refresh || age > CACHE_TTL_MS) {
        try {
          git(["fetch", "--depth", "1", "origin", "main"], dir);
          git(["reset", "--hard", "FETCH_HEAD"], dir);
          fs.writeFileSync(stamp, new Date().toISOString());
        } catch (error) {
          console.error(`niltavi: could not update the cache, using the copy from before (${String(error.message).split("\n")[0]})`);
        }
      }
    }
  } catch (error) {
    fail(`could not get Niltavi UI from ${REPO_URL}. Clone it yourself and pass --source <dir>.\n${error.message}`);
  }
  if (!isNiltaviRepo(dir)) fail(`${dir} is not a Niltavi UI checkout; delete it and run again`);
  return dir;
}

function commitOf(dir) {
  try { return git(["rev-parse", "--short", "HEAD"], dir); } catch { return "unknown"; }
}

// ---------- Small file helpers ----------

function copyTree(from, to, {force}) {
  const report = {written: [], same: [], kept: []};
  const walk = (src, dest) => {
    for (const entry of fs.readdirSync(src, {withFileTypes: true})) {
      const s = path.join(src, entry.name);
      const d = path.join(dest, entry.name);
      if (entry.isDirectory()) { walk(s, d); continue; }
      copyFile(s, d, force, report);
    }
  };
  walk(from, to);
  return report;
}

function copyFile(src, dest, force, report) {
  const data = fs.readFileSync(src);
  if (fs.existsSync(dest)) {
    if (Buffer.compare(fs.readFileSync(dest), data) === 0) { report.same.push(dest); return; }
    if (!force) { report.kept.push(dest); return; }
  }
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.writeFileSync(dest, data);
  report.written.push(dest);
}

function writeText(dest, text, force, report) {
  if (fs.existsSync(dest)) {
    if (fs.readFileSync(dest, "utf8") === text) { report.same.push(dest); return; }
    if (!force) { report.kept.push(dest); return; }
  }
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.writeFileSync(dest, text);
  report.written.push(dest);
}

function printReport(report) {
  const rel = (p) => path.relative(process.cwd(), p) || ".";
  for (const p of report.written) console.log(`  wrote      ${rel(p)}`);
  if (report.same.length) console.log(`  unchanged  ${report.same.length} file(s)`);
  for (const p of report.kept) console.log(`  kept       ${rel(p)}  (differs; pass --force to overwrite)`);
}

function projectPackage() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")); } catch { return null; }
}

function installHint(source, names, {dev = false} = {}) {
  const repoPkg = JSON.parse(fs.readFileSync(path.join(source, "package.json"), "utf8"));
  const versions = {...repoPkg.devDependencies, ...repoPkg.dependencies};
  const project = projectPackage();
  const have = project ? {...project.dependencies, ...project.devDependencies} : {};
  const missing = names.filter((name) => !have[name]).map((name) => versions[name] ? `${name}@${versions[name]}` : name);
  if (!missing.length) return null;
  return `npm i ${dev ? "-D " : ""}${missing.join(" ")}`;
}

// ---------- init ----------

function cmdInit(source, flags) {
  const base = flags.dir ? path.resolve(flags.dir) : path.resolve(fs.existsSync("src") ? "src" : ".");
  const themeDest = path.join(base, "theme");
  console.log(`Niltavi UI ${commitOf(source)} → ${path.relative(process.cwd(), themeDest) || "."}`);
  printReport(copyTree(path.join(source, "src/theme"), themeDest, {force: flags.force}));
  if (flags.product) {
    const productDest = path.join(base, "product");
    printReport(copyTree(path.join(source, "src/product"), productDest, {force: flags.force}));
  }

  const steps = [];
  const deps = installHint(source, ["@heroui/react", "@heroui/styles", "@gravity-ui/icons"]);
  const devDeps = installHint(source, ["tailwindcss", "@tailwindcss/vite"], {dev: true});
  if (deps) steps.push(deps);
  if (devDeps) steps.push(devDeps);
  if (!findThemeImport(process.cwd())) {
    const entry = entryStylesheet();
    const tailwind = entry && /@import\s+["']tailwindcss["']/.test(fs.readFileSync(entry, "utf8"));
    steps.push(`Add ${importLine(path.join(themeDest, "index.css"))}${tailwind ? ', replacing @import "tailwindcss" (the theme loads it)' : ""}`);
  }
  const viteConfig = ["vite.config.ts", "vite.config.js", "vite.config.mjs"].find((f) => fs.existsSync(f));
  if (viteConfig && !/@tailwindcss\/vite/.test(fs.readFileSync(viteConfig, "utf8"))) steps.push(`Add tailwindcss() from "@tailwindcss/vite" to the plugins in ${viteConfig}`);
  steps.push(`Dark mode: class="dark" on <html>${flags.product ? "; use preferredTheme/saveTheme from product/theme.ts" : ""}`);
  console.log("\nNext:");
  steps.forEach((step, i) => console.log(`  ${i + 1}. ${step}`));
}

function findThemeImport(root) {
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      if (entry.name.startsWith(".") || ["node_modules", "dist", "build"].includes(entry.name)) continue;
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) { if (!fs.existsSync(path.join(p, "niltava.css"))) stack.push(p); continue; }
      if (/\.(css|scss)$/.test(entry.name) && /@import\s+["'][^"']*theme\/index\.css["']/.test(fs.readFileSync(p, "utf8"))) return p;
    }
  }
  return null;
}

const posix = (p) => p.split(path.sep).join("/");

const ENTRY_CANDIDATES = ["src/index.css", "src/main.css", "src/app.css", "src/styles.css", "src/global.css", "src/globals.css", "app/globals.css", "src/app/globals.css", "styles/globals.css"];

/** The stylesheet that loads the theme, or the most likely entry stylesheet. */
function entryStylesheet() {
  return findThemeImport(process.cwd()) ?? ENTRY_CANDIDATES.map((f) => path.resolve(f)).find((f) => fs.existsSync(f)) ?? null;
}

/** An @import line for target, written relative to the entry stylesheet. */
function importLine(target) {
  const entry = entryStylesheet();
  if (!entry) return `@import "<path to ${posix(path.relative(process.cwd(), target))}>";  in your entry stylesheet`;
  let rel = posix(path.relative(path.dirname(entry), target));
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return `@import "${rel}";  in ${posix(path.relative(process.cwd(), entry))}`;
}

// ---------- Catalog: list and get ----------

function loadCatalog(source) {
  const text = fs.readFileSync(path.join(source, "src/templates/catalog.ts"), "utf8")
    .replace(/\s+as const/g, "")
    .replace(/^export\s+/gm, "");
  return vm.runInNewContext(`${text}\n;({templateSections, componentKits})`, {});
}

function cmdList(source, flags) {
  const {templateSections, componentKits} = loadCatalog(source);
  const rows = [...componentKits.map((item) => ({...item, kind: "kit"})), ...templateSections.map((item) => ({...item, kind: "template"}))];
  if (flags.json) { console.log(JSON.stringify(rows, null, 2)); return; }
  for (const group of [["Component kits", "kit"], ["Templates", "template"]]) {
    console.log(`${group[0]}:`);
    for (const item of rows.filter((row) => row.kind === group[1])) {
      console.log(`  ${item.id.padEnd(16)} ${item.description.en}`);
      console.log(`  ${"".padEnd(16)} uses ${item.uses.join(", ")}`);
    }
    console.log("");
  }
  console.log("Copy one with: node niltavi.mjs get <id>");
}

const CODE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".mjs"];

function resolveImport(fromFile, spec) {
  const clean = spec.split("?")[0];
  const base = path.resolve(path.dirname(fromFile), clean);
  const candidates = [base, ...CODE_EXTENSIONS.map((ext) => base + ext), ...CODE_EXTENSIONS.map((ext) => path.join(base, `index${ext}`))];
  return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile()) ?? null;
}

function importsOf(file) {
  const text = fs.readFileSync(file, "utf8");
  const specs = new Set();
  for (const match of text.matchAll(/(?:import|export)\s[^;]*?from\s+["']([^"']+)["']|import\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g)) {
    specs.add(match[1] ?? match[2] ?? match[3]);
  }
  return [...specs];
}

function packageName(spec) {
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function cssSection(text, section) {
  const marker = `/* ---------- ${section} ---------- */`;
  const start = text.indexOf(marker);
  if (start < 0) return null;
  const next = text.indexOf("/* ---------- ", start + marker.length);
  return text.slice(start, next < 0 ? undefined : next).trimEnd();
}

function cmdGet(source, id, flags) {
  if (!id) fail("get needs an id; run `list` to see them");
  const {templateSections, componentKits} = loadCatalog(source);
  const item = [...componentKits, ...templateSections].find((entry) => entry.id === id);
  if (!item) fail(`no template or kit called "${id}"; run \`list\` to see them`);

  const srcRoot = path.join(source, "src");
  const templatesRoot = path.join(srcRoot, "templates");
  const dest = path.resolve(flags.dest || (fs.existsSync("src") ? "src/niltavi" : "niltavi"));
  const report = {written: [], same: [], kept: []};
  const packages = new Set();
  const queue = [];
  const css = [];

  for (const entry of item.sources) {
    const [file, section] = entry.split("#");
    const abs = path.join(templatesRoot, file);
    if (!fs.existsSync(abs)) fail(`catalog lists ${entry}, which is missing in ${source}`);
    if (/\.css$/.test(file)) {
      const text = fs.readFileSync(abs, "utf8");
      css.push(`/* From src/templates/${entry} */\n${section ? cssSection(text, section) ?? "" : text.trimEnd()}`);
    } else queue.push(abs);
  }

  const seen = new Set();
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    copyFile(file, path.join(dest, path.relative(srcRoot, file)), flags.force, report);
    if (!CODE_EXTENSIONS.includes(path.extname(file))) continue;
    for (const spec of importsOf(file)) {
      if (spec.startsWith(".")) {
        const target = resolveImport(file, spec);
        if (!target) { console.error(`niltavi: cannot resolve ${spec} from ${path.relative(source, file)}`); continue; }
        if (/\.css$/.test(target)) continue;
        queue.push(target);
      } else if (!spec.startsWith("node:")) packages.add(packageName(spec));
    }
  }

  const cssFile = path.join(dest, "styles", `${id}.css`);
  if (css.length) writeText(cssFile, `/* ${item.en}, from Niltavi UI ${commitOf(source)}. Import once after the theme. */\n\n${css.join("\n\n")}\n`, flags.force, report);

  console.log(`${item.en} (${id}) from Niltavi UI ${commitOf(source)}:`);
  printReport(report);
  const entryFiles = item.sources.filter((s) => !/\.css/.test(s)).map((s) => posix(path.relative(process.cwd(), path.join(dest, "templates", s))));
  console.log("\nNext:");
  const steps = [];
  const install = installHint(source, [...packages].filter((name) => name !== "react" && name !== "react-dom").sort());
  if (install) steps.push(install);
  if (css.length) steps.push(`Add ${importLine(cssFile)}, after the theme import`);
  steps.push(`Start from ${entryFiles[0]}. Replace the sample content; keep the structure, classes, and tokens.`);
  steps.push("Text goes through useText()(en, zh) from site/Locale.tsx, which defaults to Chinese. Wrap the app in <LocaleContext.Provider value=\"en\"> for English, or swap in your own i18n.");
  steps.forEach((step, i) => console.log(`  ${i + 1}. ${step}`));
}

// ---------- example ----------

function cmdExample(source, query) {
  const dir = path.join(source, "src/showcase/examples");
  const names = fs.readdirSync(dir).filter((f) => f.endsWith(".tsx")).map((f) => f.slice(0, -4)).sort();
  const exact = query && names.find((name) => name === query || `${name}.tsx` === query);
  if (exact) { process.stdout.write(fs.readFileSync(path.join(dir, `${exact}.tsx`), "utf8")); return; }
  const needle = (query ?? "").toLowerCase().replace(/\s+/g, "-");
  const matches = names.filter((name) => name.includes(needle)).sort((a, b) => Number(!a.startsWith(needle)) - Number(!b.startsWith(needle)) || a.localeCompare(b));
  if (!matches.length) fail(`no example matches "${query}"; run \`example\` to see them all`);
  for (const name of matches) console.log(name);
  console.log(`\nPrint one with: node niltavi.mjs example ${matches[0]}`);
}

// ---------- tokens ----------

function cssBlock(text, selectorStart) {
  const start = text.indexOf(selectorStart);
  if (start < 0) return "";
  const open = text.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return text.slice(open + 1, i);
  }
  return "";
}

function declarations(block) {
  const map = new Map();
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) map.set(match[1], match[2].trim());
  return map;
}

function cmdTokens(source, what, flags) {
  if (what === "motion") {
    const text = fs.readFileSync(path.join(source, "src/theme/motion.css"), "utf8");
    const tokens = Object.fromEntries(declarations(cssBlock(text, ":root")));
    const classes = [...new Set([...text.matchAll(/\.(nt-[\w-]+)/g)].map((m) => m[1]))];
    if (flags.json) { console.log(JSON.stringify({tokens, classes}, null, 2)); return; }
    for (const [name, value] of Object.entries(tokens)) console.log(`${name.padEnd(22)} ${value}`);
    console.log(`\nClasses: ${classes.join(", ")}`);
    console.log("Stagger siblings with style={{\"--i\": index}}. All of it stops under prefers-reduced-motion.");
    return;
  }
  const text = fs.readFileSync(path.join(source, "src/theme/niltava.css"), "utf8");
  const light = declarations(cssBlock(text, '[data-theme="light"]'));
  const dark = declarations(cssBlock(text, '[data-theme="dark"]'));
  const rows = [...light.keys()].map((name) => ({token: name.slice(2), light: light.get(name), dark: dark.get(name) ?? ""}));
  if (flags.json) { console.log(JSON.stringify(rows, null, 2)); return; }
  console.log("Use as Tailwind utilities (bg-surface, text-muted, border-border) or var(--token).\n");
  for (const row of rows) console.log(`${row.token.padEnd(26)} ${shorten(row.light)}  |  ${shorten(row.dark)}`);
}

const shorten = (value) => value.replace(/color-mix\(in oklab, /g, "mix(").replace(/var\(--color-([\w-]+)\)/g, "$1").replace(/var\(--([\w-]+)\)/g, "$1").padEnd(44);

// ---------- sizes ----------

const SIZES = [
  ["Product / site header", "60px tall, full width, separator line below. Use ProductHeader. Brand mark 40px, wordmark 20px / 500"],
  ["Header controls", "Right edge: theme, language, GitHub. 32px ghost icon buttons, 18px icons, 4px gaps"],
  ["App top bar", "56px, 20px side padding, separator line below"],
  ["Sidebar", "240px; 60px icon rail when collapsed; 13px items with 7×10px padding; 40px workspace/account buttons; surface-secondary"],
  ["Mobile bottom tabs", "3–5 tabs, icon over an 11px label, 8px vertical padding, separator above, + env(safe-area-inset-bottom)"],
  ["Floating toolbar", "overlay background, --overlay-shadow, 4px padding, radius calc(var(--radius) * 2.5)"],
  ["Breakpoints", "<900px sidebar → icon rail; <600px top bar + drawer + bottom tabs, one column"],
  ["Page width", ".niltavi-container: 540/720/960/1140/1320px at 576/768/992/1200/1400px; 16px side padding; works at 320px"],
  ["Reading width", "60–75 characters per line"],
  ["Icons", "@gravity-ui/icons; 16px inline and in buttons, 18px in header controls"],
  ["Touch targets", "≥ 44×44px on touch screens"],
  ["Spacing", "multiples of --spacing (4px): 8, 12, 16, 24, 32, 40"],
  ["Radius", "--radius (8px) surfaces, --field-radius (12px) fields"],
  ["Type", "DM Sans 400–600; Chinese line height ≈1.75 body, ≈1.5 UI; serif only for editorial headings"],
];

function cmdSizes(flags) {
  if (flags.json) { console.log(JSON.stringify(Object.fromEntries(SIZES), null, 2)); return; }
  for (const [name, value] of SIZES) console.log(`${name.padEnd(22)} ${value}`);
}

// ---------- check ----------

const TAILWIND_DEFAULT_COLORS = "gray|zinc|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|purple|fuchsia|pink|rose|black|white";
const NILTAVI_SCALES = "niltava|rufous|leaf|gold|berry|glossy|slate|stone|sage|throat|violet";
const COLOR_UTILITY = "bg|text|border|border-[trblxyse]|ring|ring-offset|outline|fill|stroke|from|via|to|divide|decoration|shadow|accent|caret|placeholder";
const FOREIGN_ICONS = /^(lucide-react|react-icons(\/.*)?|@heroicons\/.*|@tabler\/icons-react|@mui\/icons-material.*|@phosphor-icons\/.*|react-feather|@fortawesome\/.*|@radix-ui\/react-icons|@iconify\/react)$/;

/** Each rule returns problems for one file: {line, col, rule, severity, message}. */
const RULES = [
  {
    id: "color-literal", severity: "error",
    message: "Hard-coded color. Use a semantic token (run `tokens`), or define a custom property in your theme layer.",
    test(file, lines) {
      const out = [];
      const fn = /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/g;
      const hex = /(^|[\s"'`(:,\[=])#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/gi;
      lines.forEach((line, i) => {
        if (/^\s*(\/\/|\/\*|\*)/.test(line)) return; // comments
        // Defining a custom property (`--brand: #123456`) is the allowed way to add a color.
        const definesToken = (index) => file.isCss && /^\s*--[\w-]+\s*:/.test(line.slice(Math.max(line.lastIndexOf(";", index), line.lastIndexOf("{", index)) + 1));
        fn.lastIndex = 0;
        let m;
        while ((m = fn.exec(line))) if (!line.startsWith("${", m.index + m[0].length) && !definesToken(m.index)) out.push({line: i + 1, col: m.index + 1});
        hex.lastIndex = 0;
        while ((m = hex.exec(line))) {
          if (/^\d{3,5}$/.test(m[2]) || definesToken(m.index)) continue; // "#3201" is an order number, not a color
          out.push({line: i + 1, col: m.index + m[1].length + 1});
        }
      });
      return out;
    },
  },
  {
    id: "tailwind-palette", severity: "error",
    message: "Tailwind's default palette is not part of the theme. Use a semantic utility such as bg-surface, text-muted, text-danger.",
    test(file, lines) {
      const re = new RegExp(`(?<![\\w-])(?:[\\w-]+:)*(?:${COLOR_UTILITY})-(?:${TAILWIND_DEFAULT_COLORS})(?:-\\d{2,3})?(?:\\/\\d+)?(?![\\w-])`, "g");
      return matchAll(lines, re);
    },
  },
  {
    id: "heroui-v2", severity: "error",
    message: "HeroUI v2 / NextUI API. Niltavi UI uses HeroUI v3: no provider, compound components, @heroui/react + @heroui/styles.",
    test(file, lines) { return matchAll(lines, /HeroUIProvider|NextUIProvider|@heroui\/(system|theme)\b|@nextui-org\//g); },
  },
  {
    id: "icon-set", severity: "error",
    message: "Icons come from @gravity-ui/icons only, so every icon shares one style.",
    test(file, lines) {
      const out = [];
      lines.forEach((line, i) => {
        for (const m of line.matchAll(/from\s+["']([^"']+)["']/g)) if (FOREIGN_ICONS.test(m[1])) out.push({line: i + 1, col: m.index + 1});
      });
      return out;
    },
  },
  {
    id: "icon-button-label", severity: "error",
    message: "Icon-only button without aria-label. Add aria-label (and a Tooltip on desktop).",
    test(file, lines, text) {
      const out = [];
      for (const tag of jsxTags(text, /^(Button|ToggleButton)$/)) {
        if (/\bisIconOnly\b/.test(tag.text) && !/\baria-label(ledby)?\s*=/.test(tag.text)) out.push(position(text, tag.index));
      }
      return out;
    },
  },
  {
    id: "on-click", severity: "warn",
    message: "HeroUI components take onPress, not onClick.",
    test(file, lines, text) {
      if (!/from\s+["']@heroui\/react["']/.test(text)) return [];
      const out = [];
      // Links with an href may still intercept the native click; buttons and other controls take onPress.
      for (const tag of jsxTags(text, /^[A-Z][\w.]*$/)) {
        if (/\bonClick\s*=/.test(tag.text) && !/\bhref\s*=/.test(tag.text) && heroImports(text).has(tag.name.split(".")[0])) out.push(position(text, tag.index));
      }
      return out;
    },
  },
  {
    id: "primitive-color", severity: "warn",
    message: "Palette primitive in a component. Prefer a semantic token; primitives are for illustration and charts.",
    test(file, lines) {
      const re = new RegExp(`(?<![\\w-])(?:[\\w-]+:)*(?:${COLOR_UTILITY})-(?:${NILTAVI_SCALES})-\\d{2,3}(?![\\w-])|var\\(--color-(?:${NILTAVI_SCALES})-\\d+\\)`, "g");
      return matchAll(lines, re);
    },
  },
  {
    id: "shadow", severity: "warn",
    message: "Drop shadow. Elevation in Niltavi is the 1px ring: var(--surface-shadow) or var(--overlay-shadow).",
    test(file, lines) {
      const out = matchAll(lines, /(?<![\w-])(?:[\w-]+:)*(?:drop-)?shadow-(?:sm|md|lg|xl|2xl)(?![\w-])/g);
      lines.forEach((line, i) => {
        for (const m of line.matchAll(/box-shadow\s*:\s*([^;}]+)/g)) if (hasBlur(m[1])) out.push({line: i + 1, col: m.index + 1});
      });
      return out;
    },
  },
  {
    id: "decoration", severity: "warn",
    message: "Gradient, glass, or blur. Niltavi surfaces are flat; keep these for illustration only.",
    test(file, lines) { return matchAll(lines, /bg-gradient-to-|bg-linear-|(?<![\w-])linear-gradient\(|radial-gradient\(|backdrop-blur|backdrop-filter\s*:/g); },
  },
  {
    id: "motion", severity: "warn",
    message: "Motion outside the Niltavi range. Animate opacity/transform for 150–320ms; use --motion-* tokens.",
    test(file, lines) {
      const out = [];
      lines.forEach((line, i) => {
        const layout = /transition(?:-property)?\s*:[^;]*\b(width|height|top|left|right|bottom|margin[\w-]*|padding[\w-]*)\b/.exec(line);
        if (layout && !/--motion-slow/.test(line)) out.push({line: i + 1, col: layout.index + 1});
        for (const m of line.matchAll(/(?:transition|animation)[\w-]*\s*:[^;]*?\b(\d+(?:\.\d+)?)(ms|s)\b/g)) {
          const ms = m[2] === "s" ? Number(m[1]) * 1000 : Number(m[1]);
          if (ms > 400 && !/infinite/.test(line)) out.push({line: i + 1, col: m.index + 1});
        }
        for (const m of line.matchAll(/(?<![\w-])duration-(\d+)(?![\w-])/g)) if (Number(m[1]) > 400) out.push({line: i + 1, col: m.index + 1});
      });
      return out;
    },
  },
  {
    id: "framer-motion", severity: "warn",
    message: "HeroUI v3 animates with CSS. Use the theme's .nt-* classes and --motion-* tokens instead of framer-motion.",
    test(file, lines) { return matchAll(lines, /from\s+["'](framer-motion|motion\/react)["']/g); },
  },
  {
    id: "single-primary", severity: "warn",
    message: "More than one primary button in this file. Keep one primary action per view.",
    test(file, lines, text) {
      const hits = [...jsxTags(text, /^Button$/)].filter((tag) => /\bvariant\s*=\s*(["'])primary\1|\bvariant\s*=\s*\{\s*(["'])primary\2\s*\}/.test(tag.text));
      return hits.length > 1 ? hits.slice(1).map((tag) => position(text, tag.index)) : [];
    },
  },
  {
    id: "single-rufous", severity: "warn",
    message: "More than one rufous element in this file. Rufous appears at most once per screen.",
    test(file, lines, text) {
      const hits = [...text.matchAll(/(button|chip)--rufous/g)];
      return hits.length > 1 ? hits.slice(1).map((m) => position(text, m.index)) : [];
    },
  },
];

/** True when any shadow in a box-shadow list has a blur radius, i.e. it is a drop shadow, not a ring. */
function hasBlur(value) {
  const shadows = [];
  let depth = 0, current = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { shadows.push(current); current = ""; } else current += ch;
  }
  shadows.push(current);
  return shadows.some((shadow) => {
    const lengths = shadow.replace(/[a-z-]+\([^()]*(\([^()]*\)[^()]*)*\)/gi, " ").split(/\s+/).filter((t) => /^-?\d*\.?\d+(px|rem|em)?$/.test(t));
    return lengths.length >= 3 && parseFloat(lengths[2]) > 0;
  });
}

function matchAll(lines, re) {
  const out = [];
  lines.forEach((line, i) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(line))) { out.push({line: i + 1, col: m.index + 1}); if (!re.global) break; }
  });
  return out;
}

function position(text, index) {
  const before = text.slice(0, index);
  const line = before.split("\n").length;
  return {line, col: index - before.lastIndexOf("\n")};
}

/** Opening JSX tags, scanned with brace depth so arrow functions in props don't end the tag. */
function* jsxTags(text, namePattern) {
  const re = /<([A-Za-z][\w.]*)/g;
  let m;
  while ((m = re.exec(text))) {
    if (!namePattern.test(m[1])) continue;
    let depth = 0, quote = null, i = re.lastIndex;
    for (; i < text.length; i++) {
      const ch = text[i];
      if (quote) { if (ch === quote && text[i - 1] !== "\\") quote = null; continue; }
      if (ch === '"' || ch === "'" || ch === "`") quote = ch;
      else if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (ch === ">" && depth === 0) break;
    }
    yield {name: m[1], index: m.index, text: text.slice(m.index, i + 1)};
  }
}

function heroImports(text) {
  const names = new Set();
  for (const m of text.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']@heroui\/react["']/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.replace(/^type\s+/, "");
      if (name) names.add(name);
    }
  }
  return names;
}

function ignoredRules(lines, index) {
  const result = new Set();
  for (const line of [lines[index], lines[index - 1]]) {
    if (!line) continue;
    const m = /niltavi-ignore(?!-file)(?:\s+([\w-]+(?:\s*,\s*[\w-]+)*))?/.exec(line);
    if (m) (m[1] ? m[1].split(/\s*,\s*/) : ["*"]).forEach((rule) => result.add(rule));
  }
  return result;
}

const CHECK_EXTENSIONS = /\.(tsx|jsx|ts|js|mjs|vue|svelte|astro|css|scss|html)$/;
const SKIP_DIRS = new Set(["node_modules", "dist", "build", "out", ".next", ".nuxt", ".svelte-kit", "coverage", "vendor"]);

function collectFiles(paths) {
  const files = [];
  const visit = (p) => {
    if (!fs.existsSync(p)) fail(`no such path: ${p}`);
    const stat = fs.statSync(p);
    if (stat.isFile()) { if (CHECK_EXTENSIONS.test(p)) files.push(p); return; }
    // The copied theme defines the palette; it is the one place literals belong.
    if (fs.existsSync(path.join(p, "niltava.css"))) return;
    for (const entry of fs.readdirSync(p, {withFileTypes: true})) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
      visit(path.join(p, entry.name));
    }
  };
  paths.forEach(visit);
  return files;
}

function checkFile(file) {
  const text = fs.readFileSync(file, "utf8");
  if (/niltavi-ignore-file/.test(text)) return [];
  const lines = text.split("\n");
  const ctx = {path: file, isCss: /\.(css|scss)$/.test(file)};
  const problems = [];
  for (const rule of RULES) {
    for (const hit of rule.test(ctx, lines, text)) {
      const ignored = ignoredRules(lines, hit.line - 1);
      if (ignored.has("*") || ignored.has(rule.id)) continue;
      problems.push({file, line: hit.line, col: hit.col, rule: rule.id, severity: rule.severity, message: rule.message});
    }
  }
  return problems;
}

function cmdCheck(paths, flags) {
  const targets = paths.length ? paths : [fs.existsSync("src") ? "src" : "."];
  const files = collectFiles(targets);
  const problems = files.flatMap(checkFile).sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.col - b.col);
  const errors = problems.filter((p) => p.severity === "error").length;
  if (flags.json) {
    console.log(JSON.stringify({files: files.length, errors, warnings: problems.length - errors, problems}, null, 2));
  } else {
    for (const p of problems) console.log(`${posix(path.relative(process.cwd(), p.file))}:${p.line}:${p.col}  ${p.severity.padEnd(5)}  ${p.rule}  ${p.message}`);
    if (problems.length) console.log("");
    console.log(`${files.length} file(s) checked: ${errors} error(s), ${problems.length - errors} warning(s).`);
    if (problems.length) console.log("Fix errors. Warnings are advice: change them, or keep them on purpose with a `niltavi-ignore <rule>` comment on the line or the line above.");
  }
  process.exitCode = errors ? 1 : 0;
}

// ---------- main ----------

const {positional, flags} = parseArgs(process.argv.slice(2));
const [command, ...rest] = positional;

switch (command) {
  case "source": { const dir = resolveSource(flags); console.log(`${dir}\ncommit ${commitOf(dir)}`); break; }
  case "init": cmdInit(resolveSource(flags), flags); break;
  case "list": cmdList(resolveSource(flags), flags); break;
  case "get": cmdGet(resolveSource(flags), rest[0], flags); break;
  case "example": cmdExample(resolveSource(flags), rest[0]); break;
  case "tokens": cmdTokens(resolveSource(flags), rest[0], flags); break;
  case "sizes": cmdSizes(flags); break;
  case "check": cmdCheck(rest, flags); break;
  case undefined: case "help": case "-h": console.log(HELP); break;
  default: fail(`unknown command "${command}"\n\n${HELP}`);
}

