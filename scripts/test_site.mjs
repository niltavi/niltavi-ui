import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Compile isolated TS utilities with the project's compiler; no browser or extra runner.
async function loadUtility(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const {outputText} = ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext}});
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const {pages, parseRoute, routeHref, sectionId, getActiveSection} = await loadUtility("../src/site/navigation.ts");
const {editorialContent, formatPrompt} = await loadUtility("../src/site/editorialContent.ts");
const {catalog, matchesComponent} = await loadUtility("../src/showcase/catalog.ts");
const {paletteSections, paletteScales, uiScales} = await loadUtility("../src/site/paletteCatalog.ts");
const {swatchTextColor} = await loadUtility("../src/site/color.ts");
const {translate} = await loadUtility("../src/site/translate.ts");
const messages = JSON.parse(await readFile(new URL("../src/showcase/messages.json", import.meta.url), "utf8"));

test("root and unknown pages open the component gallery", () => {
  assert.deepEqual(parseRoute(""), {page: "components", section: ""});
  assert.deepEqual(parseRoute("#/unknown"), {page: "components", section: ""});
});

test("page and directory links survive direct loads and history navigation", () => {
  for (const {id: page} of pages) {
    for (const section of ["", "color", "checkbox-group"]) {
      assert.deepEqual(parseRoute(routeHref(page, section)), {page, section});
    }
  }
  assert.deepEqual(parseRoute("#/palette/%3Cscript%3E"), {page: "palette", section: ""});
});

test("editorial deep links have distinct anchors and preserve existing gallery anchors", () => {
  assert.equal(sectionId("components", "button"), "showcase-button");
  assert.equal(sectionId("palette", "colors"), "palette-colors");
  assert.notEqual(sectionId("philosophy", "color"), sectionId("prompts", "color"));
  const anchors = [];
  for (const [page, content] of Object.entries(editorialContent)) {
    for (const section of content.sections) {
      assert.match(section.id, /^[a-z0-9-]+$/);
      assert.deepEqual(parseRoute(routeHref(page, section.id)), {page, section: section.id});
      assert.ok(section.title.en && section.title.zh);
      for (const paragraph of section.paragraphs) assert.ok(paragraph.en && paragraph.zh);
      anchors.push(sectionId(page, section.id));
    }
  }
  assert.equal(new Set(anchors).size, anchors.length);
});

test("copying a prompt includes every displayed rule and closing in the selected language", () => {
  for (const [locale, key] of [["en", "en"], ["zh-CN", "zh"]]) {
    const copied = formatPrompt(locale);
    let position = -1;
    for (const section of editorialContent.prompts.sections) {
      const next = copied.indexOf(section.title[key]);
      assert.ok(next > position);
      position = next;
      for (const paragraph of section.paragraphs) assert.ok(copied.includes(paragraph[key]));
    }
    assert.ok(copied.endsWith(editorialContent.prompts.closing[key]));
    assert.ok(!copied.includes(editorialContent.prompts.source));
  }
  assert.notEqual(formatPrompt("en"), formatPrompt("zh-CN"));
  assert.doesNotMatch(formatPrompt("en"), /[\u4e00-\u9fff]/);
});

test("component search accepts Chinese and normalized English names", () => {
  const checkbox = catalog.find((item) => item.id === "checkbox-group");
  assert.ok(matchesComponent(checkbox, "复选框组"));
  assert.ok(matchesComponent(checkbox, "  CHECKBOX-GROUP  "));
  assert.ok(!matchesComponent(checkbox, "Calendar"));
  assert.equal(catalog.filter((item) => matchesComponent(item, "no-such-component")).length, 0);
});

test("catalogue anchors are unique and every example has a Chinese title", () => {
  assert.equal(new Set(catalog.map((item) => item.id)).size, catalog.length);
  for (const item of catalog) {
    assert.match(item.id, /^[a-z0-9-]+$/);
    assert.ok(item.zh && item.examples.length);
    for (const name of item.examples) assert.match(messages[name]?.[1] ?? "", /[\u4e00-\u9fff]/, name);
  }
});

test("copy switches locale while keeping unknown names and typed values intact", () => {
  assert.equal(translate(messages, "en", "Upload File"), "Upload file");
  assert.equal(translate(messages, "zh-CN", "Upload File"), "上传文件");
  assert.equal(translate(messages, "zh-CN", "niltava-500"), "niltava-500");
  const value = {id: "bird-1"};
  assert.equal(translate(messages, "zh-CN", value), value);
  assert.equal(translate(messages, "zh-CN", 0), 0);
});

test("translated feedback interpolates values without treating them as markup", () => {
  assert.equal(translate(messages, "zh-CN", "Saved {count} items", {count: 0}), "已保存 0 条记录");
  assert.equal(translate(messages, "en", "Welcome back, {name}!", {name: "<bird>"}), "Welcome back, <bird>!");
  assert.equal(translate(messages, "en", "Saved {count} items", {}), "Saved {count} items");
});

test("directory highlight follows the visible heading rather than the last URL", () => {
  assert.equal(getActiveSection([{id: "niltava", top: -80}, {id: "rufous", top: 84}, {id: "leaf", top: 300}], 92), "rufous");
  assert.equal(getActiveSection([{id: "button", top: 160}], 92), "button");
  assert.equal(getActiveSection([], 92), "");
});

test("palette directory lists page sections rather than individual colors", () => {
  assert.deepEqual(paletteSections.map((section) => section.id), ["colors", "charts", "contrast"]);
  assert.deepEqual(paletteSections.map((section) => section.zh), ["色卡", "图表", "对比度"]);
});

test("public copy uses the product name and neutral examples in both languages", () => {
  for (const [key, values] of Object.entries(messages)) {
    for (const value of values) {
      assert.doesNotMatch(value, /heroui|观鸟|山野|林间|手记|同行者|field notebook|kingfisher|birdsong/i, key);
    }
  }
});

test("UI supporting colors are exported and shown separately from core colors", async () => {
  const tokens = JSON.parse(await readFile(new URL("../src/theme/tokens.json", import.meta.url), "utf8"));
  assert.deepEqual(paletteScales.map((scale) => scale.id), tokens.scaleGroups.core);
  assert.deepEqual(uiScales.map((scale) => scale.id), tokens.scaleGroups.ui);
  assert.equal(new Set([...tokens.scaleGroups.core, ...tokens.scaleGroups.ui]).size, Object.keys(tokens.scales).length);
});

test("swatch labels remain readable on light, dark, and middle supporting colors", () => {
  assert.equal(swatchTextColor("#FFFFFF"), "#000000");
  assert.equal(swatchTextColor("#000000"), "#FFFFFF");
  assert.equal(swatchTextColor("#868C9B"), "#000000");
});
