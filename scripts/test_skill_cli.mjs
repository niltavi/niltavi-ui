import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {fileURLToPath} from "node:url";
import zlib from "node:zlib";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(repo, "skills/niltavi-ui/scripts/niltavi.mjs");

function run(args, cwd = repo) {
  const result = spawnSync(process.execPath, [cli, ...args, "--source", repo], {cwd, encoding: "utf8"});
  return {code: result.status, out: result.stdout, err: result.stderr};
}

function project(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "niltavi-cli-"));
  for (const [name, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), {recursive: true});
    fs.writeFileSync(path.join(dir, name), text);
  }
  return dir;
}

function check(files) {
  const dir = project(files);
  const {code, out} = run(["check", ".", "--json"], dir);
  const report = JSON.parse(out);
  return {code, rules: report.problems.map((p) => `${p.file.split(path.sep).pop()}:${p.line} ${p.rule}`)};
}

test("check reports hard rules as errors and exits 1", () => {
  const {code, rules} = check({
    "a.tsx": [
      'import {Button} from "@heroui/react";',
      'import {Search} from "lucide-react";',
      'export const A = () => <div className="bg-blue-500 text-[#1a2b3c]">',
      '  <Button isIconOnly variant="ghost" onPress={() => go(() => 1)}><Search /></Button>',
      '</div>;',
    ].join("\n"),
    "b.css": ".x { color: rgb(1 2 3); }\n",
    "c.tsx": 'import {HeroUIProvider} from "@heroui/react";\n',
  });
  assert.equal(code, 1);
  assert.deepEqual(rules.sort(), [
    "a.tsx:2 icon-set",
    "a.tsx:3 color-literal",
    "a.tsx:3 tailwind-palette",
    "a.tsx:4 icon-button-label",
    "b.css:1 color-literal",
    "c.tsx:1 heroui-v2",
  ]);
});

test("check accepts tokens, rings, links, data, and ignore comments", () => {
  const {code, rules} = check({
    "ok.tsx": [
      'import {Button, Link} from "@heroui/react";',
      'const orders = [{id: "#3201"}];',
      'export const A = () => <div className="bg-surface text-muted border-border">',
      '  <Button isIconOnly aria-label="Search" variant="ghost" />',
      '  <Link href="#" onClick={(e) => e.preventDefault()}>Back</Link>',
      '  {/* niltavi-ignore color-literal */}',
      '  <span style={{color: "#ff0000"}} />',
      '</div>;',
    ].join("\n"),
    "ok.css": [
      ":root { --brand: #123456; }",
      ".ring { box-shadow: 0 0 0 1px var(--border), inset 0 0 0 3px var(--surface); }",
      ".slide { transition: width var(--motion-slow) var(--motion-ease-fluid); }",
    ].join("\n"),
    "theme/niltava.css": ".x { color: #fff; }\n",
    "data.ts": "// niltavi-ignore-file\nexport const swatches = ['#ff0000'];\n",
  });
  assert.equal(code, 0);
  assert.deepEqual(rules, []);
});

test("check reports soft rules as warnings without failing", () => {
  const {code, rules} = check({
    "w.tsx": [
      'import {Button} from "@heroui/react";',
      'export const A = () => <>',
      '  <Button variant="primary" onClick={save}>Save</Button>',
      '  <Button variant="primary">Publish</Button>',
      '  <div className="shadow-lg bg-niltava-600 backdrop-blur" />',
      '</>;',
    ].join("\n"),
    "w.css": ".card { box-shadow: 0 10px 28px -8px var(--border); transition: height 200ms; }\n",
  });
  assert.equal(code, 0);
  assert.deepEqual(rules.sort(), [
    "w.css:1 motion",
    "w.css:1 shadow",
    "w.tsx:3 on-click",
    "w.tsx:4 single-primary",
    "w.tsx:5 decoration",
    "w.tsx:5 primitive-color",
    "w.tsx:5 shadow",
  ]);
});

test("the kits and templates that get copies carry no errors", () => {
  const {code, out} = run(["check", "src/templates", "--json"]);
  assert.equal(JSON.parse(out).errors, 0, out);
  assert.equal(code, 0);
});

test("list, tokens, sizes, and example read the current repository", () => {
  const list = run(["list", "--json"]);
  const ids = JSON.parse(list.out).map((item) => item.id);
  assert.ok(ids.includes("kit-sidebar") && ids.includes("dashboard"));

  const tokens = JSON.parse(run(["tokens", "--json"]).out);
  const accent = tokens.find((row) => row.token === "accent");
  assert.ok(accent.light.includes("niltava") && accent.dark.includes("niltava"));

  const motion = JSON.parse(run(["tokens", "motion", "--json"]).out);
  assert.equal(motion.tokens["--motion-base"], "220ms");
  assert.ok(motion.classes.includes("nt-fade-up"));

  assert.ok(JSON.parse(run(["sizes", "--json"]).out)["Product / site header"].startsWith("60px"));
  assert.match(run(["example", "select"]).out, /^select--/);
  assert.match(run(["example", "button--variants"]).out, /@heroui\/react/);
});

