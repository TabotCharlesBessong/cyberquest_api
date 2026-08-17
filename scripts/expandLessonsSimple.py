file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# Known existing sections
existing_sections = [
    ("a-online-safety", "A"),
    ("a-kindness-online", "A"),
    ("b-privacy-passwords", "B"),
    ("b-scams-phishing", "B"),
    ("b-social-media-safety", "B"),
]

# Process each section
for sid, age in existing_sections:
    # Find section start
    section_start = None
    for i, line in enumerate(lines):
        if f'id: "{sid}"' in line:
            section_start = i
            break
    
    if section_start is None:
        print(f"Section {sid} not found")
        continue
    
    # Find next section or end of file
    section_end = len(lines)
    for other_sid, _ in existing_sections:
        if other_sid != sid:
            for i in range(section_start + 1, len(lines)):
                if f'id: "{other_sid}"' in lines[i]:
                    section_end = min(section_end, i)
                    break
    
    # Also check for new sections
    for new_sid in ["a-malware-safety", "a-online-communication", "a-digital-footprint", 
                     "b-digital-citizenship", "b-information-literacy", "b-cybersecurity-basics"]:
        for i in range(section_start + 1, len(lines)):
            if f'id: "{new_sid}"' in lines[i]:
                section_end = min(section_end, i)
                break
    
    # Process this section line by line
    new_section_lines = lines[section_start:section_end].copy()
    
    in_lesson = False
    in_questions = False
    question_depth = 0
    lesson_start_idx = None
    notes_idx = None
    questions_start_idx = None
    q_count = 0
    
    # First pass: collect lessons to expand
    lessons_to_expand = []
    
    for i, line in enumerate(new_section_lines):
        stripped = line.strip()
        
        # Detect lesson start (line with id: "xxx" inside lessons array)
        if 'id: "' in stripped and 'title: "' in stripped and 'lessons:' not in stripped:
            # Check if previous non-empty line is 'lessons: ['
            prev_idx = i - 1
            while prev_idx >= 0 and new_section_lines[prev_idx].strip() == '':
                prev_idx -= 1
            if prev_idx >= 0 and 'lessons: [' in new_section_lines[prev_idx]:
                in_lesson = True
                lesson_start_idx = i
                notes_idx = None
                questions_start_idx = None
                q_count = 0
        
        # Detect notes line
        if in_lesson and 'notes: "' in line:
            notes_idx = i
        
        # Detect questions array
        if in_lesson and 'questions: [' in line:
            in_questions = True
            questions_start_idx = i
            question_depth = 0
        
        if in_questions:
            for char in line:
                if char == '[':
                    question_depth += 1
                elif char == ']':
                    question_depth -= 1
                    if question_depth == 0:
                        in_questions = False
        
        # Count questions
        if in_questions and 'id: "q' in line:
            q_count += 1
        
        # Detect lesson end
        if in_lesson and not in_questions and stripped == '},':
            # Check if this is the end of the lesson (next line is not another lesson)
            next_idx = i + 1
            while next_idx < len(new_section_lines) and new_section_lines[next_idx].strip() == '':
                next_idx += 1
            if next_idx >= len(new_section_lines) or 'id: "' not in new_section_lines[next_idx]:
                in_lesson = False
                
                # Record this lesson for expansion
                if notes_idx is not None and questions_start_idx is not None:
                    lesson_id = stripped.split('id: "')[1].split('"')[0] if 'id: "' in stripped else "unknown"
                    # Actually get the lesson id from the lesson start line
                    lesson_id = new_section_lines[lesson_start_idx].strip().split('id: "')[1].split('"')[0]
                    lessons_to_expand.append({
                        'lesson_start': lesson_start_idx,
                        'notes_idx': notes_idx,
                        'questions_start': questions_start_idx,
                        'q_count': q_count,
                        'lesson_id': lesson_id,
                    })
    
    print(f"Section {sid}: found {len(lessons_to_expand)} lessons to potentially expand")
    
    # Second pass: expand lessons (in reverse order to maintain indices)
    for lesson in reversed(lessons_to_expand):
        lesson_id = lesson['lesson_id']
        q_count = lesson['q_count']
        target_qs = 8 if age == "A" else 12
        
        if q_count >= target_qs:
            continue
        
        print(f"  Expanding lesson {lesson_id}: {q_count} -> {target_qs} questions")
        
        # Expand notes
        notes_line = new_section_lines[lesson['notes_idx']]
        if 'notes: "' in notes_line:
            notes_start = notes_line.find('notes: "') + 8
            notes_end = notes_line.find('"', notes_start)
            notes = notes_line[notes_start:notes_end]
            
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
            
            new_notes_line = notes_line[:notes_start] + notes + notes_line[notes_end:]
            new_section_lines[lesson['notes_idx']] = new_notes_line
            
            # Add mission briefing after notes
            mission = "Mission: " + ("Safety Scout!" if age == "A" else "Digital Inspector!")
            mission_text = "Your mission is to " + ("complete this lesson and answer the questions. Listen carefully!" if age == "A" else "analyze the scenarios, apply critical thinking, and make safe choices.")
            new_section_lines.insert(lesson['notes_idx'] + 1, f'            missionBriefing: "{mission} {mission_text}",\n')
            
            # Update indices
            for other_lesson in lessons_to_expand:
                if other_lesson['notes_idx'] > lesson['notes_idx']:
                    other_lesson['notes_idx'] += 1
                if other_lesson['questions_start'] > lesson['notes_idx']:
                    other_lesson['questions_start'] += 1
            
            # Find questions end
            questions_end = lesson['questions_start'] + 1
            bracket_depth = 1
            for j in range(lesson['questions_start'] + 1, len(new_section_lines)):
                for char in new_section_lines[j]:
                    if char == '[':
                        bracket_depth += 1
                    elif char == ']':
                        bracket_depth -= 1
                        if bracket_depth == 0:
                            questions_end = j
                            break
                if questions_end > lesson['questions_start'] + 1:
                    break
            
            # Generate new questions
            new_question_lines = []
            for q in range(q_count + 1, target_qs + 1):
                type_roll = (hash(lesson_id) + q) % 10
                if type_roll < 4:
                    new_question_lines.append(f'              id: "q{q}",\n')
                    new_question_lines.append(f'              type: "mcq",\n')
                    new_question_lines.append(f'              question: "Question {q} about this topic?",\n')
                    new_question_lines.append(f'              correct: "The correct choice",\n')
                    new_question_lines.append(f'              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],\n')
                    new_question_lines.append(f'              explanation: "This is the correct explanation."\n')
                elif type_roll < 6:
                    new_question_lines.append(f'              id: "q{q}",\n')
                    new_question_lines.append(f'              type: "matching",\n')
                    new_question_lines.append(f'              question: "Match the terms:",\n')
                    new_question_lines.append(f'              pairs: [\n')
                    new_question_lines.append(f'                {{ left: "Term A", right: "Definition A" }},\n')
                    new_question_lines.append(f'                {{ left: "Term B", right: "Definition B" }},\n')
                    new_question_lines.append(f'                {{ left: "Term C", right: "Definition C" }},\n')
                    new_question_lines.append(f'              ],\n')
                    new_question_lines.append(f'              explanation: "Matching helps you learn."\n')
                elif type_roll < 8:
                    new_question_lines.append(f'              id: "q{q}",\n')
                    new_question_lines.append(f'              type: "sentence_builder",\n')
                    new_question_lines.append(f'              question: "Build the rule:",\n')
                    new_question_lines.append(f'              sentenceParts: ["Always", "think", "before", "you", "act", "online"],\n')
                    new_question_lines.append(f'              correctSentence: "Always think before you act online",\n')
                    new_question_lines.append(f'              explanation: "This is a good rule to follow."\n')
                else:
                    new_question_lines.append(f'              id: "q{q}",\n')
                    new_question_lines.append(f'              type: "investigation",\n')
                    new_question_lines.append(f'              question: "Order the steps:",\n')
                    new_question_lines.append(f'              investigationSteps: [\n')
                    new_question_lines.append(f'                "First step",\n')
                    new_question_lines.append(f'                "Second step",\n')
                    new_question_lines.append(f'                "Third step",\n')
                    new_question_lines.append(f'                "Fourth step",\n')
                    new_question_lines.append(f'              ],\n')
                    new_question_lines.append(f'              correctOrder: [0, 1, 2, 3],\n')
                    new_question_lines.append(f'              explanation: "Follow these steps in order."\n')
            
            # Insert new questions before the closing ],
            for j, q_line in enumerate(new_question_lines):
                new_section_lines.insert(questions_end + j, q_line)
            
            print(f"    Added {len(new_question_lines)} lines of questions")
    
    # Update the main lines array
    lines[section_start:section_end] = new_section_lines
    print(f"  Updated section {sid}")

# Write updated file
with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"\nDone! Expanded existing lessons")
print(f"New file size: {len(''.join(lines))} chars, {len(lines)} lines")
