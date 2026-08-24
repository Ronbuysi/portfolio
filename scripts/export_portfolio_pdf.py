from __future__ import annotations

from functools import lru_cache
from io import BytesIO
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "public" / "images"
PAGE_W, PAGE_H = 960, 540
MARGIN = 34

INK = HexColor("#070707")
PANEL = HexColor("#0D0D0D")
PAPER = HexColor("#F2F0EB")
MUTED = HexColor("#92928C")
LINE = HexColor("#292929")
ACID = HexColor("#D8FF36")
BLUE = HexColor("#5B8CFF")

CN_FONT = "PortfolioCN"
MONO_FONT = "PortfolioMono"
DISPLAY_FONT = "Helvetica-Bold"


def register_fonts() -> None:
    if CN_FONT not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont(
            CN_FONT,
            "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        ))
    if MONO_FONT not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont(
            MONO_FONT,
            "/System/Library/Fonts/SFNSMono.ttf",
        ))


def asset(relative: str) -> Path:
    path = ROOT / "public" / relative.lstrip("/")
    if not path.exists():
        raise FileNotFoundError(path)
    return path


def image_size(path: Path) -> tuple[int, int]:
    with Image.open(path) as image:
        return image.size


@lru_cache(maxsize=64)
def optimized_image(path_string: str, max_side: int = 2200) -> ImageReader:
    path = Path(path_string)
    with Image.open(path) as source:
        image = source.convert("RGBA")
        if image.width > max_side or image.height > max_side:
            image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
        background = Image.new("RGB", image.size, (7, 7, 7))
        background.paste(image, mask=image.getchannel("A"))
        buffer = BytesIO()
        background.save(buffer, format="JPEG", quality=88, optimize=True, progressive=True)
    buffer.seek(0)
    return ImageReader(buffer)


def fill(c: canvas.Canvas, color, alpha: float = 1) -> None:
    c.setFillColor(color)
    if hasattr(c, "setFillAlpha"):
        c.setFillAlpha(alpha)


def stroke(c: canvas.Canvas, color, alpha: float = 1) -> None:
    c.setStrokeColor(color)
    if hasattr(c, "setStrokeAlpha"):
        c.setStrokeAlpha(alpha)


def page_base(c: canvas.Canvas, number: int, section: str) -> None:
    fill(c, INK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    stroke(c, LINE)
    c.setLineWidth(0.7)
    c.line(MARGIN, PAGE_H - 28, PAGE_W - MARGIN, PAGE_H - 28)
    fill(c, MUTED)
    c.setFont(MONO_FONT, 6.8)
    c.drawString(MARGIN, PAGE_H - 21, section.upper())
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 21, f"WANG CC / PORTFOLIO 2026 / {number:02d}")


def draw_page_number(c: canvas.Canvas, number: int) -> None:
    fill(c, MUTED)
    c.setFont(MONO_FONT, 6.4)
    c.drawString(MARGIN, 16, f"{number:02d} / 17")
    c.drawRightString(PAGE_W - MARGIN, 16, "VISUAL / AI / BRAND")


def end_page(c: canvas.Canvas, number: int) -> None:
    draw_page_number(c, number)
    c.showPage()


def draw_image_cover(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float, opacity: float = 1) -> None:
    iw, ih = image_size(path)
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    c.saveState()
    clip = c.beginPath()
    clip.rect(x, y, w, h)
    c.clipPath(clip, stroke=0, fill=0)
    if hasattr(c, "setFillAlpha"):
        c.setFillAlpha(opacity)
    c.drawImage(optimized_image(str(path)), x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, preserveAspectRatio=True, mask="auto")
    c.restoreState()


def draw_image_contain(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float, background=PANEL) -> None:
    fill(c, background)
    c.rect(x, y, w, h, fill=1, stroke=0)
    iw, ih = image_size(path)
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(optimized_image(str(path)), x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, preserveAspectRatio=True, mask="auto")


