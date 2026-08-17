with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find units in a-online-safety
in_section = False
unit_count = 0
for i, line in enumerate(lines):
    if 'id: "a-online-safety"' in line:
        in_section = True
    if in_section and 'id: "a-kindness-online"' in line:
        break
    if in_section and 'id: "unit-' in line:
        unit_count += 1
        print(f"Unit at line {i+1}: {line.rstrip()}")

print(f"Total units found: {unit_count}")
