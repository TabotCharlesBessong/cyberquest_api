file_path = "src/seeders/curriculumSeed.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

curriculum_pos = content.find('export const CURRICULUM')
print(f"export const CURRICULUM at position: {curriculum_pos}")
print(f"Context before it:")
print(repr(content[curriculum_pos - 50:curriculum_pos]))