def image_panel(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float, mode: str = "cover", label: str = "") -> None:
    if mode == "contain":
        draw_image_contain(c, path, x, y, w, h)
    else:
        draw_image_cover(c, path, x, y, w, h)
    stroke(c, LINE)
    c.setLineWidth(0.8)
    c.rect(x, y, w, h, fill=0, stroke=1)
    if label:
        fill(c, INK, 0.84)
        c.rect(x, y, w, 18, fill=1, stroke=0)
        fill(c, PAPER)
        c.setFont(MONO_FONT, 6.2)
        c.drawString(x + 8, y + 6, label.upper())


def draw_paragraph(c: canvas.Canvas, text: str, x: float, y: float, max_width: float, font_size: float = 10, leading: float = 15, color=MUTED, max_lines: int = 8) -> float:
    fill(c, color)
    c.setFont(CN_FONT, font_size)
    lines: list[str] = []
    current = ""
    for char in text:
        candidate = current + char
        if pdfmetrics.stringWidth(candidate, CN_FONT, font_size) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = char
        if len(lines) >= max_lines:
            break
    if current and len(lines) < max_lines:
        lines.append(current)
    cursor = y
    for line in lines:
        c.drawString(x, cursor, line)
        cursor -= leading
    return cursor


def eyebrow(c: canvas.Canvas, text: str, x: float, y: float, color=ACID) -> None:
    fill(c, color)
    c.setFont(MONO_FONT, 7.4)
    c.drawString(x, y, text.upper())


def title_cn(c: canvas.Canvas, title: str, x: float, y: float, size: float = 42, color=PAPER) -> None:
    fill(c, color)
    c.setFont(CN_FONT, size)
    c.drawString(x, y, title)


def title_en(c: canvas.Canvas, lines: list[str], x: float, y: float, size: float = 44, leading: float | None = None, color=PAPER) -> None:
    fill(c, color)
    c.setFont(DISPLAY_FONT, size)
    leading = leading or size * 0.84
    for line in lines:
        c.drawString(x, y, line)
        y -= leading


def glass_panel(c: canvas.Canvas, x: float, y: float, w: float, h: float, blue: bool = False) -> None:
    c.saveState()
    fill(c, HexColor("#111522") if blue else PANEL, 0.92)
    c.roundRect(x, y, w, h, 4, fill=1, stroke=0)
    stroke(c, HexColor("#36496B") if blue else LINE)
    c.roundRect(x, y, w, h, 4, fill=0, stroke=1)
    c.restoreState()


def page_cover(c: canvas.Canvas) -> None:
    bg = asset("images/hero/nesta-illustration-bg.jpg")
    draw_image_cover(c, bg, 0, 0, PAGE_W, PAGE_H)
    fill(c, INK, 0.66)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    fill(c, BLUE, 0.12)
    c.circle(720, 320, 250, fill=1, stroke=0)
    stroke(c, PAPER, 0.3)
    c.line(MARGIN, 470, PAGE_W - MARGIN, 470)
    eyebrow(c, "Visual × AI × Brand", MARGIN, 444)
    title_en(c, ["VISUAL", "DESIGNER."], MARGIN, 336, 88, 72)
    fill(c, ACID)
    c.circle(435, 190, 7, fill=1, stroke=0)
    fill(c, PAPER)
    c.setFont(CN_FONT, 13)
    c.drawString(MARGIN, 82, "王程程 / WANG CHENGCHENG")
    fill(c, MUTED)
    c.setFont(MONO_FONT, 7)
    c.drawString(MARGIN, 60, "SHENYANG, CHINA / PORTFOLIO 2026")
    c.drawRightString(PAGE_W - MARGIN, 60, "SELECTED WORK / 001—007")
    c.showPage()


