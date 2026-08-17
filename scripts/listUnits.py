with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find a-online-safety units
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

# Find all unit IDs in this section
with open("units_list.txt", "w", encoding="utf-8") as f:
    for i in range(units_start, min(units_start + 200, len(lines))):
        if 'id: "' in lines[i] and 'title: "' in lines[i]:
            # Extract id
            id_match = lines[i].split('id: "')[1].split('"')[0]
            f.write(f"Line {i+1}: {id_match}\n")
        if 'id: "a-kindness-online"' in lines[i]:
            break

print("Done - check units_list.txt")
