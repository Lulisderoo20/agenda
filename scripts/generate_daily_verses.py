from __future__ import annotations

import json
import re
import time
from datetime import datetime, timezone
from urllib.error import HTTPError
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLAN_PATH = ROOT / "data" / "daily-verse-plan.json"
OUTPUT = ROOT / "data" / "daily-verses.json"
BROWSER_OUTPUT = ROOT / "data" / "daily-verses.js"
API_ROOT = "https://biblia-api.qhar.in"
USER_AGENT = "Mozilla/5.0 (Agenda Verse Generator)"
FALLBACK_VERSES = tuple(range(1, 13))

POSITIVE_TOKENS = {
    "dios",
    "jehova",
    "senor",
    "cristo",
    "jesus",
    "amor",
    "paz",
    "gracia",
    "esperanza",
    "verdad",
    "justicia",
    "bondad",
    "salvacion",
    "fortaleza",
    "sabiduria",
    "misericordia",
    "fe",
    "corazon",
    "gozo",
    "consuelo",
    "vida",
    "luz",
    "camino",
    "confiad",
    "bendito",
    "alegria",
    "guardar",
    "guardara",
    "consolar",
    "bienaventurado",
    "bendecir",
    "esperar",
}

NEGATIVE_TOKENS = {
    "ira",
    "muerte",
    "destruccion",
    "pecado",
    "castigo",
    "cadaver",
    "cadaveres",
    "fornicacion",
    "maldito",
    "maldicion",
    "espada",
    "sangre",
    "homicidio",
    "juicio",
    "condenacion",
    "infierno",
    "idolatria",
}


def api_get(path: str):
    url = f"{API_ROOT}{path}"
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def normalize(text: str) -> str:
    normalized = text.lower()
    replacements = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "ü": "u",
        "ñ": "n",
    }

    for source, target in replacements.items():
        normalized = normalized.replace(source, target)

    return normalized


def repair_text(text: str) -> str:
    repaired = text

    for _ in range(2):
        if not any(token in repaired for token in ("Ã", "Â", "â")):
            break

        try:
            repaired = repaired.encode("latin-1").decode("utf-8")
        except UnicodeError:
            break

    return repaired


def clean_text(text: str) -> str:
    cleaned = repair_text(text)
    cleaned = re.sub(r"\[\d+\]\s*", "", cleaned).strip()
    if re.match(r"^\d+\s+\w+", cleaned):
        parts = re.split(r"(?<=[.!?])\s+", cleaned, maxsplit=1)
        if len(parts) == 2:
            cleaned = parts[1]
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned


def score_verse(text: str, index: int, total: int) -> float:
    normalized = normalize(text)
    score = 0.0

    for token in POSITIVE_TOKENS:
        if token in normalized:
            score += 6.0

    for token in NEGATIVE_TOKENS:
        if token in normalized:
            score -= 5.5

    length_penalty = max(0, len(normalized) - 190) / 14
    score -= length_penalty

    target_index = max(1, round(total * 0.35))
    score -= abs(index - target_index) * 0.12

    if total >= 8 and index <= 2:
      score -= 1.5

    return score


def single_verse(book_id: str, chapter: int, verse: int) -> dict:
    encoded_book = urllib.parse.quote(book_id)
    return api_get(f"/book/{encoded_book}/chapter/{chapter}/verse/{verse}")


def load_plan() -> dict:
    if not PLAN_PATH.exists():
        raise FileNotFoundError(
            "No se encontro el plan base de versiculos. Ejecuta scripts/generate_verse_plan.py primero."
        )

    return json.loads(PLAN_PATH.read_text(encoding="utf-8"))


def candidate_verses(preferred: int) -> list[int]:
    candidates = []
    seen = set()

    for verse in (preferred, *FALLBACK_VERSES):
        if verse in seen:
            continue
        seen.add(verse)
        candidates.append(verse)

    return candidates


def build_entry(data: dict | list[dict], fallback_used: bool) -> dict:
    if isinstance(data, list):
        if not data:
            raise RuntimeError("La API devolvio una lista vacia para un versiculo.")
        data = data[0]

    raw_id = data.get("number") or data.get("id", 1)
    if isinstance(raw_id, str) and "." in raw_id:
        verse_number = int(raw_id.split(".")[-1])
    else:
        verse_number = int(raw_id)

    reference = repair_text(str(data.get("reference") or data.get("ref") or "")).strip()
    text = clean_text(str(data.get("content", "")))
    chapter_id = str(data.get("chapterId", ""))

    if chapter_id and "." in chapter_id:
        chapter = int(chapter_id.split(".")[1])
        book_id = chapter_id.split(".")[0]
    else:
        chapter = int(data.get("chapter", 0) or 0)
        book_id = str(data.get("bookId", ""))

    if not reference or not text:
        raise RuntimeError("La API devolvio un versiculo sin referencia o sin texto util.")

    return {
        "reference": reference,
        "text": text,
        "bookId": book_id,
        "chapter": chapter,
        "verse": verse_number,
        "fallbackUsed": fallback_used,
    }


def fetch_planned_verse(book_id: str, chapter: int, preferred_verse: int) -> dict:
    last_error = None

    for candidate in candidate_verses(preferred_verse):
        try:
            data = single_verse(book_id, chapter, candidate)
            return build_entry(data, fallback_used=candidate != preferred_verse)
        except HTTPError as error:
            if error.code == 404:
                last_error = error
                continue
            raise
        finally:
            time.sleep(0.08)

    raise RuntimeError(
        f"No se pudo obtener un versiculo valido para {book_id} {chapter}. "
        f"Ultimo error: {last_error}"
    )


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    plan = load_plan()

    verses = [
        fetch_planned_verse(
            book_id=item["bookId"],
            chapter=int(item["chapter"]),
            preferred_verse=int(item["preferredVerse"]),
        )
        for item in plan["baseVerses"]
    ]

    leap_plan = plan["leapDayVerse"]
    leap_day = fetch_planned_verse(
        book_id=leap_plan["bookId"],
        chapter=int(leap_plan["chapter"]),
        preferred_verse=int(leap_plan["preferredVerse"]),
    )

    if len(verses) != 365:
        raise RuntimeError(f"Se esperaban 365 versiculos base y se generaron {len(verses)}.")

    payload = {
        "source": "https://biblia-api.qhar.in",
        "translation": "Reina Valera 1909",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "baseVerseCount": len(verses),
        "baseVerses": verses,
        "leapDayVerse": leap_day,
    }

    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    BROWSER_OUTPUT.write_text(
        "window.AGENDA_DAILY_VERSES = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
