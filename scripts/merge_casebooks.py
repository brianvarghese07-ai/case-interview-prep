#!/usr/bin/env python3

import json
import os
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "public" / "data" / "cases.json"
SWIFT_SCRIPT = ROOT / "scripts" / "pdf_pages.swift"

CASEBOOKS = [
    {
        "year": 2024,
        "sourceBook": "IFSA Undergraduate Case Interview Handbook 2024",
        "pdf": Path("/Users/brianabr/Downloads/Casebook 2024.pdf"),
    },
    {
        "year": 2023,
        "sourceBook": "IFSA Undergraduate Case Interview Handbook 2023",
        "pdf": Path("/Users/brianabr/Downloads/IFSA Undergraduate Case Interview Handbook 2023.pdf"),
    },
]

CATEGORY_MAP = {
    "Revenue": "Profitability",
    "Pricing": "Pricing Strategy",
    "Market Growth": "Market Growth & Sizing",
    "Profitabilty": "Profitability",
}

NOISE_LINES = {
    "CASE OVERVIEW",
    "CASE OVERVIEW COMPANY",
    "CASE OVERVIEW COMPANY INDUSTRY DIFFICULTY",
    "CASE OVERVIEW COMPANY DIFFICULTY",
    "COMPANY",
    "INDUSTRY",
    "DIFFICULTY",
    "COMPANY DIFFICULTY",
    "COMPANY INDUSTRY DIFFICULTY",
    "INDUSTRY DIFFICULTY",
}

SECTION_RE = re.compile(r"^(?P<category>[A-Za-z& ]+?)\s*-\s*(?P<index>\d+)$")
EXPLICIT_SPEAKER_RE = re.compile(r"^(?P<speaker>I|Interviewer|C|Candidate)\s*:\s*(?P<text>.+)$", re.I)


def normalize_text(value):
    value = value.replace("\u2019", "'").replace("\u2018", "'")
    value = value.replace("\u201c", '"').replace("\u201d", '"')
    value = value.replace("\u2013", "-").replace("\u2014", "-")
    value = value.replace("\xa0", " ")
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def normalize_section(section):
    section = normalize_text(section)
    match = SECTION_RE.match(section)
    if not match:
        return section
    category = normalize_category(match.group("category"))
    return f"{category} - {int(match.group('index'))}"


def normalize_category(category):
    category = normalize_text(category)
    return CATEGORY_MAP.get(category, category)


def slugify(value):
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def run_swift_pages(pdf_path):
    env = os.environ.copy()
    env["SWIFT_MODULECACHE_PATH"] = "/tmp/swift-module-cache"
    env["CLANG_MODULE_CACHE_PATH"] = "/tmp/clang-module-cache"
    cmd = ["swift", str(SWIFT_SCRIPT), str(pdf_path)]
    output = subprocess.check_output(cmd, text=True, env=env)
    return json.loads(output)["pages"]


def clean_lines(text):
    text = text.replace("\r", "")
    text = re.sub(r"(\w)\n'\s*([a-zA-Z])", r"\1'\2", text)
    text = re.sub(r"(\w)\n'\n([a-zA-Z])", r"\1'\2", text)
    lines = []
    for raw in text.split("\n"):
        line = normalize_text(raw)
        if not line:
            continue
        if re.fullmatch(r"\d+", line):
            continue
        lines.append(line)
    return lines


def is_case_start_page(lines):
    if not lines:
        return False
    if not SECTION_RE.match(normalize_section(lines[0])):
        return False
    window = " ".join(lines[1:5])
    return "CASE OVERVIEW" in window


def extract_company_and_industry(lines, body_start_idx):
    meta_lines = lines[1:body_start_idx]
    company = ""
    industry = ""

    for idx, line in enumerate(meta_lines):
        if "COMPANY" in line and idx + 1 < len(meta_lines):
            candidate = meta_lines[idx + 1]
            if candidate not in NOISE_LINES:
                company = candidate
        if "INDUSTRY" in line and idx + 1 < len(meta_lines):
            candidate = meta_lines[idx + 1]
            if candidate not in NOISE_LINES and "DIFFICULTY" not in candidate:
                industry = candidate

    company = company or "Unknown"
    industry = industry or "General"
    return company, industry


