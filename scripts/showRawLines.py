with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Show lines around 1545-1555 with repr
with open("raw_lines.txt", "w", encoding="utf-8") as f:
    for i in range(1543, 1555):
        f.write(f"{i+1}: {repr(lines[i])}\n")

print("Done - check raw_lines.txt")
