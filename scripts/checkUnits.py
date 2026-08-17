with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find a-online-safety section
start = content.find('id: "a-online-safety"')
# Find the units array
units_start = content.find('units: [', start)
# Find the matching ]
depth = 0
for i in range(units_start, len(content)):
    if content[i] == '[':
        depth += 1
    elif content[i] == ']':
        depth -= 1
        if depth == 0:
            units_end = i + 1
            break

units_text = content[units_start:units_end]
print("Units array last 200 chars:")
print(repr(units_text[-200:]))
