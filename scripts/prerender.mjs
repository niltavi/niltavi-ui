// Server-render the home page into the built HTML so the first paint is the real page.
// Run after `vite build` and `vite build --ssr src/entry-server.tsx --outDir .ssr`.
import {readFile, rm, writeFile} from "node:fs/promises";
import {fileURLToPath, pathToFileURL} from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const ssrDir = root + ".ssr/";
const {render} = await import(pathToFileURL(ssrDir + "entry-server.js").href);

for (const [file, pathname] of [["dist/index.html", "/"], ["dist/zh/index.html", "/zh/"]]) {
  const path = root + file;
  const html = await readFile(path, "utf8");
  const placeholder = /<div id="root">[\s\S]*?<\/div>(?=\s*<\/body>)/;
  if (!placeholder.test(html)) throw new Error(`No #root placeholder in ${file}`);
  const app = await render(pathname);
  await writeFile(path, html.replace(placeholder, () => `<div id="root" data-ssr>${app}</div>`));
  console.log(`prerendered ${file} (${Math.round(app.length / 1024)} kB)`);
}

await rm(ssrDir, {recursive: true, force: true});
