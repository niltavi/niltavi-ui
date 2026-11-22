import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {defineConfig, type Plugin} from "vite";
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
        const installLabel = locale === "en" ? "Install with an agent" : "让 Agent 安装";
        return {
          html: html.replace("%SITE_DESCRIPTION%", description).replace("%INTRO_DESCRIPTION%", description).replace("%SITE_TITLE%", siteTitles[locale]).replace("%INSTALL_LABEL%", installLabel),
          tags: [
            {tag: "script", injectTo: "head-prepend", children: themeInitialization},
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

export default defineConfig({
  plugins: [publicMetadata(), react(), tailwindcss()],
  build: {rollupOptions: {input: ["index.html", "zh/index.html"]}},
});
