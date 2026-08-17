with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find a-online-safety units array
start = None
for i, line in enumerate(lines):
    if 'id: "a-online-safety"' in line:
        start = i
        break

units_start = None
for i in range(start, min(start + 200, len(lines))):
    if 'units: [' in lines[i]:
        units_start = i
        break

# Find end of units array
depth = 0
units_end = None
for i in range(units_start, len(lines)):
    for char in lines[i]:
        if char == '[':
            depth += 1
        elif char == ']':
            depth -= 1
            if depth == 0:
                units_end = i
                break
    if units_end is not None:
        break

# Count units and show boundaries
unit_count = 0
with open("units_boundaries.txt", "w", encoding="utf-8") as f:
    for i in range(units_start, min(units_end + 5, len(lines))):
        stripped = lines[i].strip()
        if stripped == '{' or (stripped.startswith('{') and 'id:' in stripped):
            unit_count += 1
            f.write(f"Unit {unit_count} starts at line {i+1}: {lines[i].rstrip()}\n")
        if stripped == '},' and unit_count > 0:
            f.write(f"Unit {unit_count} ends at line {i+1}: {lines[i].rstrip()}\n\n")

print(f"Found {unit_count} units in a-online-safety")
