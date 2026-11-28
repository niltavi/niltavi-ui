import {StrictMode} from "react";
import {createRoot, hydrateRoot} from "react-dom/client";

import App from "./App";
import {preferredTheme} from "./product/theme";
import {parseRoute} from "./site/navigation";
import {preloadPages} from "./site/pageModules";

const root = document.getElementById("root")!;
const {pathname, hash} = window.location;

const render = () => {
  // The build prerenders the home page. Hydrate it when that is the page in the URL; a deep link renders fresh.
  if (root.hasAttribute("data-ssr") && hash === "") {
    hydrateRoot(root, <StrictMode><App pathname={pathname} hash="" mode="light" /></StrictMode>);
  } else {
    root.removeAttribute("data-ssr");
    createRoot(root).render(<StrictMode><App pathname={pathname} hash={hash} mode={preferredTheme()} /></StrictMode>);
  }
};

// Render once the requested page's chunk is ready, so neither path shows a loading state.
preloadPages(parseRoute(hash).page).then(render, render);