def find_body_start(lines):
    for idx, line in enumerate(lines):
        if line.startswith("I:") or line.startswith("C:"):
            return idx
    header_indexes = [
        idx for idx, line in enumerate(lines[:8])
        if "CASE OVERVIEW" in line or "COMPANY" in line or "INDUSTRY" in line or "DIFFICULTY" in line
    ]
    if header_indexes:
        candidate = max(header_indexes) + 2
        if candidate < len(lines):
            return candidate
        return len(lines)
    for idx, line in enumerate(lines):
        if line not in NOISE_LINES and idx > 0:
            return idx
    return len(lines)


def collect_body_lines(pages, raw_section):
    body_lines = []
    for page_index, page in enumerate(pages):
        lines = clean_lines(page["text"])
        if lines and normalize_section(lines[0]) == normalize_section(raw_section):
            lines = lines[1:]

        filtered = [line for line in lines if line not in NOISE_LINES]
        if page_index == 0:
            start = find_body_start(clean_lines(pages[0]["text"]))
            first_page_lines = clean_lines(pages[0]["text"])
            filtered = [line for line in first_page_lines[start:] if line not in NOISE_LINES]
        body_lines.extend(filtered)

    return body_lines


def split_prompt_and_solution(body_lines):
    if not body_lines:
        return "", ""

    prompt_lines = []
    solution_lines = []
    candidate_start = None

    for idx, line in enumerate(body_lines):
        if line.startswith("C:"):
            candidate_start = idx
            break

    if body_lines[0].startswith("I:") and candidate_start is not None:
        prompt_lines = body_lines[:candidate_start]
        solution_lines = body_lines[candidate_start:]
    else:
        prompt_lines = body_lines[:1]
        solution_lines = body_lines[1:]

    prompt = " ".join(line[2:].strip() if line.startswith("I:") else line for line in prompt_lines).strip()
    solution = "\n".join(solution_lines).strip()
    return prompt, solution


def build_title(company, industry):
    return f"{industry} — {company}"


def parse_casebook(book):
    pages = run_swift_pages(book["pdf"])
    cases = []
    current = None

    for page in pages:
        lines = clean_lines(page["text"])
        if not lines:
            continue

        if is_case_start_page(lines):
            if current:
                cases.append(current)
            current = {
                "year": book["year"],
                "sourceBook": book["sourceBook"],
                "rawSection": normalize_section(lines[0]),
                "pages": [page],
            }
        elif current:
            section_line = normalize_section(lines[0]) if lines else ""
            if section_line == current["rawSection"]:
                current["pages"].append(page)
            elif "Section 2" in lines[0] or lines[0].startswith("Tips") or lines[0].startswith("Meet the Team"):
                break
            else:
                current["pages"].append(page)

    if current:
        cases.append(current)

    parsed = []
    for case in cases:
        first_lines = clean_lines(case["pages"][0]["text"])
        body_start_idx = find_body_start(first_lines)
        company, industry = extract_company_and_industry(first_lines, body_start_idx)
        body_lines = collect_body_lines(case["pages"], case["rawSection"])
        prompt, solution = split_prompt_and_solution(body_lines)
        category_match = SECTION_RE.match(case["rawSection"])
        category = normalize_category(category_match.group("category")) if category_match else "General"
        section_index = int(category_match.group("index")) if category_match else len(parsed) + 1

        parsed.append(
            {
                "slug": slugify(f"{book['year']}-{company}-{industry}-{category}-{section_index}"),
                "title": build_title(company, industry),
                "company": company,
                "industry": industry,
                "category": category,
                "difficulty": "Medium",
                "prompt": prompt,
                "solution": solution,
                "sourceSection": case["rawSection"],
                "sourceBook": book["sourceBook"],
                "year": book["year"],
            }
        )

    return parsed


def with_current_book_fields(cases):
    enriched = []
    for case in cases:
        item = dict(case)
        item.setdefault("sourceBook", "IFSA SSC Casebook 2025")
        item.setdefault("year", 2025)
        enriched.append(item)
    return enriched


def select_2025_base_cases(cases):
    base = []
    for case in cases:
        year = case.get("year")
        source_book = case.get("sourceBook")
        if year in (None, 2025) or source_book == "IFSA SSC Casebook 2025":
            base.append(case)
    return base


def main():
    existing = json.loads(DATA_PATH.read_text())
    merged = with_current_book_fields(select_2025_base_cases(existing))

    for book in CASEBOOKS:
        merged.extend(parse_casebook(book))

    for idx, case in enumerate(merged, start=1):
        case["id"] = idx

    DATA_PATH.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(merged)} cases to {DATA_PATH}")


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as exc:
        print(exc.stdout)
        print(exc.stderr, file=sys.stderr)
        raise
