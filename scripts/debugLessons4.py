file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find a specific lesson
lesson_start = content.find('id: "what-is-personal"')
sample = content[lesson_start - 100:lesson_start + 600]

print("Sample around what-is-personal:")
# Write to file to avoid encoding issues
with open("sample_lesson.txt", "w", encoding="utf-8") as f:
    f.write(sample)

# Test regex
lesson_pattern = r'\{\s*id: "([^"]+)"\s*,\s*title: "([^"]+)"\s*,\s*notes: "([^"]*)"\s*,\s*difficulty: (\d+)\s*,\s*questions: \['
m = re.search(lesson_pattern, sample)
if m:
    print(f"Matched: {m.group(1)}")
else:
    print("No match")
    
# Try without the leading \{
pattern2 = r'id: "([^"]+)"\s*,\s*title: "([^"]+)"\s*,\s*notes: "([^"]*)"\s*,\s*difficulty: (\d+)\s*,\s*questions: \['
m2 = re.search(pattern2, sample)
if m2:
    print(f"Pattern2 matched: {m2.group(1)}")
else:
    print("Pattern2 no match")