def page_profile(c: canvas.Canvas) -> None:
    page_base(c, 2, "Profile / Index")
    image_panel(c, IMAGES / "profile/wang-chengcheng-2026.jpg", MARGIN, 62, 238, 408, "cover", "Designer profile / 01")
    fill(c, BLUE, 0.26)
    c.rect(MARGIN, 62, 238, 408, fill=1, stroke=0)
    x = 302
    eyebrow(c, "Profile / 2026", x, 442)
    title_cn(c, "把视觉直觉，", x, 388, 36)
    title_cn(c, "变成清晰有力的设计语言。", x, 344, 28)
    draw_paragraph(c, "视觉设计师与 AI 设计实践者，拥有视觉传达设计背景，目前攻读设计学硕士。关注品牌视觉、运营设计与生成式 AI 在创意流程中的融合。", x, 298, 312, 9.4, 15)
    labels = [("03", "核心设计方向"), ("03", "设计赛事奖项"), ("2020—NOW", "设计旅程")]
    for index, (value, label) in enumerate(labels):
        px = x + index * 106
        fill(c, PAPER)
        c.setFont(DISPLAY_FONT, 15 if index < 2 else 10)
        c.drawString(px, 205, value)
        fill(c, MUTED)
        c.setFont(CN_FONT, 6.8)
        c.drawString(px, 190, label)
    stroke(c, LINE)
    c.line(x, 170, 610, 170)
    eyebrow(c, "Education", x, 148, MUTED)
    draw_paragraph(c, "2025.09—NOW  沈阳建筑大学 / 设计学硕士\n2020.09—2024.06  广西民族大学 / 视觉传达设计本科", x, 128, 310, 7.7, 13, PAPER, 4)
    glass_panel(c, 645, 62, 281, 408, True)
    eyebrow(c, "Contents / 001—007", 668, 442)
    projects = [
        ("001", "运营视觉设计"), ("002", "包装设计"), ("003", "生活新搭案"),
        ("004", "成长日常"), ("005", "倒倒 bar 品牌设计"), ("006", "MY MAY 品牌设计"),
        ("007", "TOSS DIARY IP 设计"),
    ]
    y = 397
    for idx, name in projects:
        fill(c, ACID)
        c.setFont(MONO_FONT, 7)
        c.drawString(668, y, idx)
        fill(c, PAPER)
        c.setFont(CN_FONT, 10.6)
        c.drawString(714, y - 1, name)
        stroke(c, LINE)
        c.line(668, y - 16, 903, y - 16)
        y -= 47
    end_page(c, 2)


def page_operation_intro(c: canvas.Canvas) -> None:
    page_base(c, 3, "Project 001 / Operation Design")
    eyebrow(c, "001 / Farmers' Market Campaign", MARGIN, 442)
    title_cn(c, "运营视觉设计", MARGIN, 388, 39)
    draw_paragraph(c, "围绕菜市场漫游主题展开，以手写字、蔬果拼贴、高饱和色彩与网点质感构建轻松直接的传播语气。", MARGIN, 348, 250, 9, 15)
    posters = ["operation-poster-01.jpg", "operation-poster-02.jpg", "operation-poster-03.jpg"]
    for i, name in enumerate(posters):
        image_panel(c, IMAGES / name, 323 + i * 194, 62, 177, 408, "contain", f"Poster / 0{i + 1}")
    glass_panel(c, MARGIN, 62, 250, 110)
    eyebrow(c, "Visual grammar", 50, 142, MUTED)
    draw_paragraph(c, "BRUSH MARK / CUTOUT COLLAGE / HALFTONE GRAIN / SIGNAL COLOR", 50, 116, 215, 8, 13, PAPER, 5)
    end_page(c, 3)


def page_operation_extensions(c: canvas.Canvas) -> None:
    page_base(c, 4, "Project 001 / Extensions")
    eyebrow(c, "Campaign Extension / 02", MARGIN, 442)
    title_en(c, ["FROM POSTER", "TO SYSTEM."], MARGIN, 376, 34, 31)
    draw_paragraph(c, "统一网格把同一组视觉语言延伸至市集导视、摊位触点、社交内容与移动端运营卡片。", MARGIN, 274, 245, 9, 15)
    image_panel(c, IMAGES / "operation-market-activation.png", 320, 269, 606, 201, "cover", "Market activation / 01")
    image_panel(c, IMAGES / "operation-digital-system.png", 320, 62, 606, 195, "cover", "Digital system / 02")
    end_page(c, 4)


