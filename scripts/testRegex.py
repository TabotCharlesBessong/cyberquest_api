import re

with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Test pattern
pattern = re.compile(
    r'\{\s*\n'
    r'\s*id:\s*"([^"]+)"\s*\n'
    r'\s*title:\s*"[^"]*"\s*\n'
    r'\s*description:\s*"[^"]*"\s*\n'
    r'\s*icon:\s*"[^"]*"\s*\n'
    r'\s*color:\s*"[^"]*"\s*\n'
    r'\s*ageGroup:\s*"[^"]*"\s*\n'
    r'\s*units:\s*\[',
    re.MULTILINE
)

m = pattern.search(content)
print('Match found:', m is not None)
if m:
    print('Group 1:', m.group(1))
    print('Start:', m.start())

matches = list(pattern.finditer(content))
print(f'Total matches: {len(matches)}')
for match in matches:
    print(f'  Section: {match.group(1)}')
