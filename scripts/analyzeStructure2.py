with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

sections = []
current_section = None
current_unit = None
in_lessons = False

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # Detect section start
    if stripped.startswith('id: "a-') or stripped.startswith('id: "b-'):
        # Check if this is a section (has title and ageGroup nearby)
        has_title = False
        has_agegroup = False
        for j in range(i, min(i+5, len(lines))):
            jstripped = lines[j].strip()
            if 'title: "' in jstripped:
                has_title = True
            if 'ageGroup: "' in jstripped:
                has_agegroup = True
        if has_title and has_agegroup:
            current_section = stripped.split('id: "')[1].split('"')[0]
            current_unit = None
            in_lessons = False
            sections.append({'id': current_section, 'units': [], 'line': i+1})
    
    # Detect unit - has lessons array
    if current_section and 'lessons: [' in stripped and 'questions:' not in stripped:
        if 'id: "' in stripped:
            current_unit = stripped.split('id: "')[1].split('"')[0]
            in_lessons = True
            sections[-1]['units'].append({'id': current_unit, 'lessons': [], 'line': i+1})
    
    # Detect lesson - has questions array
    if current_section and current_unit and in_lessons and 'questions: [' in stripped:
        if 'id: "' in stripped:
            lesson_id = stripped.split('id: "')[1].split('"')[0]
            if not lesson_id.startswith('q'):
                sections[-1]['units'][-1]['lessons'].append({'id': lesson_id, 'line': i+1})

print(f"Total sections: {len(sections)}")
for s in sections:
    print(f"\nSection: {s['id']} (line {s['line']})")
    print(f"  Units: {len(s['units'])}")
    for u in s['units']:
        print(f"    Unit: {u['id']} (line {u['line']}) - {len(u['lessons'])} lessons")
        for l in u['lessons']:
            print(f"      Lesson: {l['id']} (line {l['line']})")
