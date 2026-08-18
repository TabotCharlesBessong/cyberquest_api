with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

sections = []
current_section = None
current_unit = None
current_lesson = None

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # Detect section start (id and title on nearby lines)
    if stripped.startswith('id: "a-') or stripped.startswith('id: "b-'):
        # Check if this has title nearby (within 2 lines)
        has_title = False
        for j in range(i, min(i+3, len(lines))):
            if 'title: "' in lines[j].strip():
                has_title = True
                break
        if has_title and 'units:' not in stripped:
            current_section = stripped.split('id: "')[1].split('"')[0]
            current_unit = None
            current_lesson = None
            sections.append({'id': current_section, 'units': [], 'line': i+1})
    
    # Detect unit (has lessons: [)
    if current_section and 'lessons: [' in stripped and 'questions:' not in stripped:
        if 'id: "' in stripped:
            current_unit = stripped.split('id: "')[1].split('"')[0]
            current_lesson = None
            sections[-1]['units'].append({'id': current_unit, 'lessons': [], 'line': i+1})
    
    # Detect lesson (has questions: [)
    if current_section and current_unit and 'questions: [' in stripped:
        if 'id: "' in stripped:
            lesson_id = stripped.split('id: "')[1].split('"')[0]
            if not lesson_id.startswith('q'):
                current_lesson = lesson_id
                sections[-1]['units'][-1]['lessons'].append({'id': current_lesson, 'line': i+1})

print(f"Total sections: {len(sections)}")
for s in sections:
    print(f"\nSection: {s['id']} (line {s['line']})")
    print(f"  Units: {len(s['units'])}")
    for u in s['units']:
        print(f"    Unit: {u['id']} (line {u['line']}) - {len(u['lessons'])} lessons")
        for l in u['lessons']:
            print(f"      Lesson: {l['id']} (line {l['line']})")
