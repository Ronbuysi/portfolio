import re
import tempfile
import unittest
from pathlib import Path

from pypdf import PdfReader

from scripts.export_portfolio_pdf import build_portfolio_pdf


class PortfolioPdfExportTest(unittest.TestCase):
    def test_exports_seventeen_landscape_pages_without_private_phone(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            output = Path(temp_dir) / "portfolio.pdf"
            build_portfolio_pdf(output)

            reader = PdfReader(output)
            self.assertLess(output.stat().st_size, 30_000_000)
            self.assertEqual(len(reader.pages), 17)
            self.assertTrue(all(
                float(page.mediabox.width) > float(page.mediabox.height)
                for page in reader.pages
            ))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            self.assertIn("运营视觉设计", text)
            self.assertIn("TOSS DIARY", text)
            self.assertIn("241022998@qq.com", text)
            self.assertIsNone(re.search(r"(?<!\d)1[3-9]\d{9}(?!\d)", text))


if __name__ == "__main__":
    unittest.main()
