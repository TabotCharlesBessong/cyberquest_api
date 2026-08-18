import re

with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find all section definitions
sections = re.findall(r'\{[^{}]*id:\s*"(a-[^"]+|b-[^"]+)"[^{}]*\}', content, re.DOTALL)
print(f"Found {len(sections)} sections")

# Better approach: find all top-level section IDs
lines = content.split("\n")
section_ids = []
for i, line in enumerate(lines):
    if line.strip().startswith('id: "a-') or line.strip().startswith('id: "b-'):
        if 'title: "' in line and 'units:' not in line:
            section_id = line.split('id: "')[1].split('"')[0]
            section_ids.append(section_id)

print(f"Section IDs: {len(section_ids)}")
for sid in section_ids:
    print(f"  {sid}")

# Find unit IDs within each section
unit_ids = []
for i, line in enumerate(lines):
    if 'lessons: [' in line and 'id: "' in line:
        # This might be a unit
        parts = line.split('id: "')
        if len(parts) > 1:
            unit_id = parts[1].split('"')[0]
            if unit_id.startswith('personal-info') or unit_id.startswith('device-basics') or unit_id.startswith('privacy-') or unit_id.startswith('social-') or unit_id.startswith('malware') or unit_id.startswith('online-') or unit_id.startswith('digital-') or unit_id.startswith('communication') or unit_id.startswith('kindness-') or unit_id.startswith('information') or unit_id.startswith('cybersecurity'):
                unit_ids.append(unit_id)

print(f"\nUnit IDs: {len(unit_ids)}")
for uid in unit_ids:
    print(f"  {uid}")
