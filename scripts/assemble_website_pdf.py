#!/usr/bin/env python3
"""Assemble desktop website captures into an uncropped, structure-faithful PDF."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from PIL import Image
from reportlab.pdfgen import canvas


PDF_PAGE_WIDTH = 960.0


def _load_manifest(manifest_path: Path) -> dict[str, Any]:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("failedCount"):
        raise ValueError("Capture manifest contains failed website segments")
    audit = manifest.get("audit", {})
    if audit.get("failedImages"):
        raise ValueError("Capture manifest contains unloaded website images")
    if audit.get("privatePhoneFound"):
        raise ValueError("Capture manifest contains a private phone number")
    captures = manifest.get("captures", [])
    if not captures or len(captures) != manifest.get("pageCount"):
        raise ValueError("Capture manifest page count does not match its captures")
    hashes = [capture.get("sha256") for capture in captures if capture.get("sha256")]
    if len(hashes) != len(set(hashes)):
        raise ValueError("Capture manifest contains duplicate capture hashes")
    return manifest


def assemble_website_pdf(manifest_path: Path, output_path: Path) -> Path:
    """Place every website capture on its own page without cropping or reflowing it."""

    manifest_path = Path(manifest_path).resolve()
    output_path = Path(output_path).resolve()
    manifest = _load_manifest(manifest_path)
    capture_dir = manifest_path.parent
    output_path.parent.mkdir(parents=True, exist_ok=True)

    pdf = canvas.Canvas(str(output_path), pageCompression=1)
    pdf.setTitle("王程程作品集 2026 - Desktop Website Edition")
    pdf.setAuthor("王程程")
    pdf.setSubject("视觉设计 / AI设计 / 品牌设计作品集")
    pdf.setCreator("Desktop website capture pipeline")

    for capture in manifest["captures"]:
        image_path = capture_dir / capture["filename"]
        if not image_path.is_file():
            raise FileNotFoundError(f"Missing website capture: {image_path}")

        with Image.open(image_path) as image:
            image_width, image_height = image.size
        if image_width <= 0 or image_height <= 0:
            raise ValueError(f"Invalid capture dimensions: {image_path}")

        scale = PDF_PAGE_WIDTH / image_width
        matte_height = max(0.0, float(capture.get("matte", 0))) * scale
        content_height = image_height * scale
        page_height = content_height + matte_height * 2
        pdf.setPageSize((PDF_PAGE_WIDTH, page_height))
        bookmark = f"segment-{int(capture['index']):03d}"
        pdf.bookmarkPage(bookmark)
        pdf.addOutlineEntry(str(capture["label"]), bookmark, level=0)
        pdf.setFillColorRGB(0.027, 0.027, 0.027)
        pdf.rect(0, 0, PDF_PAGE_WIDTH, page_height, fill=1, stroke=0)
        pdf.drawImage(
            str(image_path),
            0,
            matte_height,
            width=PDF_PAGE_WIDTH,
            height=content_height,
            preserveAspectRatio=True,
            anchor="c",
            mask="auto",
        )
        pdf.showPage()

    pdf.save()
    return output_path


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Assemble full desktop website captures into an uncropped PDF"
    )
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    result = assemble_website_pdf(args.manifest, args.output)
    print(result)


if __name__ == "__main__":
    main()
