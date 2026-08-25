import tempfile
import unittest
from pathlib import Path

from scripts.prepare_nesta_assets import ASSETS, output_names, prepare_assets


class PrepareNestaAssetsTest(unittest.TestCase):
    def test_nesta_manifest_covers_every_current_source_file(self):
        source = Path(r"C:/Users/86135/Desktop/作品")
        self.assertEqual(len(ASSETS), 53)
        self.assertEqual(set(ASSETS), {path.name for path in source.iterdir() if path.is_file()})
        self.assertEqual(len(set(ASSETS.values())), 53)

    def test_every_asset_has_original_and_responsive_outputs(self):
        names = output_names()
        self.assertEqual(len(names), 53 * 3)
        self.assertIn("hero-cover.jpg", names)
        self.assertIn("hero-cover-w960.webp", names)
        self.assertIn("hero-cover-w1800.webp", names)

    def test_prepare_assets_converts_single_frame_gif(self):
        source = Path(r"C:/Users/86135/Desktop/作品")
        with tempfile.TemporaryDirectory() as temp_dir:
            destination = Path(temp_dir)
            prepare_assets(source, destination, {"竞品调研_01.gif": "competitor-vitra-overview"})
            self.assertTrue((destination / "competitor-vitra-overview.jpg").is_file())
            self.assertTrue((destination / "competitor-vitra-overview-w960.webp").is_file())
            self.assertTrue((destination / "competitor-vitra-overview-w1800.webp").is_file())


if __name__ == "__main__":
    unittest.main()
