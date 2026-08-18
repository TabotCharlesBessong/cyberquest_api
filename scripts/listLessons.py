with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

lessons = []
current_section = None
current_unit = None
current_lesson = None

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # Detect section
    if stripped.startswith('id: "a-') or stripped.startswith('id: "b-'):
        if 'title: "' in stripped and 'units:' not in stripped:
            current_section = stripped.split('id: "')[1].split('"')[0]
            current_unit = None
            current_lesson = None
    
    # Detect unit (has lessons: [)
    if current_section and 'lessons: [' in stripped and 'questions:' not in stripped:
        if 'id: "' in stripped:
            current_unit = stripped.split('id: "')[1].split('"')[0]
            current_lesson = None
    
    # Detect lesson (has questions: [)
    if current_section and current_unit and 'questions: [' in stripped:
        if 'id: "' in stripped:
            lesson_id = stripped.split('id: "')[1].split('"')[0]
            if not lesson_id.startswith('q'):
                current_lesson = lesson_id
    
    # Get lesson title
    if current_lesson and stripped.startswith('title: "'):
        title = stripped.split('title: "')[1].split('"')[0]
        if current_lesson not in [l['id'] for l in lessons]:
            lessons.append({
                'section': current_section,
                'unit': current_unit,
                'id': current_lesson,
                'title': title,
            })
    
    # Reset lesson when we hit another id
    if current_lesson and stripped.startswith('id: "') and 'questions: [' not in stripped:
        current_lesson = None

with open("lesson_list.txt", "w", encoding="utf-8") as f:
    for lesson in lessons:
        f.write(f"{lesson['section']} | {lesson['unit']} | {lesson['id']} | {lesson['title']}\n")

print(f"Total lessons found: {len(lessons)}")
for lesson in lessons[:20]:
    print(f"{lesson['section']} | {lesson['unit']} | {lesson['id']} | {lesson['title']}")
if len(lessons) > 20:
    print(f"... and {len(lessons) - 20} more")
