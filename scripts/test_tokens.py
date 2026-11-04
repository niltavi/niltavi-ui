"""Check color math and the public token export contract without writing files."""
import unittest

import generate_tokens as tokens


class TokenTests(unittest.TestCase):
    def test_wcag_reference_contrasts(self):
        self.assertAlmostEqual(tokens.contrast("#000000", "#FFFFFF"), 21)
        self.assertAlmostEqual(tokens.contrast("#283E38", "#283E38"), 1)
        self.assertAlmostEqual(tokens.contrast("#FFFFFF", "#767676"), 4.5422, places=4)

    def test_material_mixes_preserve_endpoints(self):
        for material in tokens.MATERIALS:
            with self.subTest(material=material):
                self.assertEqual(tokens.resolve(("mix", material, "white", 0)), tokens.ref(material))
                self.assertEqual(tokens.resolve(("mix", material, "white", 100)), "#FFFFFF")

    def test_semantic_exports_resolve_to_the_audited_colors(self):
        primitives = {"white": tokens.dtcg_color("#FFFFFF")}
        primitives.update({name: tokens.dtcg_color(hx) for name, hx in tokens.MATERIALS.items()})
        primitives.update({name: {str(step): tokens.dtcg_color(hx) for step, hx in scale.items()}
                           for name, scale in tokens.palette.items()})
        for mode, mapping in (("light", tokens.LIGHT), ("dark", tokens.DARK)):
            for name, value in mapping.items():
                with self.subTest(mode=mode, token=name):
                    exported = tokens.dtcg_alias(value, mode)["$value"]
                    if isinstance(exported, str):
                        node = {"color": primitives}
                        for key in exported.strip("{}").split("."):
                            node = node[key]
                        exported = node["$value"]
                    self.assertEqual(exported["hex"].upper(), tokens.resolved[mode][name])

    def test_all_theme_contrasts_meet_their_targets(self):
        for row in tokens.audit:
            with self.subTest(mode=row["mode"], foreground=row["fg"], background=row["bg"]):
                self.assertTrue(row["pass"], row)


if __name__ == "__main__":
    unittest.main()
