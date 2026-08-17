with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find SECTION_DEFS array
start = content.find('const SECTION_DEFS')
eq_pos = content.find('=', start)
array_start = content.find('[', eq_pos)

# Find the array end
depth = 0
array_end = -1
for i in range(array_start, len(content)):
    if content[i] == '[':
        depth += 1
    elif content[i] == ']':
        depth -= 1
        if depth == 0:
            array_end = i + 1
            break

array_text = content[array_start:array_end]

# Find all bare commas with context
import re
matches = list(re.finditer(r',\s*\n\s*,', array_text))
print(f"Found {len(matches)} bare commas")

with open("bare_commas.txt", "w", encoding="utf-8") as f:
    for i, match in enumerate(matches):
        pos = match.start()
        context_start = max(0, pos - 200)
        context_end = min(len(array_text), pos + 200)
        context = array_text[context_start:context_end]
        print(f"\n--- Bare comma {i+1} at position {pos} ---", file=f)
        print(context, file=f)
        print("---", file=f)

print("Done - check bare_commas.txt")