def page_packaging_hero(c: canvas.Canvas) -> None:
    page_base(c, 5, "Project 002 / Packaging")
    image_panel(c, IMAGES / "packaging-redesign/hero-dark.png", MARGIN, 62, 892, 408, "cover", "Packaging system / dark archive")
    fill(c, INK, 0.76)
    c.rect(54, 94, 346, 142, fill=1, stroke=0)
    eyebrow(c, "002 / Lan Mu Xiang", 72, 207)
    title_cn(c, "包装设计", 72, 166, 35)
    fill(c, PAPER)
    c.setFont(DISPLAY_FONT, 13)
    c.drawString(72, 136, "RICE PACKAGING SYSTEM")
    draw_paragraph(c, "以地域农耕文化和水稻生长过程建立从春种到冬藏的品牌叙事。", 72, 112, 300, 7.8, 12)
    end_page(c, 5)


def page_packaging_system(c: canvas.Canvas) -> None:
    page_base(c, 6, "Project 002 / System")
    eyebrow(c, "Season × Structure × Material", MARGIN, 442)
    title_en(c, ["FOUR SEASONS,", "ONE SYSTEM."], MARGIN, 390, 39, 34)
    seasons = ["season-spring.jpg", "season-summer.jpg", "season-autumn.jpg", "season-winter.jpg"]
    labels = ["Spring", "Summer", "Autumn", "Winter"]
    for i, name in enumerate(seasons):
        image_panel(c, IMAGES / f"packaging-redesign/{name}", 356 + i * 142, 268, 130, 202, "contain", labels[i])
    image_panel(c, IMAGES / "packaging-redesign/gift-box-extension.png", 356, 62, 276, 194, "cover", "Gift box extension")
    image_panel(c, IMAGES / "packaging-redesign/material-study.png", 644, 62, 282, 194, "cover", "Material study")
    glass_panel(c, MARGIN, 62, 286, 216)
    eyebrow(c, "Design logic", 52, 242, MUTED)
    draw_paragraph(c, "人物、稻穗与梯田组成四季图形；袋装、米砖腰封和四格礼盒共享相同识别结构。", 52, 212, 250, 9, 15, PAPER, 8)
    end_page(c, 6)


def page_sanfu_strategy(c: canvas.Canvas) -> None:
    page_base(c, 7, "Project 003 / Visual Campaign")
    eyebrow(c, "003 / Sanfu Triple-Match", MARGIN, 442, BLUE)
    title_cn(c, "生活新搭案", MARGIN, 390, 39)
    draw_paragraph(c, "以“生活搭子”为核心，把职场新人、大学宿舍与独行青年转化为亮、合、暖三阶段传播策略。", MARGIN, 350, 268, 9, 15)
    image_panel(c, IMAGES / "sanfu-campaign/campaign-hero.png", 350, 211, 576, 259, "cover", "Campaign hero / 01")
    cards = [("01", "一搭就“亮”", "#F4C327"), ("02", "一搭就“合”", "#FF6CA8"), ("03", "一搭就“暖”", "#7D36C8")]
    for i, (idx, label, color) in enumerate(cards):
        x = MARGIN + i * 298
        glass_panel(c, x, 62, 286, 126, i == 1)
        fill(c, HexColor(color))
        c.circle(x + 24, 158, 5, fill=1, stroke=0)
        fill(c, MUTED)
        c.setFont(MONO_FONT, 6.4)
        c.drawString(x + 16, 174, idx)
        fill(c, PAPER)
        c.setFont(CN_FONT, 18)
        c.drawString(x + 16, 118, label)
        fill(c, MUTED)
        c.setFont(CN_FONT, 7.2)
        c.drawString(x + 16, 90, ["职场新人", "大一新生", "独行青年"][i])
    end_page(c, 7)


