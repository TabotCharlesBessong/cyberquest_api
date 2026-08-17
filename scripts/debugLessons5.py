file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

sid = "a-online-safety"
section_start = content.find(f'id: "{sid}"')
next_section = len(content)
for other_sid in ["a-kindness-online", "b-privacy-passwords", "a-malware-safety"]:
    pos = content.find(f'id: "{other_sid}"', section_start + 1)
    if pos != -1 and pos < next_section:
        next_section = pos

section_text = content[section_start:next_section]

print(f"Section text length: {len(section_text)}")
print(f"Section start: {section_start}, next_section: {next_section}")

# Check if the lesson is in section_text
lesson_id = "what-is-personal"
if lesson_id in section_text:
    print(f"Found {lesson_id} in section_text")
    pos = section_text.find(lesson_id)
    print(f"Position in section_text: {pos}")
    print(f"Context: {repr(section_text[pos-50:pos+100])}")
else:
    print(f"{lesson_id} NOT in section_text")

# Try regex on section_text
lesson_pattern = r'\{\s*id: "([^"]+)"\s*,\s*title: "([^"]+)"\s*,\s*notes: "([^"]*)"\s*,\s*difficulty: (\d+)\s*,\s*questions: \['
matches = list(re.finditer(lesson_pattern, section_text))
print(f"Regex matches in section_text: {len(matches)}")
