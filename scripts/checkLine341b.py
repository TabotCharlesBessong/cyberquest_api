with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Print lines around 341 to file
with open("line341_check.txt", "w", encoding="utf-8") as f:
    for i in range(335, min(360, len(lines))):
        f.write(f"{i+1}: {lines[i].rstrip()}\n")

print("Done - check line341_check.txt")
