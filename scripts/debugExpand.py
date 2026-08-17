file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

sections_config = [
    ("a-online-safety", "A"),
]

for sid, age in sections_config:
    marker = f'id: "{sid}"'
    pos = content.find(marker)
    if pos == -1:
        print(f"Section {sid} not found")
        continue
    
    section_start = content.rfind('{', 0, pos)
    units_pos = content.find('units: [', section_start)
    if units_pos == -1:
        print(f"Section {sid} has no units array")
        continue
    
    # Find matching ] for units array
    depth = 0
    units_end = -1
    for i in range(units_pos, len(content)):
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
            if depth == 0:
                units_end = i + 1
                break
    
    print(f"units_pos: {units_pos}, units_end: {units_end}")
    print(f"char at units_end-1: {repr(content[units_end-1])}")
    print(f"char at units_end: {repr(content[units_end])}")
    print(f"char at units_end+1: {repr(content[units_end+1])}")
    
    # Check what new_units would be
    existing = ["personal-info", "device-basics", "safe-browsing"]
    unit_count = len(existing)
    
    new_units = []
    for i in range(unit_count, 5):
        unit_id = f"unit-{i + 1}"
        new_units.append(f'''{{
            id: "{unit_id}",
            title: "Unit {i + 1}",
            description: "Learn more about this important topic.",
            icon: "📚",
            lessons: [
              {{
                id: "l1",
                title: "Lesson 1: Learning More",
                notes: "This is a test lesson.",
                difficulty: 2,
                questions: [
                  {{
                    id: "q1",
                    question: "Test question?",
                    correct: "Answer A",
                    wrongs: ["Answer B", "Answer C", "Answer D"],
                    explanation: "Test explanation.",
                  }},
                ],
              }},
            ],
          }}''')
    
    print(f"new_units count: {len(new_units)}")
    print(f"first new unit: {new_units[0][:100] if new_units else 'NONE'}")
    
    actual_pos = units_end - 1
    insertion = ",\n      " + ",\n      ".join(new_units)
    print(f"insertion length: {len(insertion)}")
    print(f"insertion preview: {insertion[:200]}")
    
    # Show what the result would look like
    result_preview = content[:actual_pos] + insertion + content[actual_pos:actual_pos+50]
    print(f"result preview: {repr(result_preview[-200:])}")
