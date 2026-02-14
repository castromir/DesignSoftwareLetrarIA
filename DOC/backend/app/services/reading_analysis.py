from dataclasses import dataclass
from difflib import SequenceMatcher
import re
from typing import List, Dict


WORD_PATTERN = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ']+")
PUNCTUATION_PATTERN = re.compile(r"[.!?]")


@dataclass
class ReadingAnalysisResult:
    total_words: int
    correct_words: int
    words_per_minute: float | None
    accuracy_score: float | None
    fluency_score: float | None
    prosody_score: float | None
    overall_score: float | None
    errors: List[Dict[str, str]]
    improvement_points: List[str]


def _tokenize(text: str) -> List[str]:
    return WORD_PATTERN.findall(text.lower())


def _extract_sentences(text: str) -> List[str]:
    sentences = re.split(r"[.!?]+", text)
    return [sentence.strip() for sentence in sentences if sentence.strip()]


def analyze_reading(
    transcription: str,
    reference_text: str,
    duration_seconds: float,
) -> ReadingAnalysisResult:
    spoken_words = _tokenize(transcription)
    expected_words = _tokenize(reference_text)

    total_words = len(expected_words) or len(spoken_words)

    matcher = SequenceMatcher(None, expected_words, spoken_words)

    correct_words = 0
    errors: List[Dict[str, str]] = []

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            correct_words += i2 - i1
        elif tag == "replace":
            for expected, spoken in zip(expected_words[i1:i2], spoken_words[j1:j2]):
                errors.append(
                    {
                        "expected": expected,
                        "spoken": spoken,
                    }
                )
        elif tag == "delete":
            for expected in expected_words[i1:i2]:
                errors.append(
                    {
                        "expected": expected,
                        "spoken": "",
                    }
                )
        elif tag == "insert":
            for spoken in spoken_words[j1:j2]:
                errors.append(
                    {
                        "expected": "",
                        "spoken": spoken,
                    }
                )

    words_per_minute = None
    if duration_seconds and duration_seconds > 0 and spoken_words:
        minutes = duration_seconds / 60
        if minutes > 0:
            words_per_minute = len(spoken_words) / minutes

    accuracy_score = None
    if spoken_words:
        accuracy_score = (correct_words / len(spoken_words)) * 100

    fluency_score = None
    if words_per_minute is not None:
        fluency_score = max(0.0, min(100.0, (words_per_minute / 120) * 100))

    expected_punctuation = len(PUNCTUATION_PATTERN.findall(reference_text))
    spoken_punctuation = len(PUNCTUATION_PATTERN.findall(transcription))
    prosody_score = None
    if expected_punctuation > 0:
        prosody_score = max(
            0.0,
            min(
                100.0,
                (spoken_punctuation / expected_punctuation) * 100,
            ),
        )

    overall_components = [
        value
        for value in (accuracy_score, fluency_score, prosody_score)
        if value is not None
    ]
    overall_score = sum(overall_components) / len(overall_components) if overall_components else None

    improvement_points: List[str] = []
    if errors:
        unique_expected = {error["expected"] for error in errors if error["expected"]}
        for word in list(unique_expected)[:5]:
            improvement_points.append(f"Revisar a palavra '{word}'.")

    if prosody_score is not None and prosody_score < 60:
        improvement_points.append("Praticar a leitura com entonação e pausas adequadas.")

    if fluency_score is not None and fluency_score < 60:
        improvement_points.append("Incentivar leitura com ritmo constante para melhorar a fluência.")

    return ReadingAnalysisResult(
        total_words=total_words,
        correct_words=correct_words,
        words_per_minute=words_per_minute,
        accuracy_score=accuracy_score,
        fluency_score=fluency_score,
        prosody_score=prosody_score,
        overall_score=overall_score,
        errors=errors,
        improvement_points=improvement_points,
    )

