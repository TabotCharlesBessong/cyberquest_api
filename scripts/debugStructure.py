file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find a-online-safety section
start_idx = None
for i, line in enumerate(lines):
    if 'id: "a-online-safety"' in line:
        start_idx = i
        break

# Find the units array end - print lines around where units close
for i in range(start_idx, min(start_idx + 500, len(lines))):
    line = lines[i].rstrip()
    if 'units:' in line or ('],' in line and i > start_idx + 10) or ('},' in line and i > start_idx + 10):
        print(f"{i + 1}: {line}")
