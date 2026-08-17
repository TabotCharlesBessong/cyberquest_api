file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find all id/ageGroup pairs
matches = list(re.finditer(r'id: "([^"]+)"[\s\S]*?ageGroup: "([^"]+)"', content))
print(f"Found {len(matches)} id/ageGroup pairs")

for m in matches[:10]:
    print(f"  {m.group(1)} -> {m.group(2)}")
