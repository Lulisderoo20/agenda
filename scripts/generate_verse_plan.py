from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "daily-verse-plan.json"

BOOK_CHAPTERS = [
    ("PSA", 150, 0),
    ("PRO", 31, 1),
    ("MAT", 28, 2),
    ("JHN", 21, 3),
    ("LUK", 24, 4),
    ("ROM", 16, 5),
    ("HEB", 13, 6),
    ("PHP", 4, 7),
    ("JAS", 5, 8),
    ("1PE", 5, 9),
    ("1JN", 5, 10),
    ("EPH", 6, 11),
    ("GAL", 6, 12),
    ("COL", 4, 13),
    ("ECC", 12, 14),
    ("1CO", 16, 15),
    ("2CO", 13, 16),
    ("1TH", 5, 17),
    ("PHM", 1, 18),
]

LEAP_DAY_VERSE = {"bookId": "ISA", "chapter": 40, "preferredVerse": 31}


def preferred_verse(chapter: int, book_offset: int) -> int:
    return 1 + ((chapter * 5 + book_offset * 3) % 8)


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    verses = []

    for book_id, chapter_count, offset in BOOK_CHAPTERS:
        for chapter in range(1, chapter_count + 1):
            verses.append(
                {
                    "bookId": book_id,
                    "chapter": chapter,
                    "preferredVerse": preferred_verse(chapter, offset),
                }
            )

    if len(verses) != 365:
        raise RuntimeError(f"Se esperaban 365 referencias base y se generaron {len(verses)}.")

    payload = {
        "baseVerseCount": len(verses),
        "baseVerses": verses,
        "leapDayVerse": LEAP_DAY_VERSE,
    }

    OUTPUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
