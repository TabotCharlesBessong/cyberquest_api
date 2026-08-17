with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find a-online-safety units
start = None
for i, line in enumerate(lines):
    if 'id: "a-online-safety"' in line:
        start = i
        break

# Find units array
units_start = None
for i in range(start, min(start + 200, len(lines))):
    if 'units: [' in lines[i]:
        units_start = i
        break

# Print units array to file
with open("units_check.txt", "w", encoding="utf-8") as f:
    for i in range(units_start, min(units_start + 150, len(lines))):
        f.write(f"{i+1}: {lines[i].rstrip()}\n")

print("Done - check units_check.txt")
