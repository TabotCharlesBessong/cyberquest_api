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

# Print units array
with open("units_array.txt", "w", encoding="utf-8") as f:
    for i in range(units_start, min(units_end + 5, len(lines))):
        f.write(f"{i+1}: {lines[i].rstrip()}\n")

print("Done - check units_array.txt")