def page_sanfu_extensions(c: canvas.Canvas) -> None:
    page_base(c, 8, "Project 003 / Activation")
    eyebrow(c, "Retail × Space × Digital", MARGIN, 442, BLUE)
    title_en(c, ["A PUZZLE", "BECOMES", "A PLACE."], MARGIN, 390, 31, 28)
    image_panel(c, IMAGES / "sanfu-campaign/workplace-activation.png", 350, 264, 576, 206, "cover", "Workplace activation")
    image_panel(c, IMAGES / "sanfu-campaign/campus-activation.png", 350, 62, 280, 190, "cover", "Campus activation")
    image_panel(c, IMAGES / "sanfu-campaign/social-system.png", 642, 62, 284, 190, "cover", "Social system")
    draw_paragraph(c, "拼图成为贯穿活动入口、互动装置、礼赠包装和数字内容的视觉与体验机制。", MARGIN, 270, 270, 9, 15)
    end_page(c, 8)


def page_horsh(c: canvas.Canvas) -> None:
    page_base(c, 9, "Project 004 / Poster")
    eyebrow(c, "004 / Everyday Growth", MARGIN, 442)
    title_cn(c, "成长日常", MARGIN, 392, 38)
    draw_paragraph(c, "以豪士面包为不变的视觉中心，通过童年玩具与成年职场物件替换，建立“小时候 / 长大后”的双联画。", MARGIN, 350, 232, 8.8, 15)
    image_panel(c, IMAGES / "poster-projects/horsh-childhood.jpg", 295, 62, 264, 408, "contain", "Childhood / 01")
    image_panel(c, IMAGES / "poster-projects/horsh-grown-up.jpg", 572, 62, 264, 408, "contain", "Grown-up / 02")
    fill(c, ACID)
    c.setFont(DISPLAY_FONT, 58)
    c.drawString(843, 226, "+")
    end_page(c, 9)


def page_daodao_intro(c: canvas.Canvas) -> None:
    page_base(c, 10, "Project 005 / Brand Design")
    eyebrow(c, "005 / Daodao Bar — After Eleven", MARGIN, 442, HexColor("#1F8ACC"))
    title_cn(c, "倒倒 bar", MARGIN, 392, 38)
    draw_paragraph(c, "以城市十一点后的短暂停顿为起点，把树懒、倾倒动作、酒杯轮廓与时间锚点组织成一套松弛的深夜品牌。", MARGIN, 350, 240, 9, 15)
    concepts = [("01", "慵懒"), ("02", "暂停"), ("03", "放松"), ("04", "虚度")]
    for i, (idx, label) in enumerate(concepts):
        y = 250 - i * 46
        fill(c, HexColor("#1F8ACC") if i == 0 else MUTED)
        c.setFont(MONO_FONT, 7)
        c.drawString(MARGIN, y, idx)
        fill(c, PAPER)
        c.setFont(CN_FONT, 13)
        c.drawString(74, y - 2, label)
    image_panel(c, IMAGES / "daodao-bar/extensions/bar-exterior-hero.png", 315, 62, 611, 408, "cover", "Night facade / AI-assisted extension")
    end_page(c, 10)


def page_daodao_extensions(c: canvas.Canvas) -> None:
    page_base(c, 11, "Project 005 / Brand Extensions")
    eyebrow(c, "11 PM / Spatial × Member × Retail", MARGIN, 442, HexColor("#1F8ACC"))
    title_en(c, ["POUR IT OUT.", "STAY A WHILE."], MARGIN, 390, 31, 29)
    image_panel(c, IMAGES / "daodao-bar/extensions/bar-counter-system.png", 348, 264, 578, 206, "cover", "Bar counter system")
    image_panel(c, IMAGES / "daodao-bar/extensions/eleven-pm-member-kit.png", 348, 62, 280, 190, "cover", "11 PM member kit")
    image_panel(c, IMAGES / "daodao-bar/extensions/takeaway-family.png", 640, 62, 286, 190, "cover", "Takeaway family")
    draw_paragraph(c, "门店、吧台、会员与外带触点共享同一组树懒角色、深蓝色和奶油纸张材质，让品牌在真实消费路径中保持连续。", MARGIN, 268, 270, 9, 15)
    end_page(c, 11)


