file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Test on a-online-safety section
sid = "a-online-safety"
age = "A"

section_start = content.find(f'id: "{sid}"')
next_section = len(content)
for other_sid in ["a-kindness-online", "b-privacy-passwords", "a-malware-safety"]:
    pos = content.find(f'id: "{other_sid}"', section_start + 1)
    if pos != -1 and pos < next_section:
        next_section = pos

section_text = content[section_start:next_section]

lesson_pattern = r'\{\s*id: "([^"]+)"\s*,\s*title: "([^"]+)"\s*,\s*notes: "([^"]*)"\s*,\s*difficulty: (\d+)\s*,\s*questions: \[([\s\S]*?)\]\s*\}'

matches = list(re.finditer(lesson_pattern, section_text))
print(f"Found {len(matches)} lessons in {sid}")

for m in matches[:3]:
    q_count = m.group(5).count('id: "q')
    print(f"  Lesson {m.group(1)}: {q_count} questions")
