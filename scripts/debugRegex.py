file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find the first lesson in the file
lesson_start = content.find('id: "what-is-personal"')
if lesson_start == -1:
    print("Lesson not found")
    exit(1)

# Get a chunk around the lesson
chunk = content[lesson_start - 50:lesson_start + 800]

# Try different regex patterns
patterns = [
    r'id: "([^"]+)"\s+title: "([^"]+)"\s+notes: "([^"]*)"\s+difficulty: (\d+)',
    r'\{[^}]*id: "([^"]+)"[^}]*notes: "([^"]*)"[^}]*difficulty: (\d+)',
    r'id: "([^"]+)"[\s\S]*?notes: "([^"]*)"',
    r'notes: "([^"]*)"',
]

for i, pattern in enumerate(patterns):
    match = re.search(pattern, chunk)
    if match:
        print(f"Pattern {i+1} matched: {match.group(0)[:100]}")
    else:
        print(f"Pattern {i+1} did not match")

# Show the actual chunk structure
print("\nActual chunk (first 500 chars):")
print(chunk[:500])
