with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Print lines around 341
for i in range(335, min(360, len(lines))):
    print(f"{i+1}: {lines[i].rstrip()}")
