import tempfile
import unittest
from pathlib import Path

from scripts.prepare_hero_assets import BACKGROUND, PROPS, output_names, prepare_assets


class PrepareHeroAssetsTest(unittest.TestCase):
    def test_manifest_contains_one_background_and_five_props(self):
        self.assertEqual(BACKGROUND.name, "2241f292694c0cb2497992ebc760bf2d.jpg")
        self.assertEqual(len(PROPS), 5)
        self.assertEqual(len(set(PROPS.values())), 5)

    def test_output_manifest_is_complete(self):
        names = output_names()
        self.assertEqual(len(names), 18)
        self.assertIn("nesta-illustration-bg.jpg", names)
        self.assertIn("nesta-illustration-bg-w960.webp", names)
        self.assertIn("hero-rocking-chair.png", names)
        self.assertIn("hero-rocking-chair-w1800.webp", names)

    def test_png_conversion_preserves_transparent_corners(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            prepare_assets(Path(temp_dir))
            from PIL import Image
            image = Image.open(Path(temp_dir) / "hero-table-lamp.png").convert("RGBA")
            self.assertEqual(image.getpixel((0, 0))[3], 0)


if __name__ == "__main__":
    unittest.main()
