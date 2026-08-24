import json
import tempfile
import unittest
from pathlib import Path

from PIL import Image
from pypdf import PdfReader

from scripts.assemble_website_pdf import assemble_website_pdf


class WebsitePdfAssemblerTest(unittest.TestCase):
    def test_preserves_each_desktop_capture_as_a_full_variable_height_page(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            captures = root / "captures"
            captures.mkdir()

            Image.new("RGB", (1920, 1080), "#101010").save(
                captures / "001-hero.jpg", quality=90
            )
            Image.new("RGB", (1920, 1500), "#202020").save(
                captures / "002-story.jpg", quality=90
            )

            manifest = {
                "pageCount": 2,
                "failedCount": 0,
                "audit": {
                    "failedImages": [],
                    "privatePhoneFound": False,
                    "emailFound": True,
                },
                "captures": [
                    {"index": 1, "label": "Hero", "filename": "001-hero.jpg", "matte": 0},
                    {"index": 2, "label": "Story", "filename": "002-story.jpg", "matte": 24},
                ],
            }
            manifest_path = captures / "manifest.json"
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

            output = root / "portfolio.pdf"
            assemble_website_pdf(manifest_path, output)

            reader = PdfReader(output)
            self.assertEqual(len(reader.pages), 2)
            self.assertAlmostEqual(float(reader.pages[0].mediabox.width), 960, places=2)
            self.assertAlmostEqual(float(reader.pages[0].mediabox.height), 540, places=2)
            self.assertAlmostEqual(float(reader.pages[1].mediabox.width), 960, places=2)
            self.assertAlmostEqual(float(reader.pages[1].mediabox.height), 774, places=2)

    def test_rejects_unresolved_duplicate_capture_hashes(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            captures = root / "captures"
            captures.mkdir()
            Image.new("RGB", (1920, 1080), "#101010").save(captures / "001.jpg")
            Image.new("RGB", (1920, 1080), "#101010").save(captures / "002.jpg")
            manifest = {
                "pageCount": 2,
                "failedCount": 0,
                "audit": {"failedImages": [], "privatePhoneFound": False},
                "captures": [
                    {"index": 1, "label": "One", "filename": "001.jpg", "sha256": "same"},
                    {"index": 2, "label": "Two", "filename": "002.jpg", "sha256": "same"},
                ],
            }
            manifest_path = captures / "manifest.json"
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

            with self.assertRaisesRegex(ValueError, "duplicate capture hashes"):
                assemble_website_pdf(manifest_path, root / "portfolio.pdf")


if __name__ == "__main__":
    unittest.main()
