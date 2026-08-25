from pathlib import Path

from PIL import Image, ImageOps


SOURCE = Path(r"C:/Users/86135/Desktop/作品")
DEST = Path(__file__).resolve().parents[1] / "public" / "images" / "nesta"

ASSETS = {
    "1e6c83a0e93dfc8b01d7a3ec55f37ab5.jpg": "hero-cover",
    "2241f292694c0cb2497992ebc760bf2d.jpg": "application-illustration-world",
    "28fc79dc932dade9a9be86b8b064f811.jpg": "application-vi-board",
    "3254375487548.png": "positioning-overview",
    "41352365437657579.png": "positioning-visual",
    "64f25f02d6da06118b9a56c758d5d5d0.jpg": "application-collage",
    "a7891f23d4c412bd91a1ae0d9a041b86.jpg": "application-editorial",
    "e986ccc5cdd9a1f86cc0340f063a7ef5.jpg": "identity-color-system",
    "f38148cf53096b223e35e4f90779dcba.jpg": "identity-logo-construction",
    "fc792c3e0995c1aeb0f4d5ff41a7057c.jpg": "application-window-graphics",
    "调研_01.png": "research-market-opportunity",
    "调研_02.png": "research-user-needs",
    "调研_03.png": "research-industry-trends",
    "调研_04.png": "research-consumption-trends",
    "调研_05.png": "research-channel-positioning",
    "竞品调研_01.gif": "competitor-vitra-overview",
    "竞品调研_02.gif": "competitor-vitra-research",
    "竞品调研_03.gif": "competitor-vitra-applications",
    "竞品调研_04.gif": "competitor-muji-overview",
    "竞品调研_05.gif": "competitor-muji-research",
    "竞品调研_06.gif": "competitor-muji-applications",
    "竞品调研_07.gif": "competitor-fanji-overview",
    "竞品调研_08.gif": "competitor-fanji-research",
    "竞品调研_09.gif": "competitor-fanji-applications",
    "竞品调研_10.gif": "competitor-hay-overview",
    "竞品调研_11.gif": "competitor-hay-research",
    "竞品调研_12.gif": "competitor-hay-applications",
    "竞品调研_13.gif": "competitor-ikea-overview",
    "竞品调研_14.gif": "competitor-ikea-research",
    "竞品调研_15.png": "competitor-ikea-applications",
    "理念_01.png": "concept-overview",
    "理念_02.png": "concept-logo-lockups",
    "理念_03.png": "concept-positioning",
    "用户画像等_01.png": "opportunity-user-portraits",
    "用户画像等_02.png": "opportunity-brand-space",
    "用户画像等_03.png": "opportunity-positioning-model",
    "用户画像等_04.png": "identity-type-system",
    "用户画像等_05.png": "opportunity-swot",
    "作品背景_01.png": "brief-context",
    "作品背景_02.png": "brief-space-scene",
    "作品12124523676_01.png": "application-editorial-layout",
    "作品12124523676_02.png": "application-social-mobile",
    "作品386459827350_01.png": "application-space-poster",
    "作品386459827350_02.png": "application-product-card",
    "作品386459827350_03.png": "application-brand-story",
    "作品386459827350_04.png": "application-packaging",
    "作品947195656_01.png": "identity-symbol-library",
    "作品947195656_02.png": "identity-pattern-library",
    "插画说明1.jpg": "identity-illustration-concept",
    "插画说明2.jpg": "identity-illustration-scenes",
    "插画说明3.jpg": "application-social-kv",
    "物料应用1.jpg": "application-collateral-set",
    "物料应用2.jpg": "application-packaging-box",
}


def output_names(assets=ASSETS):
    return [
        name
        for basename in assets.values()
        for name in (
            f"{basename}.jpg",
            f"{basename}-w960.webp",
            f"{basename}-w1800.webp",
        )
    ]


def save_width(image, destination, basename, width):
    output = image
    if image.width > width:
        height = round(image.height * width / image.width)
        output = image.resize((width, height), Image.Resampling.LANCZOS)
    output.save(
        destination / f"{basename}-w{width}.webp",
        "WEBP",
        quality=86,
        method=6,
    )


def prepare_assets(source_dir=SOURCE, destination=DEST, assets=ASSETS):
    destination.mkdir(parents=True, exist_ok=True)
    for source_name, basename in assets.items():
        source = source_dir / source_name
        if not source.is_file():
            raise FileNotFoundError(source)
        with Image.open(source) as raw:
            image = ImageOps.exif_transpose(raw).convert("RGB")
            image.save(
                destination / f"{basename}.jpg",
                "JPEG",
                quality=95,
                optimize=True,
            )
            save_width(image, destination, basename, 960)
            save_width(image, destination, basename, 1800)
    return output_names(assets)


if __name__ == "__main__":
    generated = prepare_assets()
    print(
        f"Generated {len(generated)} NESTA files from "
        f"{len(ASSETS)} source images in {DEST}"
    )
