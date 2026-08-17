file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Test the regex on a small sample
sample = content[content.find('id: "a-online-safety"'):content.find('id: "a-online-safety"') + 5000]

lesson_pattern = r'\{\s*id: "([^"]+)"[\s\S]*?notes: "([^"]*)"[\s\S]*?difficulty: (\d+),[\s\S]*?questions: \[([\s\S]*?)\]\s*\}'

matches = list(re.finditer(lesson_pattern, sample))
print(f"Found {len(matches)} lessons in sample")

for m in matches[:3]:
    print(f"  Lesson: {m.group(1)}, notes length: {len(m.group(2))}, difficulty: {m.group(3)}, questions: {m.group(4).count('id: \"q')}")
