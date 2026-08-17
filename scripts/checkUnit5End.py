with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find unit-5
start = None
for i, line in enumerate(lines):
    if 'unit-5' in line:
        start = i
        break

# Print 40 lines after unit-5
with open("unit5_end.txt", "w", encoding="utf-8") as f:
    for i in range(start, min(start + 40, len(lines))):
        f.write(f"{i+1}: {lines[i].rstrip()}\n")

print("Done - check unit5_end.txt")
