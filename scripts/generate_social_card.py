from __future__ import annotations

from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUTPUT = ASSETS / "social-card.png"
ICON = ASSETS / "agenda-icon-512.png"

WIDTH = 1200
HEIGHT = 630

BG = (255, 247, 251)
VIOLET = (109, 31, 93)
BURGUNDY = (122, 24, 63)
FUCHSIA = (223, 61, 162)
CORAL = (255, 107, 119)
ORANGE = (255, 140, 97)
PAPER = (255, 250, 252)
INK = (54, 22, 42)
MUTED = (112, 79, 100)

GEORGIA = Path("C:/Windows/Fonts/georgia.ttf")
GEORGIA_BOLD = Path("C:/Windows/Fonts/georgiab.ttf")


def lerp(first: tuple[int, int, int], second: tuple[int, int, int], ratio: float) -> tuple[int, int, int]:
    ratio = max(0.0, min(1.0, ratio))
    return tuple(int(first[index] + (second[index] - first[index]) * ratio) for index in range(3))


def make_gradient(width: int, height: int) -> Image.Image:
    image = Image.new("RGB", (width, height), BG)
    pixels = image.load()

    for y in range(height):
        vertical = y / max(1, height - 1)
        base = lerp((255, 248, 252), (255, 238, 247), vertical)
        for x in range(width):
            horizontal = x / max(1, width - 1)
            tint = lerp(VIOLET, ORANGE, (horizontal * 0.55) + (vertical * 0.45))
            mix_ratio = 0.08 + (horizontal * 0.04)
            pixels[x, y] = lerp(base, tint, mix_ratio)

    return image


def add_glow(image: Image.Image, center: tuple[int, int], radius: int, color: tuple[int, int, int], opacity: int) -> None:
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    bounds = (
        center[0] - radius,
        center[1] - radius,
        center[0] + radius,
        center[1] + radius,
    )
    draw.ellipse(bounds, fill=(*color, opacity))
    blurred = layer.filter(ImageFilter.GaussianBlur(radius // 2))
    image.alpha_composite(blurred)


def rounded_gradient(size: tuple[int, int], first: tuple[int, int, int], second: tuple[int, int, int], radius: int) -> Image.Image:
    width, height = size
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    pixels = layer.load()

    for y in range(height):
        vertical = y / max(1, height - 1)
        row_color = lerp(first, second, vertical)
        for x in range(width):
            horizontal = x / max(1, width - 1)
            tint = lerp(FUCHSIA, ORANGE, horizontal * 0.55)
            pixels[x, y] = (*lerp(row_color, tint, 0.16), 255)

    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, width, height), radius=radius, fill=255)
    layer.putalpha(mask)
    return layer


