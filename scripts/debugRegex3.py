file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Test regex on a sample lesson
sample = content[8874:8874 + 1000]

# Try different regex patterns
patterns = [
    r'id: "([^"]+)"\s+title: "([^"]+)"\s+notes: "([^"]*)"',
    r'\{\s*id: "([^"]+)"[\s\S]*?title: "([^"]+)"[\s\S]*?notes: "([^"]*)"',
    r'id: "([^"]+)"[\s\S]*?title: "([^"]+)"[\s\S]*?notes: "([^"]*)"',
]

results = []
for i, p in enumerate(patterns):
    m = re.search(p, sample)
    if m:
        results.append(f"Pattern {i+1} matched: {m.group(1)}")
    else:
        results.append(f"Pattern {i+1} did not match")

# Try matching the actual structure
lesson_pattern = r'\{\s*id: "([^"]+)"[\s\S]*?difficulty: (\d+)[\s\S]*?questions: \[([\s\S]*?)\]'
m = re.search(lesson_pattern, sample)
if m:
    results.append(f"Lesson matched: {m.group(1)}, difficulty: {m.group(2)}, questions: {m.group(3).count('id: \"q')}")
else:
    results.append("No lesson match")

# Write results to file
with open("debug_results.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(results))

print("Done - check debug_results.txt")
