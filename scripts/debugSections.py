file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# Find SECTION_DEFS start
start_idx = None
for i, line in enumerate(lines):
    if "const SECTION_DEFS" in line:
        start_idx = i
        break

if start_idx is None:
    print("Could not find SECTION_DEFS")
    exit(1)

print(f"SECTION_DEFS starts at line {start_idx}")

# Find sections by tracking top-level objects
sections = []
depth = 0
section_start = None

for i in range(start_idx, len(lines)):
    line = lines[i]
    
    for char in line:
        if char == '{':
            depth += 1
            if section_start is None and depth == 1:
                section_start = i
        elif char == '}':
            depth -= 1
            if section_start is not None and depth == 0:
                # Found end of top-level object (section)
                section_text = ''.join(lines[section_start:i + 1])
                id_match = None
                for j in range(section_start, i + 1):
                    if 'id: "' in lines[j]:
                        id_match = lines[j].split('id: "')[1].split('"')[0]
                        break
                if id_match:
                    sections.append({
                        'id': id_match,
                        'start': section_start,
                        'end': i
                    })
                section_start = None

print(f"Found {len(sections)} sections:")
for s in sections:
    print(f"  {s['id']}: lines {s['start']}-{s['end']}")

# Count units in each section
for s in sections:
    section_lines = lines[s['start']:s['end'] + 1]
    unit_count = 0
    for line in section_lines:
        if line.strip().startswith('{') and 'id: "' in line:
            unit_count += 1
    print(f"  {s['id']}: ~{unit_count} nested objects")