def wrap_for_width(text: str, font: ImageFont.FreeTypeFont, max_width: int, draw: ImageDraw.ImageDraw) -> str:
    words = text.split()
    lines: list[str] = []
    current = ""

    for word in words:
        proposal = f"{current} {word}".strip()
        if draw.textlength(proposal, font=font) <= max_width:
            current = proposal
            continue

        if current:
            lines.append(current)
        current = word

    if current:
        lines.append(current)

    return "\n".join(lines)


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)

    base = make_gradient(WIDTH, HEIGHT).convert("RGBA")
    add_glow(base, (975, 130), 150, (255, 255, 255), 74)
    add_glow(base, (190, 555), 190, FUCHSIA, 46)
    add_glow(base, (1080, 550), 210, ORANGE, 58)

    draw = ImageDraw.Draw(base)
    panel = rounded_gradient((1128, 558), VIOLET, BURGUNDY, 36)
    base.alpha_composite(panel, (36, 36))

    glass = Image.new("RGBA", base.size, (0, 0, 0, 0))
    glass_draw = ImageDraw.Draw(glass)
    glass_draw.rounded_rectangle((70, 68, 1132, 560), radius=34, outline=(255, 255, 255, 64), width=2)
    base.alpha_composite(glass)

    icon_back = Image.new("RGBA", (148, 148), (255, 255, 255, 0))
    icon_draw = ImageDraw.Draw(icon_back)
    icon_draw.rounded_rectangle((0, 0, 148, 148), radius=42, fill=(255, 255, 255, 44))
    icon_draw.rounded_rectangle((12, 12, 136, 136), radius=34, fill=(*PAPER, 255))
    base.alpha_composite(icon_back, (94, 88))

    icon = Image.open(ICON).convert("RGBA").resize((102, 102))
    base.alpha_composite(icon, (117, 111))

    serif_big = load_font(GEORGIA_BOLD, 84)
    serif_mid = load_font(GEORGIA_BOLD, 32)
    serif_body = load_font(GEORGIA, 31)
    serif_small = load_font(GEORGIA, 24)

    draw = ImageDraw.Draw(base)
    draw.text((96, 274), "Agenda", font=serif_big, fill=(255, 249, 252))

    subtitle = wrap_for_width(
        "Tu agenda bella, minimalista y lista para acompañar cada día con calma, foco y un toque de fe.",
        serif_body,
        560,
        draw,
    )
    draw.multiline_text((96, 368), subtitle, font=serif_body, fill=(255, 241, 247), spacing=10)

    pill_bounds = (96, 514, 474, 566)
    draw.rounded_rectangle(pill_bounds, radius=26, fill=(122, 24, 63, 122), outline=(255, 255, 255, 84))
    draw.text((126, 527), "Con Cristo todo estará bien.", font=serif_small, fill=(255, 249, 252))

    device = Image.new("RGBA", base.size, (0, 0, 0, 0))
    device_draw = ImageDraw.Draw(device)
    device_draw.rounded_rectangle((760, 92, 1092, 530), radius=56, fill=(255, 255, 255, 24))
    device_draw.rounded_rectangle((784, 116, 1068, 506), radius=40, fill=(255, 250, 252, 255))
    device_draw.rounded_rectangle((820, 150, 972, 178), radius=14, fill=BURGUNDY)
    device_draw.rounded_rectangle((820, 200, 930, 226), radius=13, fill=(165, 59, 114, 170))
    device_draw.rounded_rectangle((820, 250, 984, 276), radius=13, fill=(223, 61, 162, 120))
    device_draw.rounded_rectangle((820, 322, 1034, 404), radius=28, fill=(255, 237, 246, 255), outline=(234, 200, 220))
    device_draw.text((842, 342), "Versículo del día", font=serif_small, fill=INK)
    device_draw.text((842, 374), "Hoy, con paz y claridad.", font=serif_small, fill=MUTED)
    button_bounds = (820, 432, 1028, 480)
    device_draw.rounded_rectangle(button_bounds, radius=24, fill=VIOLET)
    button_label = "Nueva tarea"
    button_box = device_draw.textbbox((0, 0), button_label, font=serif_body)
    button_width = button_box[2] - button_box[0]
    button_height = button_box[3] - button_box[1]
    button_x = button_bounds[0] + ((button_bounds[2] - button_bounds[0]) - button_width) / 2
    button_y = button_bounds[1] + ((button_bounds[3] - button_bounds[1]) - button_height) / 2 - 4
    device_draw.text((button_x, button_y), button_label, font=serif_body, fill=(255, 249, 252))
    base.alpha_composite(device)

    accent = Image.new("RGBA", base.size, (0, 0, 0, 0))
    accent_draw = ImageDraw.Draw(accent)
    accent_draw.ellipse((992, 62, 1118, 188), fill=(255, 255, 255, 28))
    accent_draw.ellipse((670, 462, 772, 564), fill=(255, 255, 255, 16))
    base.alpha_composite(accent.filter(ImageFilter.GaussianBlur(2)))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    base.save(OUTPUT, format="PNG", optimize=True)


if __name__ == "__main__":
    main()
