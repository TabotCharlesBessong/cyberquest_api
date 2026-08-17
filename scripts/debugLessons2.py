file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Test on a single section
sid = "a-online-safety"
age = "A"

section_start = content.find(f'id: "{sid}"')
print(f"Section {sid} starts at: {section_start}")

# Find next section
next_section = len(content)
for other_sid in ["a-kindness-online", "b-privacy-passwords", "a-malware-safety"]:
    pos = content.find(f'id: "{other_sid}"', section_start + 1)
    if pos != -1 and pos < next_section:
        next_section = pos

print(f"Next section at: {next_section}")

section_text = content[section_start:next_section]
print(f"Section text length: {len(section_text)}")

# Try to find lessons
lesson_pattern = r'(\{\s*id: "([^"]+)"\s*,\s*title: "([^"]+)"\s*,\s*notes: "([^"]*)"\s*,\s*difficulty: (\d+)\s*,\s*questions: \[)([\s\S]*?)(\]\s*\})'

matches = list(re.finditer(lesson_pattern, section_text))
print(f"Found {len(matches)} lessons in section")

# Show first match if any
if matches:
    m = matches[0]
    print(f"First lesson: {m.group(2)}")
    print(f"Notes: {m.group(4)[:50]}...")
    print(f"Questions: {m.group(7).count('id: \"q')}")
else:
    # Try simpler pattern
    simple = r'notes: "([^"]*)"'
    simple_matches = list(re.finditer(simple, section_text))
    print(f"Found {len(simple_matches)} notes fields")
    
    # Show a sample
    if simple_matches:
        print(f"First notes: {simple_matches[0].group(1)[:50]}...")
