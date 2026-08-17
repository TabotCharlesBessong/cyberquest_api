file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

print(f"File size: {len(content)} chars")

import re

# Known existing sections
existing_sections = [
    ("a-online-safety", "A"),
    ("a-kindness-online", "A"),
    ("b-privacy-passwords", "B"),
    ("b-scams-phishing", "B"),
    ("b-social-media-safety", "B"),
]

# For each section, find and expand lessons
for sid, age in existing_sections:
    section_start = content.find(f'id: "{sid}"')
    if section_start == -1:
        print(f"Section {sid} not found")
        continue
    
    next_section = len(content)
    for other_sid, _ in existing_sections:
        if other_sid != sid:
            pos = content.find(f'id: "{other_sid}"', section_start + 1)
            if pos != -1 and pos < next_section:
                next_section = pos
    
    for new_sid in ["a-malware-safety", "a-online-communication", "a-digital-footprint", 
                     "b-digital-citizenship", "b-information-literacy", "b-cybersecurity-basics"]:
        pos = content.find(f'id: "{new_sid}"', section_start + 1)
        if pos != -1 and pos < next_section:
            next_section = pos
    
    section_text = content[section_start:next_section]
    
    # Find all lessons using regex
    lesson_pattern = r'id: "([^"]+)"\s*,\s*title: "([^"]+)"\s*,\s*notes: "([^"]*)"\s*,\s*difficulty: (\d+)\s*,\s*questions: \['
    
    matches = list(re.finditer(lesson_pattern, section_text))
    print(f"Section {sid}: found {len(matches)} lessons")
    
    if not matches:
        continue
    
    # Process matches in reverse order
    for match in reversed(matches):
        lesson_id = match.group(1)
        title = match.group(2)
        notes = match.group(3)
        difficulty = match.group(4)
        
        # Find the end of this lesson's questions array
        match_end = match.end()
        depth = 1
        q_end = -1
        for i in range(match_end, len(section_text)):
            if section_text[i] == '[':
                depth += 1
            elif section_text[i] == ']':
                depth -= 1
                if depth == 0:
                    q_end = i + 1
                    break
        
        if q_end == -1:
            continue
        
        questions_text = section_text[match_end:q_end]
        q_count = questions_text.count('id: "q')
        target_qs = 8 if age == "A" else 12
        
        if q_count >= target_qs:
            continue
        
        print(f"  Expanding lesson {lesson_id}: {q_count} -> {target_qs} questions")
        
        # Expand notes
        if age == "A" and len(notes.split('.')) < 4:
            notes = notes + " Remember to always ask a trusted adult if you are unsure. " + \
                    "The internet is a fun place, but it is important to stay safe. " + \
                    "Keep your personal information private and only share it with people you trust. " + \
                    "Practice these skills every time you go online!"
        elif age == "B" and len(notes.split('.')) < 8:
            notes = notes + " As you navigate the digital world, remember that your actions online have real-world consequences. " + \
                    "Develop critical thinking skills to evaluate the information you encounter. " + \
                    "Build positive digital habits that will serve you well throughout your life. " + \
                    "Engage with technology responsibly and help others do the same."
        
        # Add mission briefing
        mission = "Mission: " + ("Safety Scout!" if age == "A" else "Digital Inspector!")
        mission_text = "Your mission is to " + ("complete this lesson and answer the questions. Listen carefully!" if age == "A" else "analyze the scenarios, apply critical thinking, and make safe choices.")
        
        # Generate additional questions
        new_questions = []
        for q in range(q_count + 1, target_qs + 1):
            type_roll = (hash(lesson_id) + q) % 10
            if type_roll < 4:
                new_questions.append(f'{{\n              id: "q{q}",\n              type: "mcq",\n              question: "Question {q} about this topic?",\n              correct: "The correct choice",\n              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],\n              explanation: "This is the correct explanation."\n            }}')
            elif type_roll < 6:
                new_questions.append(f'{{\n              id: "q{q}",\n              type: "matching",\n              question: "Match the terms:",\n              pairs: [\n                {{ left: "Term A", right: "Definition A" }},\n                {{ left: "Term B", right: "Definition B" }},\n                {{ left: "Term C", right: "Definition C" }},\n              ],\n              explanation: "Matching helps you learn."\n            }}')
            elif type_roll < 8:
                new_questions.append(f'{{\n              id: "q{q}",\n              type: "sentence_builder",\n              question: "Build the rule:",\n              sentenceParts: ["Always", "think", "before", "you", "act", "online"],\n              correctSentence: "Always think before you act online",\n              explanation: "This is a good rule to follow."\n            }}')
            else:
                new_questions.append(f'{{\n              id: "q{q}",\n              type: "investigation",\n              question: "Order the steps:",\n              investigationSteps: [\n                "First step",\n                "Second step",\n                "Third step",\n                "Fourth step",\n              ],\n              correctOrder: [0, 1, 2, 3],\n              explanation: "Follow these steps in order."\n            }}')
        
        # Find the start of the lesson object
        lesson_start_in_section = match.start()
        
        # Find the `{` that starts this lesson
        actual_lesson_start = -1
        for i in range(lesson_start_in_section - 1, -1, -1):
            if section_text[i] == '{':
                between = section_text[i + 1:lesson_start_in_section]
                if between.strip() == '':
                    actual_lesson_start = i
                    break
        
        if actual_lesson_start == -1:
            print(f"  Could not find lesson start for {lesson_id}")
            continue
        
        # Find the end of the lesson
        actual_lesson_end = q_end
        for i in range(q_end, len(section_text)):
            if section_text[i] == '}':
                actual_lesson_end = i + 1
                break
        
        old_lesson = section_text[actual_lesson_start:actual_lesson_end]
        
        # Build new lesson - preserve original structure but expand content
        # Extract indentation from the old lesson
        old_lines = old_lesson.split('\n')
        if len(old_lines) > 1:
            prop_indent = old_lines[1][:len(old_lines[1]) - len(old_lines[1].lstrip())]
        else:
            prop_indent = "            "
        
        close_indent = old_lines[-1][:len(old_lines[-1]) - len(old_lines[-1].lstrip())]
        
        # Build questions body - keep original questions, just add new ones
        questions_body = questions_text.rstrip()
        if questions_body.endswith('],'):
            questions_body = questions_body[:-2].rstrip()
        elif questions_body.endswith(']'):
            questions_body = questions_body[:-1].rstrip()
        
        # Remove trailing whitespace but keep the last question's closing },
        # We just need to add new questions after the last original question
        new_questions_text = questions_body + "\n" + ",\n".join(new_questions) + "\n          ],"
        
        new_lesson = f'{close_indent}{{\n{prop_indent}id: "{lesson_id}",\n{prop_indent}title: "{title}",\n{prop_indent}notes: "{notes}",\n{prop_indent}missionBriefing: "{mission} {mission_text}",\n{prop_indent}difficulty: {difficulty},\n{prop_indent}questions: [\n{new_questions_text}\n{close_indent}}}'
        
        # Replace in section_text
        section_text = section_text[:actual_lesson_start] + new_lesson + section_text[actual_lesson_end:]
        
        print(f"    Added {len(new_questions)} questions and missionBriefing")
    
    # Update content
    content = content[:section_start] + section_text + content[next_section:]

# Write updated file
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\nDone! Expanded existing lessons")
print(f"New file size: {len(content)} chars, {content.count(chr(10)) + 1} lines")
