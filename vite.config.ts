import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {defineConfig, type Plugin} from "vite";
import type {OutputBundle, OutputChunk} from "rollup";
import {themeInitialization} from "./src/product/theme";
import {localeFromPath, localizedHref, siteDescriptions, siteOrigin, siteTitles} from "./src/site/localizedUrls";

function publicMetadata(): Plugin {
  return {
    name: "niltavi-public-metadata",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const locale = localeFromPath(ctx.path.replace(/index\.html$/, ""));
        const description = siteDescriptions[locale];
        return {
          html: html.replace("%SITE_DESCRIPTION%", description).replace("%INTRO_DESCRIPTION%", description).replace("%SITE_TITLE%", siteTitles[locale]),
          tags: [
            {tag: "script", injectTo: "head-prepend", children: themeInitialization},
            // The prerendered HTML is the home page; hide it on deep links until the client renders the right page.
            {tag: "script", injectTo: "head-prepend", children: 'if (location.hash.length > 1) document.documentElement.dataset.deepLink = "";'},
            {tag: "link", attrs: {rel: "canonical", href: siteOrigin + localizedHref(locale)}},
            {tag: "link", attrs: {rel: "alternate", hreflang: "en", href: siteOrigin + "/"}},
            {tag: "link", attrs: {rel: "alternate", hreflang: "zh-CN", href: siteOrigin + "/zh/"}},
            {tag: "link", attrs: {rel: "alternate", hreflang: "x-default", href: siteOrigin + "/"}},
          ],
        };
      },
    },
  };
}

// The prerendered home page hydrates with the components page, so only that chunk is preloaded.
// Other pages warm up after the first render (see preloadPages); preloading them here
// competed with the render-blocking stylesheet and delayed the first paint.
const pageEntries = ["src/showcase/Showcase.tsx"];

/** Fetch the home page's chunk alongside the entry, behind the stylesheet, so hydration doesn't wait on a second round trip. */
function preloadPageChunks(): Plugin {
  return {
    name: "niltavi-preload-page-chunks",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, {bundle}) {
        if (!bundle) return;
        const chunks = Object.values(bundle as OutputBundle).filter((item): item is OutputChunk => item.type === "chunk");
        const files = new Set<string>();
        const styles = new Set<string>();
        const visit = (fileName: string) => {
          const chunk = (bundle as OutputBundle)[fileName];
          if (chunk?.type !== "chunk" || files.has(fileName) || html.includes(fileName)) return;
          files.add(fileName);
          chunk.viteMetadata?.importedCss.forEach((css) => { if (!html.includes(css)) styles.add(css); });
          chunk.imports.forEach(visit);
        };
        for (const entry of pageEntries) {
          const chunk = chunks.find((item) => item.isDynamicEntry && item.facadeModuleId?.replaceAll("\\", "/").endsWith(entry));
          if (!chunk) throw new Error(`Page chunk not found: ${entry}`);
          visit(chunk.fileName);
        }
        return [
          ...[...files].map((fileName) => ({tag: "link", attrs: {rel: "modulepreload", crossorigin: true, fetchpriority: "low", href: "/" + fileName}, injectTo: "head" as const})),
          ...[...styles].map((fileName) => ({tag: "link", attrs: {rel: "preload", as: "style", href: "/" + fileName}, injectTo: "head" as const})),
        ];
      },
    },
  };
}

export default defineConfig({
  plugins: [publicMetadata(), preloadPageChunks(), react(), tailwindcss()],
  build: {rollupOptions: {input: ["index.html", "zh/index.html"]}},
});