def page_brand_hero(c: canvas.Canvas) -> None:
    page_base(c, 12, "Project 006 / Brand Design")
    image_panel(c, IMAGES / "my-may-brand/my-may-street-corner.png", MARGIN, 62, 892, 408, "cover", "Brand world / street corner")
    fill(c, INK, 0.75)
    c.rect(54, 92, 390, 148, fill=1, stroke=0)
    eyebrow(c, "006 / MY MAY Pizza", 72, 208, HexColor("#E1540F"))
    title_cn(c, "品牌设计", 72, 165, 35)
    fill(c, PAPER)
    c.setFont(DISPLAY_FONT, 13)
    c.drawString(72, 135, "A PAUSE, SERVED WARM.")
    draw_paragraph(c, "以“街角暂停键”为概念，为城市青年建立一间有猫咪陪伴的治愈系披萨店。", 72, 111, 330, 7.8, 12)
    end_page(c, 12)


def page_brand_system(c: canvas.Canvas) -> None:
    page_base(c, 13, "Project 006 / VI System")
    eyebrow(c, "Identity × Rules × Touchpoints", MARGIN, 442, HexColor("#E1540F"))
    title_en(c, ["FROM SYMBOL", "TO EXPERIENCE."], MARGIN, 390, 34, 31)
    draw_paragraph(c, "橙红猫咪抱着披萨的核心符号贯穿品牌规范、团队物料、数字传播与外带体验。", MARGIN, 292, 270, 9, 15)
    image_panel(c, IMAGES / "my-may-brand/original-identity.jpg", 350, 264, 236, 206, "contain", "Identity / 01")
    image_panel(c, IMAGES / "my-may-brand/my-may-staff-kit.png", 598, 264, 328, 206, "cover", "Staff & merch")
    image_panel(c, IMAGES / "my-may-brand/my-may-digital-system.png", 350, 62, 276, 190, "cover", "Digital system")
    image_panel(c, IMAGES / "my-may-brand/my-may-takeaway-system.png", 638, 62, 288, 190, "cover", "Takeaway system")
    glass_panel(c, MARGIN, 62, 284, 168)
    eyebrow(c, "VI rules", 52, 204, MUTED)
    for i, text in enumerate(["CLEAR SPACE / 1× CAT EAR", "MINIMUM / 24 PX", "ONE COLOR / ORANGE", "REVERSE / CREAM"]):
        fill(c, PAPER)
        c.setFont(MONO_FONT, 7)
        c.drawString(52, 178 - i * 28, text)
    end_page(c, 13)


def page_ip_hero(c: canvas.Canvas) -> None:
    page_base(c, 14, "Project 007 / IP Design")
    image_panel(c, IMAGES / "toss-diary/toss-hero-dark.png", MARGIN, 62, 892, 408, "cover", "Character hero / 01")
    fill(c, INK, 0.78)
    c.rect(54, 92, 398, 154, fill=1, stroke=0)
    eyebrow(c, "007 / TOSS DIARY", 72, 213, HexColor("#D8792C"))
    title_cn(c, "IP 角色设计", 72, 168, 35)
    fill(c, PAPER)
    c.setFont(DISPLAY_FONT, 12)
    c.drawString(72, 139, "EVERY LOAF STARTS A LITTLE STORY.")
    draw_paragraph(c, "双耳围合出的心形轮廓，成为一只热情、贪吃且富有行动力的烘焙兔子。", 72, 113, 330, 7.8, 12)
    end_page(c, 14)


def page_ip_system(c: canvas.Canvas) -> None:
    page_base(c, 15, "Project 007 / Character System")
    eyebrow(c, "Character × Expression × Digital", MARGIN, 442, HexColor("#D8792C"))
    title_en(c, ["ONE OUTLINE,", "MANY EMOTIONS."], MARGIN, 390, 30, 28)
    draw_paragraph(c, "从标准动作、十六种表情到聊天贴纸，角色在不同媒介中保持统一轮廓与语气。", MARGIN, 290, 272, 9, 15)
    image_panel(c, IMAGES / "toss-diary/toss-character-lineup.png", 350, 264, 576, 206, "cover", "Character lineup")
    image_panel(c, IMAGES / "toss-diary/toss-expression-system.png", 350, 62, 280, 190, "cover", "Expression system")
    image_panel(c, IMAGES / "toss-diary/toss-sticker-chat.png", 642, 62, 284, 190, "cover", "Chat sticker system")
    end_page(c, 15)


