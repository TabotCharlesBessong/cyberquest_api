with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find a-online-safety section
start = None
for i, line in enumerate(lines):
    if 'id: "a-online-safety"' in line:
        start = i - 1  # Include the opening {
        break

# Find end of section (before a-kindness-online)
end = None
for i in range(start + 1, len(lines)):
    if 'id: "a-kindness-online"' in lines[i]:
        end = i
        break

# Extract section
section_lines = lines[start:end]
section_text = "".join(section_lines)

# Wrap in a minimal type definition
test_code = f'''
type QuestionDef = {{
  id: string;
  question: string;
  correct: string;
  wrongs: string[];
  explanation: string;
}};

type LessonDef = {{
  id: string;
  title: string;
  notes: string;
  missionBriefing?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  questions: QuestionDef[];
}};

type UnitDef = {{
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: LessonDef[];
}};

type SectionDef = {{
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  ageGroup: "A" | "B";
  units: UnitDef[];
}};

const SECTION_DEFS: SectionDef[] = [
{section_text}
];
'''

with open("test_section.ts", "w", encoding="utf-8") as f:
    f.write(test_code)

print("Done - check test_section.ts")
