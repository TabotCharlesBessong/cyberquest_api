file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

print(f"File size: {len(content)} chars")

sections_config = [
    ("a-online-safety", "A"),
    ("a-kindness-online", "A"),
    ("b-privacy-passwords", "B"),
    ("b-scams-phishing", "B"),
    ("b-social-media-safety", "B"),
]

new_sections_config = [
    ("a-malware-safety", "Malware & Downloads", "Learn what malware is and how to download safely.", "🦠", "#ef4444", "A"),
    ("a-online-communication", "Online Communication", "Learn to chat and share safely online.", "💬", "#3b82f6", "A"),
    ("a-digital-footprint", "Digital Footprint", "Understand what you leave behind online.", "👣", "#22c55e", "A"),
    ("b-digital-citizenship", "Digital Citizenship", "Learn to be a responsible and ethical digital citizen.", "🌐", "#3b82f6", "B"),
    ("b-information-literacy", "Information Literacy", "Learn to find and verify reliable information.", "🔍", "#8b5cf6", "B"),
    ("b-cybersecurity-basics", "Cybersecurity Basics", "Learn the basics of staying safe from cyber threats.", "🔐", "#ef4444", "B"),
]

existing_units = {
    "a-online-safety": ["personal-info", "device-basics", "safe-browsing"],
    "a-kindness-online": ["kind-words", "digital-footprint", "group-chats"],
    "b-privacy-passwords": ["passwords", "privacy-data", "accounts-devices"],
    "b-scams-phishing": ["phishing-basics", "social-engineering", "suspicious-links"],
    "b-social-media-safety": ["smart-social-media", "deepfakes-truth"],
}

def make_unit(unit_index, age_group):
    is_a = age_group == "A"
    qs = 8 if is_a else 12
    
    lessons = []
    for l in range(1, 6):
        notes = (
            "This lesson teaches important safety skills for young learners. "
            "You will learn through stories and questions that help you remember what to do online. "
            "Ask a trusted adult if you have questions!"
            if is_a else
            "This lesson covers advanced digital citizenship topics for older learners. "
            "You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. "
            "Discuss these concepts with a trusted adult or teacher to deepen your understanding."
        )
        
        mission = (
            f"🎯 Mission: Safety Scout {l}! Your mission is to learn about this topic and complete the challenges. "
            "Listen carefully and do your best!"
            if is_a else
            f"🎯 Mission: Digital Investigator {l}! Your task is to investigate this topic, analyze scenarios, "
            "and make smart decisions. Stay critical and think deeply!"
        )
        
        questions = []
        for q in range(1, qs + 1):
            type_roll = (unit_index * 5 + l + q) % 10
            if type_roll < 4:
                questions.append(f'''{{
              id: "q{q}",
              type: "mcq",
              question: "Question {q} about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            }}''')
            elif type_roll < 6:
                questions.append(f'''{{
              id: "q{q}",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                {{ left: "Term A", right: "Definition A" }},
                {{ left: "Term B", right: "Definition B" }},
                {{ left: "Term C", right: "Definition C" }},
              ],
              explanation: "Matching helps you understand key concepts.",
            }}''')
            elif type_roll < 8:
                questions.append(f'''{{
              id: "q{q}",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            }}''')
            else:
                questions.append(f'''{{
              id: "q{q}",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "First step to take",
                "Second step to take",
                "Third step to take",
                "Fourth step to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Following steps in order keeps you safe.",
            }}''')
        
        lessons.append(f'''{{
            id: "l{l}",
            title: "Lesson {l}: Learning More",
            notes: "{notes}",
            missionBriefing: "{mission}",
            difficulty: {(unit_index + l) % 3 + 2},
            questions: [
              {",".join(questions)}
            ],
          }}''')
    
    unit_id = f"unit-{unit_index + 1}"
    return f'''( {{
        id: "{unit_id}",
        title: "Unit {unit_index + 1}",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {",".join(lessons)}
        ],
      }} ) as UnitDef'''

# Process each existing section
for sid, age in sections_config:
    marker = f'id: "{sid}"'
    pos = content.find(marker)
    if pos == -1:
        print(f"Section {sid} not found")
        continue
    
    # Find units array using bracket counting
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
    
    if units_end == -1:
        print(f"Section {sid} has malformed units array")
        continue
    
    existing = existing_units.get(sid, [])
    unit_count = len(existing)
    
    print(f"Section {sid}: {unit_count} existing units, ageGroup={age}")
    
    if unit_count >= 5:
        print(f"  Already has 5+ units, skipping")
        continue
    
    # Generate new units
    new_units = []
    for i in range(unit_count, 5):
        new_units.append(make_unit(i, age))
    
    # Get the current units array text
    units_text = content[units_pos:units_end]
    
    # Find the exact position to insert - right before the final `],`
    # The units array ends with `    ],`
    # We want to insert before the `]` character
    
    # Find the last `],` in units_text that closes the units array
    # This is tricky because there are many `],` inside nested arrays
    # Instead, we know units_end points to the position AFTER the closing `]`
    # So we insert at units_end - 1 (the position of `]`)
    
    # But we need to insert BEFORE `]`, not replace it
    actual_pos = units_end - 1
    
    # Insert new units before the closing `]`
    insertion = ",\n      ".join(new_units)
    # Add type assertion after the closing `]`
    content = content[:actual_pos] + insertion + content[actual_pos:actual_pos + 1] + " as UnitDef[]" + content[actual_pos + 1:]
    
    print(f"  Added {len(new_units)} new units (now 5)")

# Add new sections at the end
curriculum_pos = content.find('export const CURRICULUM')
if curriculum_pos == -1:
    print("Could not find export const CURRICULUM")
    exit(1)

# Find the end of SECTION_DEFS array
section_defs_end = -1
for i in range(curriculum_pos - 1, max(curriculum_pos - 200, -1), -1):
    if content[i] == ';' and content[i-1] == ']':
        after = content[i+1:i+20].strip()
        if after.startswith('export'):
            section_defs_end = i + 1
            break

if section_defs_end == -1:
    print("Could not find SECTION_DEFS end")
    exit(1)

print(f"SECTION_DEFS ends at position {section_defs_end}")

new_sections_to_add = []
for sid, title, desc, icon, color, age in new_sections_config:
    if f'id: "{sid}"' in content:
        print(f"Section {sid} already exists, skipping")
        continue
    
    print(f"Adding new section {sid}...")
    new_units = []
    for i in range(5):
        new_units.append(make_unit(i, age))
    
    section = f'''{{
    id: "{sid}",
    title: "{title}",
    description: "{desc}",
    icon: "{icon}",
    color: "{color}",
    ageGroup: "{age}",
    units: [
      {",".join(new_units)}
    ] as UnitDef[],
  }} as SectionDef'''
    
    new_sections_to_add.append(section)
    print(f"  Prepared {sid} with 5 units")

if new_sections_to_add:
    # Find the last `  },` before the SECTION_DEFS end
    last_section_end = content.rfind('  },', 0, section_defs_end)
    if last_section_end != -1:
        insert_pos = last_section_end + len('  },')
        new_sections_text = "\n  " + ",\n  ".join(new_sections_to_add)
        content = content[:insert_pos] + new_sections_text + content[insert_pos:]
        print(f"Added {len(new_sections_to_add)} new sections")
    else:
        print("Could not find last section closing")

# Write updated file
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\nDone! Expanded curriculumSeed.ts")
print(f"New file size: {len(content)} chars, {content.count(chr(10))} lines")
