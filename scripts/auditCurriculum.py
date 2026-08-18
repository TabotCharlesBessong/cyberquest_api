with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find all sections
sections = re.findall(r'id: "([^"]+)"', content)
# Filter to likely section IDs (a- or b- prefix)
section_ids = [s for s in sections if s.startswith('a-') or s.startswith('b-')]
print('Sections found:', len(section_ids))
for s in section_ids:
    print(f'  {s}')

# Count units and lessons
units = [s for s in sections if s.startswith('unit-') or (not s.startswith('q') and not s.startswith('l') and '-' in s and not s.startswith('a-') and not s.startswith('b-'))]
print(f'\nUnits found: {len(units)}')

# Check if voiceOver is present
voiceovers = content.count('voiceOver:')
print(f'\nvoiceOver fields: {voiceovers}')

# Check file size
print(f'\nFile size: {len(content)} chars, {content.count(chr(10))} lines')
