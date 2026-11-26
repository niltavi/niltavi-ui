import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import App from "./App";
import {parseRoute} from "./site/navigation";
import {preloadPages} from "./site/pageModules";

const render = () => createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Keep the static intro in place until the requested page can render without a loading state.
preloadPages(parseRoute(window.location.hash).page).then(render, render);
