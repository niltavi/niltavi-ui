"""Check color math and exported tokens without changing workspace files."""
import json
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

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
        with TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "tokens").mkdir()
            with patch.object(tokens, "ROOT", root):
                tokens.write_dtcg()
            primitives = json.loads((root / "tokens/primitives.tokens.json").read_text())
            for mode in ("light", "dark"):
                semantic = json.loads((root / f"tokens/{mode}.tokens.json").read_text())
                for name, token in semantic["heroui"].items():
                    with self.subTest(mode=mode, token=name):
                        exported = token["$value"]
                        if isinstance(exported, str):
                            node = primitives
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
