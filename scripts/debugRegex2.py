file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Test regex on a sample lesson
sample = content[8874:8874 + 1000]
print("Sample lesson:")
print(sample[:500])

# Try different regex patterns
patterns = [
    r'id: "([^"]+)"\s+title: "([^"]+)"\s+notes: "([^"]*)"',
    r'\{\s*id: "([^"]+)"[\s\S]*?title: "([^"]+)"[\s\S]*?notes: "([^"]*)"',
    r'id: "([^"]+)"[\s\S]*?title: "([^"]+)"[\s\S]*?notes: "([^"]*)"',
]

for i, p in enumerate(patterns):
    m = re.search(p, sample)
    if m:
        print(f"Pattern {i+1} matched: {m.group(1)}")
    else:
        print(f"Pattern {i+1} did not match")

# Try matching the actual structure
print("\nTrying to match lesson block...")
lesson_pattern = r'\{\s*id: "([^"]+)"[\s\S]*?difficulty: (\d+)[\s\S]*?questions: \[([\s\S]*?)\]'
m = re.search(lesson_pattern, sample)
if m:
    print(f"Matched lesson: {m.group(1)}, difficulty: {m.group(2)}, questions: {m.group(3).count('id: \"q')}")
else:
    print("No lesson match")
