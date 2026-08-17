with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find a-online-safety section end
start = None
for i, line in enumerate(lines):
    if 'id: "a-online-safety"' in line:
        start = i
        break

# Find the closing } of the section
for i in range(start, min(start + 2000, len(lines))):
    if lines[i].strip() == '},' and i+1 < len(lines) and 'id: "a-kindness-online"' in lines[i+1]:
        print(f"Section ends around line {i+1}")
        for j in range(max(0, i-10), min(len(lines), i+5)):
            print(f"{j+1}: {lines[j].rstrip()}")
        break