test("init and get copy working source into a project", () => {
  const dir = project({"package.json": '{"name":"app"}', "src/index.css": '@import "tailwindcss";\n'});
  const init = run(["init"], dir);
  assert.equal(init.code, 0, init.err);
  assert.ok(fs.existsSync(path.join(dir, "src/theme/index.css")));
  assert.match(init.out, /@import "\.\/theme\/index\.css";\s+in src\/index\.css, replacing @import "tailwindcss"/);
  assert.match(init.out, /npm i @heroui\/react@/);

  const get = run(["get", "kit-sidebar"], dir);
  assert.equal(get.code, 0, get.err);
  for (const file of ["templates/kits/SidebarKit.tsx", "templates/saas/Navigation.tsx", "site/Locale.tsx", "styles/kit-sidebar.css"]) {
    assert.ok(fs.existsSync(path.join(dir, "src/niltavi", file)), file);
  }
  assert.match(fs.readFileSync(path.join(dir, "src/niltavi/styles/kit-sidebar.css"), "utf8"), /---------- Sidebar ----------/);

  fs.appendFileSync(path.join(dir, "src/niltavi/site/Locale.tsx"), "// edited\n");
  assert.match(run(["get", "kit-sidebar"], dir).out, /kept\s+src\/niltavi\/site\/Locale\.tsx/);
});

function png(size, alphaAt) {
  const crcTable = Array.from({length: 256}, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
    const out = Buffer.alloc(body.length + 8);
    out.writeUInt32BE(data.length, 0); body.copy(out, 4); out.writeUInt32BE(crc(body), body.length + 4);
    return out;
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) raw.writeUInt32BE((0xf5f1e600 | alphaAt(x, y, size)) >>> 0, y * (size * 4 + 1) + 1 + x * 4);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", header), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

function ico(sizes) {
  const images = sizes.map((s) => png(s, () => 255));
  const out = [Buffer.from([0, 0, 1, 0, sizes.length, 0])];
  let offset = 6 + sizes.length * 16;
  sizes.forEach((s, i) => {
    const entry = Buffer.alloc(16);
    entry[0] = s; entry[1] = s; entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(images[i].length, 8); entry.writeUInt32LE(offset, 12);
    offset += images[i].length; out.push(entry);
  });
  return Buffer.concat([...out, ...images]);
}

const opaque = () => 255;
const tile = (x, y, size) => (Math.min(x, y, size - 1 - x, size - 1 - y) < size * 0.07 ? 0 : 255);

function faviconSite({touch = opaque, maskable = opaque, purpose = "maskable", icoSizes = [16, 32, 48]} = {}) {
  const dir = project({
    "index.html": `<!doctype html><html><head>
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#F5F1E6" media="(prefers-color-scheme: light)">
</head><body></body></html>`,
    "public/favicon.svg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><style>@media (prefers-color-scheme: dark) { rect { fill: #0B1224 } }</style><rect width="1024" height="1024" rx="230"/></svg>',
    "public/site.webmanifest": JSON.stringify({theme_color: "#F5F1E6", background_color: "#F5F1E6", icons: [
      {src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any"},
      {src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any"},
      {src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose},
      {src: "/icon-monochrome-512.png", sizes: "512x512", type: "image/png", purpose: "monochrome"},
    ]}),
  });
  const write = (name, data) => fs.writeFileSync(path.join(dir, "public", name), data);
  write("favicon.ico", ico(icoSizes));
  write("apple-touch-icon.png", png(180, touch));
  write("icon-192.png", png(192, tile));
  write("icon-512.png", png(512, tile));
  write("icon-maskable-512.png", png(512, maskable));
  write("icon-monochrome-512.png", png(512, tile));
  const {code, out} = run(["favicon", "check", dir, "--json"]);
  return {code, report: JSON.parse(out)};
}

test("favicon check accepts a site that follows the spec", () => {
  const {code, report} = faviconSite();
  assert.equal(report.errors, 0, JSON.stringify(report.problems));
  assert.equal(code, 0);
});

test("favicon check rejects transparent touch and maskable icons, mixed purposes, and missing ICO sizes", () => {
  const {code, report} = faviconSite({touch: tile, maskable: tile, purpose: "any maskable", icoSizes: [16]});
  const messages = report.problems.filter((p) => p.severity === "error").map((p) => p.message).join("\n");
  assert.equal(code, 1);
  assert.match(messages, /apple-touch-icon must be full-bleed and opaque/);
  assert.match(messages, /single purpose/);
  assert.match(messages, /32×32 entry/);
  assert.match(messages, /declared with 48x48/);
});

test("favicon prints the specification from the current repository", () => {
  assert.match(run(["favicon"]).out, /^# Favicons and app icons/);
});

test("the Niltavi UI site's own icons pass favicon check", () => {
  const {code, out} = run(["favicon", "check", repo, "--json"]);
  assert.equal(JSON.parse(out).errors, 0, out);
  assert.equal(code, 0);
});
