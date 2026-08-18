with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

sections = []
current_section = None
current_unit = None

for i, line in enumerate(lines):
    if 'id: "' in line and 'title: "' in line and 'units:' not in line and 'lessons:' not in line and 'questions:' not in line:
        # Could be section or unit
        id_part = line.split('id: "')[1].split('"')[0]
        if id_part.startswith('a-') or id_part.startswith('b-'):
            if current_section:
                sections.append(current_section)
            current_section = {'id': id_part, 'units': []}
            current_unit = None
        elif id_part.startswith('unit-'):
            if current_section:
                current_section['units'].append({'id': id_part, 'lessons': []})
            current_unit = {'id': id_part, 'lessons': []}
        elif id_part.startswith('l') and len(id_part) <= 3:
            if current_unit:
                current_unit['lessons'].append(id_part)
    elif 'id: "' in line and 'title: "' not in line:
        # Could be a question
        id_part = line.split('id: "')[1].split('"')[0]
        if id_part.startswith('q') and current_unit:
            current_unit['lessons'].append(id_part)

if current_section:
    sections.append(current_section)

with open("current_structure.txt", "w", encoding="utf-8") as f:
    for s in sections:
        f.write(f"Section: {s['id']}\n")
        for u in s['units']:
            f.write(f"  Unit: {u['id']}\n")
        f.write("\n")

print(f"Total sections: {len(sections)}")
for s in sections:
    print(f"  {s['id']}: {len(s['units'])} units")
