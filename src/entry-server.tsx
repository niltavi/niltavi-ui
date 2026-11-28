import {StrictMode} from "react";
import {renderToString} from "react-dom/server";

import App from "./App";
import {Showcase} from "./site/pageModules";

/** Render the home page (no hash) at build time; the client hydrates it. */
export async function render(pathname: string) {
  await Showcase.preload();
  return renderToString(<StrictMode><App pathname={pathname} hash="" mode="light" /></StrictMode>);
}
