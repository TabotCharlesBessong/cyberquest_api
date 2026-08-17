with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find a-online-safety units array
start = content.find('id: "a-online-safety"')
units_start = content.find('units: [', start)

# Find matching ]
depth = 0
for i in range(units_start, len(content)):
    if content[i] == '[':
        depth += 1
    elif content[i] == ']':
        depth -= 1
        if depth == 0:
            units_end = i + 1
            break

actual_pos = units_end - 1

print(f"content[:actual_pos] ends with: {repr(content[actual_pos-20:actual_pos])}")
print(f"content[actual_pos:] starts with: {repr(content[actual_pos:actual_pos+20])}")
