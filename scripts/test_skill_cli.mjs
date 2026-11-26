import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {fileURLToPath} from "node:url";

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
