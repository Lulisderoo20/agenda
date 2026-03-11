from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

VIOLET = (109, 31, 93, 255)
BURGUNDY = (122, 24, 63, 255)
FUCHSIA = (223, 61, 162, 255)
CORAL = (255, 107, 119, 255)
ORANGE = (255, 140, 97, 255)
PAPER = (255, 248, 252, 255)
PAPER_SHADOW = (255, 234, 246, 255)
WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)


def blend(base: tuple[int, int, int, int], top: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    alpha_top = top[3] / 255.0
    alpha_base = base[3] / 255.0
    alpha_out = alpha_top + alpha_base * (1.0 - alpha_top)

    if alpha_out == 0:
        return TRANSPARENT

    red = int((top[0] * alpha_top + base[0] * alpha_base * (1.0 - alpha_top)) / alpha_out)
    green = int((top[1] * alpha_top + base[1] * alpha_base * (1.0 - alpha_top)) / alpha_out)
    blue = int((top[2] * alpha_top + base[2] * alpha_base * (1.0 - alpha_top)) / alpha_out)
    alpha = int(alpha_out * 255)
    return red, green, blue, alpha


def mix(first: tuple[int, int, int, int], second: tuple[int, int, int, int], ratio: float) -> tuple[int, int, int, int]:
    ratio = max(0.0, min(1.0, ratio))
    return tuple(
        int(first[index] + (second[index] - first[index]) * ratio)
        for index in range(4)
    )


def point_in_rounded_rect(x: float, y: float, left: float, top: float, right: float, bottom: float, radius: float) -> bool:
    nearest_x = min(max(x, left + radius), right - radius)
    nearest_y = min(max(y, top + radius), bottom - radius)
    delta_x = x - nearest_x
    delta_y = y - nearest_y
    return delta_x * delta_x + delta_y * delta_y <= radius * radius


def distance_to_segment(px: float, py: float, ax: float, ay: float, bx: float, by: float) -> float:
    delta_x = bx - ax
    delta_y = by - ay
    if delta_x == 0 and delta_y == 0:
      return math.hypot(px - ax, py - ay)

    projection = ((px - ax) * delta_x + (py - ay) * delta_y) / (delta_x * delta_x + delta_y * delta_y)
    projection = max(0.0, min(1.0, projection))
    closest_x = ax + projection * delta_x
    closest_y = ay + projection * delta_y
    return math.hypot(px - closest_x, py - closest_y)


def write_pixel(pixels: list[tuple[int, int, int, int]], size: int, x: int, y: int, color: tuple[int, int, int, int]) -> None:
    if x < 0 or y < 0 or x >= size or y >= size:
        return

    index = y * size + x
    pixels[index] = blend(pixels[index], color)


def fill_rounded_rect(
    pixels: list[tuple[int, int, int, int]],
    size: int,
    left: float,
    top: float,
    right: float,
    bottom: float,
    radius: float,
    color: tuple[int, int, int, int],
) -> None:
    start_x = max(0, int(left))
    end_x = min(size, int(math.ceil(right)))
    start_y = max(0, int(top))
    end_y = min(size, int(math.ceil(bottom)))

    for y in range(start_y, end_y):
        for x in range(start_x, end_x):
            if point_in_rounded_rect(x + 0.5, y + 0.5, left, top, right, bottom, radius):
                write_pixel(pixels, size, x, y, color)


def fill_circle(
    pixels: list[tuple[int, int, int, int]],
    size: int,
    center_x: float,
    center_y: float,
    radius: float,
    color: tuple[int, int, int, int],
) -> None:
    start_x = max(0, int(center_x - radius))
    end_x = min(size, int(math.ceil(center_x + radius)))
    start_y = max(0, int(center_y - radius))
    end_y = min(size, int(math.ceil(center_y + radius)))
    radius_squared = radius * radius

    for y in range(start_y, end_y):
        for x in range(start_x, end_x):
            delta_x = x + 0.5 - center_x
            delta_y = y + 0.5 - center_y
            if delta_x * delta_x + delta_y * delta_y <= radius_squared:
                write_pixel(pixels, size, x, y, color)


def draw_line(
    pixels: list[tuple[int, int, int, int]],
    size: int,
    ax: float,
    ay: float,
    bx: float,
    by: float,
    width: float,
    color: tuple[int, int, int, int],
) -> None:
    half = width / 2.0
    start_x = max(0, int(min(ax, bx) - half - 1))
    end_x = min(size, int(max(ax, bx) + half + 2))
    start_y = max(0, int(min(ay, by) - half - 1))
    end_y = min(size, int(max(ay, by) + half + 2))

    for y in range(start_y, end_y):
        for x in range(start_x, end_x):
            distance = distance_to_segment(x + 0.5, y + 0.5, ax, ay, bx, by)
            if distance <= half:
                write_pixel(pixels, size, x, y, color)


def stroke_circle(
    pixels: list[tuple[int, int, int, int]],
    size: int,
    center_x: float,
    center_y: float,
    radius: float,
    width: float,
    color: tuple[int, int, int, int],
) -> None:
    inner = max(0.0, radius - width / 2.0)
    outer = radius + width / 2.0
    start_x = max(0, int(center_x - outer))
    end_x = min(size, int(math.ceil(center_x + outer)))
    start_y = max(0, int(center_y - outer))
    end_y = min(size, int(math.ceil(center_y + outer)))
    inner_squared = inner * inner
    outer_squared = outer * outer

    for y in range(start_y, end_y):
        for x in range(start_x, end_x):
            delta_x = x + 0.5 - center_x
            delta_y = y + 0.5 - center_y
            distance = delta_x * delta_x + delta_y * delta_y
            if inner_squared <= distance <= outer_squared:
                write_pixel(pixels, size, x, y, color)


def background_color(x: int, y: int, size: int) -> tuple[int, int, int, int]:
    diagonal = (0.62 * x + y) / (1.62 * max(1, size - 1))

    if diagonal < 0.55:
        base = mix(VIOLET, FUCHSIA, diagonal / 0.55)
    else:
        base = mix(FUCHSIA, ORANGE, (diagonal - 0.55) / 0.45)

    glow_right = max(0.0, 1.0 - math.hypot(x - size * 0.82, y - size * 0.18) / (size * 0.38))
    glow_left = max(0.0, 1.0 - math.hypot(x - size * 0.18, y - size * 0.88) / (size * 0.45))
    brightened = mix(base, WHITE, glow_right * 0.18 + glow_left * 0.08)
    return brightened


def render_icon(size: int) -> list[tuple[int, int, int, int]]:
    pixels: list[tuple[int, int, int, int]] = [TRANSPARENT for _ in range(size * size)]
    radius = size * 0.23

    for y in range(size):
        for x in range(size):
            if point_in_rounded_rect(x + 0.5, y + 0.5, 0, 0, size, size, radius):
                pixels[y * size + x] = background_color(x, y, size)

    fill_circle(pixels, size, size * 0.80, size * 0.20, size * 0.16, (255, 255, 255, 34))
    fill_circle(pixels, size, size * 0.20, size * 0.84, size * 0.21, (255, 255, 255, 18))
    fill_rounded_rect(
        pixels,
        size,
        size * 0.21,
        size * 0.23,
        size * 0.79,
        size * 0.83,
        size * 0.12,
        (122, 24, 63, 44),
    )
    fill_rounded_rect(
        pixels,
        size,
        size * 0.25,
        size * 0.21,
        size * 0.75,
        size * 0.76,
        size * 0.11,
        mix(WHITE, PAPER, 0.45),
    )

    fill_rounded_rect(
        pixels,
        size,
        size * 0.32,
        size * 0.34,
        size * 0.58,
        size * 0.39,
        size * 0.02,
        BURGUNDY,
    )
    fill_rounded_rect(
        pixels,
        size,
        size * 0.32,
        size * 0.46,
        size * 0.53,
        size * 0.51,
        size * 0.02,
        mix(BURGUNDY, FUCHSIA, 0.55),
    )
    fill_rounded_rect(
        pixels,
        size,
        size * 0.32,
        size * 0.58,
        size * 0.62,
        size * 0.63,
        size * 0.02,
        mix(FUCHSIA, CORAL, 0.4),
    )

    fill_circle(pixels, size, size * 0.63, size * 0.53, size * 0.10, (109, 31, 93, 24))
    stroke_circle(pixels, size, size * 0.63, size * 0.53, size * 0.071, size * 0.028, VIOLET)
    draw_line(
        pixels,
        size,
        size * 0.58,
        size * 0.53,
        size * 0.62,
        size * 0.57,
        size * 0.028,
        CORAL,
    )
    draw_line(
        pixels,
        size,
        size * 0.62,
        size * 0.57,
        size * 0.70,
        size * 0.47,
        size * 0.028,
        CORAL,
    )
    return pixels


def write_png(path: Path, size: int, pixels: list[tuple[int, int, int, int]]) -> None:
    raw = bytearray()
    for row in range(size):
        raw.append(0)
        for column in range(size):
            red, green, blue, alpha = pixels[row * size + column]
            raw.extend((red, green, blue, alpha))

    image_data = zlib.compress(bytes(raw), 9)
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)

    def chunk(name: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + name
            + data
            + struct.pack(">I", zlib.crc32(name + data) & 0xFFFFFFFF)
        )

    png = b"".join(
        [
            b"\x89PNG\r\n\x1a\n",
            chunk(b"IHDR", ihdr),
            chunk(b"IDAT", image_data),
            chunk(b"IEND", b""),
        ]
    )
    path.write_bytes(png)


def write_ico(path: Path, png_data: bytes, size: int) -> None:
    header = struct.pack("<HHH", 0, 1, 1)
    entry = struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(png_data), 22)
    path.write_bytes(header + entry + png_data)


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)

    outputs = {
        "agenda-icon-64.png": 64,
        "agenda-icon-180.png": 180,
        "agenda-icon-192.png": 192,
        "agenda-icon-512.png": 512,
    }

    rendered: dict[str, bytes] = {}

    for filename, size in outputs.items():
        pixels = render_icon(size)
        path = ASSETS / filename
        write_png(path, size, pixels)
        rendered[filename] = path.read_bytes()

    write_ico(ASSETS / "agenda-icon.ico", rendered["agenda-icon-64.png"], 64)


if __name__ == "__main__":
    main()
