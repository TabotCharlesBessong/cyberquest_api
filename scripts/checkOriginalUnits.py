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

print('units_end char:', repr(content[units_end-1]))
print('units_end+1 char:', repr(content[units_end]))
print('units_end+2 char:', repr(content[units_end+1]))
print('units_end+3 char:', repr(content[units_end+2]))
print()
print('Last 100 chars of units array:')
print(repr(content[units_start:units_end][-100:]))
