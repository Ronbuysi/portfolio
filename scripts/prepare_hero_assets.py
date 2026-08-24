from pathlib import Path
from shutil import copy2

from PIL import Image, ImageOps


BACKGROUND = Path(r"C:/Users/86135/Desktop/作品/2241f292694c0cb2497992ebc760bf2d.jpg")
PROP_SOURCE = Path(r"C:/Users/86135/Desktop/素材")
DEST = Path(__file__).resolve().parents[1] / "public" / "images" / "hero"
PROPS = {
    "exec-332ecd8e-1118-4c8e-af89-97ed0c3265df.png": "hero-spring-table",
    "exec-683b80f9-59a4-403e-aee6-fafb5c7c2dc8.png": "hero-blue-cabinet",
    "exec-787582f0-ca6c-46b9-afde-149343620746.png": "hero-floating-table",
    "exec-b93e4aee-3686-4302-939b-c12c419ad70d.png": "hero-rocking-chair",
    "exec-dfbf2c41-8c9a-4308-b86e-56fd2649062e.png": "hero-table-lamp",
}


def output_names():
    background = [
        "nesta-illustration-bg.jpg",
        "nesta-illustration-bg-w960.webp",
        "nesta-illustration-bg-w1800.webp",
    ]
    props = [
        name
        for basename in PROPS.values()
        for name in (
            f"{basename}.png",
            f"{basename}-w960.webp",
            f"{basename}-w1800.webp",
        )
    ]
    return background + props


def resize(image, width):
    if image.width <= width:
        return image.copy()
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def prepare_assets(destination=DEST):
    destination.mkdir(parents=True, exist_ok=True)
    with Image.open(BACKGROUND) as source:
        background = ImageOps.exif_transpose(source).convert("RGB")
        background.save(destination / "nesta-illustration-bg.jpg", "JPEG", quality=95, optimize=True)
        for width in (960, 1800):
            resize(background, width).save(
                destination / f"nesta-illustration-bg-w{width}.webp",
                "WEBP",
                quality=88,
                method=6,
            )
    for source_name, basename in PROPS.items():
        source_path = PROP_SOURCE / source_name
        copy2(source_path, destination / f"{basename}.png")
        with Image.open(source_path) as source:
            prop = ImageOps.exif_transpose(source).convert("RGBA")
            for width in (960, 1800):
                resize(prop, width).save(
                    destination / f"{basename}-w{width}.webp",
                    "WEBP",
                    quality=88,
                    method=6,
                    lossless=True,
                )
    return output_names()


if __name__ == "__main__":
    generated = prepare_assets()
    print(f"Generated {len(generated)} Hero assets in {DEST}")
