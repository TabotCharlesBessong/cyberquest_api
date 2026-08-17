with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find SECTION_DEFS array
start = content.find('const SECTION_DEFS')
if start == -1:
    print("Could not find SECTION_DEFS")
    exit(1)

# Find the array start after the type annotation
eq_pos = content.find('=', start)
if eq_pos == -1:
    print("Could not find =")
    exit(1)

array_start = content.find('[', eq_pos)
if array_start == -1:
    print("Could not find array start")
    exit(1)

# Parse the array by bracket counting
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

# Count sections, units, lessons, questions
section_count = array_text.count('id: "a-')
unit_count = array_text.count('id: "unit-')
lesson_count = array_text.count('id: "l')
question_count = array_text.count('id: "q')

print(f"Sections found: {section_count}")
print(f"Units found: {unit_count}")
print(f"Lessons found: {lesson_count}")
print(f"Questions found: {question_count}")

# Check for undefined or missing values
import re

# Check for any bare commas that might indicate undefined values
# Look for patterns like `}, undefined,` or `, ,` or similar
bare_commas = re.findall(r',\s*,', array_text)
if bare_commas:
    print(f"Found {len(bare_commas)} bare commas that might indicate undefined values")
    for i, match in enumerate(bare_commas[:10]):
        print(f"  {i+1}: {repr(match)}")

# Check for missing id properties
# Look for objects that start with { but don't have id:
problematic_objects = re.findall(r'\{\s*\n\s*[^id]', array_text)
if problematic_objects:
    print(f"Found {len(problematic_objects)} objects that might not start with id:")

print("\nArray text length:", len(array_text))
print("Array ends with:", repr(array_text[-50:]))
