# HeroUI example attribution

Examples in `examples/` are adapted from [HeroUI's official React demos](https://github.com/heroui-inc/heroui/tree/b2c65a5b5236550526f23d475b1ad0c6e5eab1a2/apps/docs/src/demos/en), commit `b2c65a5b5236550526f23d475b1ad0c6e5eab1a2`, by the HeroUI authors, under the Apache License 2.0. The complete license is in [LICENSE](LICENSE).

A filename `component--variant.tsx` corresponds to upstream `component/variant.tsx`. Client-only directives were removed for Vite, default exports were added, class-name helpers use HeroUI's exports, Iconify icons were replaced with local Gravity UI SVG icons, and the delivery/payment demo's custom color overrides were removed so every example uses the Niltavi theme. Additional compatibility and presentation changes are kept in these local copies.


The local gallery also uses the existing Niltavi button/chip extensions, replaces browser alerts with themed toasts, maps example shadows to the shared surface token, and prevents the example's search shortcut from intercepting typing in other inputs.

Card-based checkbox and radio examples use shared Niltavi grid extensions for text/icon/control alignment. Presentation padding and fixed widths have been adapted to the gallery, with responsive wrapping for narrow screens.

Gravity UI icons are copyright (c) 2022 YANDEX LLC, under the MIT License. See [LICENSE.gravity-ui](LICENSE.gravity-ui).
