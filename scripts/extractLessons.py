import re

with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Extract all lessons with their section, unit, title, notes, and questions
lessons = []

# Find all sections
section_pattern = re.compile(r'id: "(a-[^"]+|b-[^"]+)".*?ageGroup: "([AB])".*?units: \[(.*?)\],\s*\n\s*},', re.DOTALL)
for section_match in section_pattern.finditer(content):
    section_id = section_match.group(1)
    age_group = section_match.group(2)
    units_text = section_match.group(3)
    
    # Find all units in this section
    unit_pattern = re.compile(r'id: "([^"]+)".*?title: "([^"]+)".*?lessons: \[(.*?)\]', re.DOTALL)
    for unit_match in unit_pattern.finditer(units_text):
        unit_id = unit_match.group(1)
        unit_title = unit_match.group(2)
        lessons_text = unit_match.group(3)
        
        # Find all lessons in this unit
        lesson_pattern = re.compile(r'id: "([^"]+)".*?title: "([^"]+)".*?notes: "([^"]*)".*?difficulty: (\d+).*?questions: \[(.*?)\]', re.DOTALL)
        for lesson_match in lesson_pattern.finditer(lessons_text):
            lesson_id = lesson_match.group(1)
            lesson_title = lesson_match.group(2)
            notes = lesson_match.group(3)
            difficulty = lesson_match.group(4)
            questions_text = lesson_match.group(5)
            
            # Count questions
            q_count = questions_text.count('id: "q')
            
            lessons.append({
                'section': section_id,
                'age': age_group,
                'unit': unit_id,
                'unit_title': unit_title,
                'id': lesson_id,
                'title': lesson_title,
                'notes': notes,
                'difficulty': difficulty,
                'q_count': q_count,
            })

with open("all_lessons.txt", "w", encoding="utf-8") as f:
    for lesson in lessons:
        f.write(f"{lesson['section']} | {lesson['unit']} | {lesson['id']} | {lesson['title']} | Q:{lesson['q_count']} | {lesson['notes'][:80]}...\n")

print(f"Total lessons found: {len(lessons)}")
for lesson in lessons:
    print(f"{lesson['section']} | {lesson['unit']} | {lesson['id']} | {lesson['title']} | Q:{lesson['q_count']}")