def page_ip_campaign(c: canvas.Canvas) -> None:
    page_base(c, 16, "Project 007 / Summer Campaign")
    eyebrow(c, "Summer Bakery Festival", MARGIN, 442, HexColor("#D8792C"))
    title_en(c, ["SUMMER,", "MADE BY HAND."], MARGIN, 390, 30, 28)
    draw_paragraph(c, "草地绿、面包橙与海岸蓝分别承接野餐、市集与海边音乐三种季节情绪。", MARGIN, 290, 258, 9, 15)
    posters = ["summer-poster-picnic.png", "summer-poster-market.png", "summer-poster-beach.png"]
    for i, name in enumerate(posters):
        image_panel(c, IMAGES / f"toss-diary/{name}", 316 + i * 128, 62, 116, 408, "contain", f"Poster / 0{i + 1}")
    image_panel(c, IMAGES / "toss-diary/summer-pop-up-market.png", 710, 264, 216, 206, "cover", "Pop-up market")
    image_panel(c, IMAGES / "toss-diary/summer-picnic-kit.png", 710, 62, 216, 190, "cover", "Picnic kit")
    end_page(c, 16)


def page_closing(c: canvas.Canvas) -> None:
    page_base(c, 17, "Capabilities / Contact")
    eyebrow(c, "What I bring", MARGIN, 442)
    title_en(c, ["FOUR WAYS", "I CREATE VALUE."], MARGIN, 385, 48, 42)
    strengths = [
        ("01", "视觉系统", "建立可持续的色彩、字体与版式语言。"),
        ("02", "品牌表达", "让概念拥有准确、鲜明且一致的形象。"),
        ("03", "AI 共创", "将生成式工具融入探索与视觉生产。"),
        ("04", "动态叙事", "用节奏设计让静态概念进入时间维度。"),
    ]
    for i, (idx, name, copy) in enumerate(strengths):
        x = MARGIN + i * 223
        glass_panel(c, x, 155, 211, 150, i == 2)
        fill(c, ACID)
        c.setFont(MONO_FONT, 7)
        c.drawString(x + 14, 282, idx)
        fill(c, PAPER)
        c.setFont(CN_FONT, 16)
        c.drawString(x + 14, 235, name)
        draw_paragraph(c, copy, x + 14, 204, 180, 7.8, 12, MUTED, 4)
    stroke(c, LINE)
    c.line(MARGIN, 120, PAGE_W - MARGIN, 120)
    fill(c, PAPER)
    c.setFont(DISPLAY_FONT, 22)
    c.drawString(MARGIN, 82, "LET'S MAKE SOMETHING CLEAR.")
    fill(c, ACID)
    c.setFont(MONO_FONT, 10)
    c.drawRightString(PAGE_W - MARGIN, 84, "241022998@qq.com")
    fill(c, MUTED)
    c.setFont(MONO_FONT, 6.6)
    c.drawString(MARGIN, 48, "AI · PS · AE · ID · CHATGPT · MIDJOURNEY · GEMINI · CLAUDE")
    end_page(c, 17)


PAGES = [
    page_cover,
    page_profile,
    page_operation_intro,
    page_operation_extensions,
    page_packaging_hero,
    page_packaging_system,
    page_sanfu_strategy,
    page_sanfu_extensions,
    page_horsh,
    page_daodao_intro,
    page_daodao_extensions,
    page_brand_hero,
    page_brand_system,
    page_ip_hero,
    page_ip_system,
    page_ip_campaign,
    page_closing,
]


def build_portfolio_pdf(output_path: Path | str) -> Path:
    register_fonts()
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(output), pagesize=(PAGE_W, PAGE_H), pageCompression=1)
    c.setTitle("王程程作品集 2026")
    c.setAuthor("王程程")
    c.setSubject("Visual / AI / Brand Design Portfolio")
    for render_page in PAGES:
        render_page(c)
    c.save()
    return output


if __name__ == "__main__":
    build_portfolio_pdf(ROOT / "output/pdf/wang-chengcheng-portfolio-2026.pdf")
