file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Test on a sample
sample = content[8874:8874 + 3000]

# Lesson pattern: must have notes, difficulty, and questions
# But NOT description, icon, or lessons (which are unit properties)
lesson_pattern = r'\{\s*id: "([^"]+)"\s*,\s*title: "([^"]+)"\s*,\s*notes: "([^"]*)"\s*,\s*difficulty: (\d+)\s*,\s*questions: \['

matches = list(re.finditer(lesson_pattern, sample))
print(f"Found {len(matches)} lessons in sample")

for m in matches[:5]:
    print(f"  Lesson: {m.group(1)}, title: {m.group(2)}, notes: {m.group(3)[:30]}..., difficulty: {m.group(4)}")
