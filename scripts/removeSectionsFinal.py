import re

with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

REMOVE_SECTIONS = {
    "a-malware-safety",
    "a-online-communication", 
    "a-digital-footprint",
    "b-digital-citizenship",
    "b-information-literacy",
    "b-cybersecurity-basics",
}

# Use the exact pattern that was verified to work
section_pattern = re.compile(
    r'\{\s*\n'
    r'\s*id:\s*"([^"]+)"\s*\n'
    r'\s*title:\s*"[^"]*"\s*\n'
    r'\s*description:\s*"[^"]*"\s*\n'
    r'\s*icon:\s*"[^"]*"\s*\n'
    r'\s*color:\s*"[^"]*"\s*\n'
    r'\s*ageGroup:\s*"[^"]*"\s*\n'
    r'\s*units:\s*\[',
    re.MULTILINE
)

matches = list(section_pattern.finditer(content))
print(f"Found {len(matches)} sections")
for m in matches:
    print(f"  {m.group(1)}")

sections_to_remove = [m for m in matches if m.group(1) in REMOVE_SECTIONS]
print(f"Sections to remove: {len(sections_to_remove)}")

for match in reversed(sections_to_remove):
    start_pos = match.start()
    
    # Find end by counting braces
    brace_count = 0
    end_pos = start_pos
    for i in range(start_pos, len(content)):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_pos = i + 1
                break
    
    # Show what we're removing
    section_text = content[start_pos:end_pos]
    print(f"Removing section {match.group(1)} ({len(section_text)} chars)")
    
    # Remove preceding comma and whitespace
    before_start = start_pos
    while before_start > 0 and content[before_start-1] in ' \t\n,':
        before_start -= 1
    
    # Remove following comma and whitespace
    after_end = end_pos
    while after_end < len(content) and content[after_end] in ' \t\n,':
        after_end += 1
    
    content = content[:before_start] + content[after_end:]

with open("src/seeders/curriculumSeed.ts", "w", encoding="utf-8") as f:
    f.write(content)

print(f"\nFinal file size: {len(content)} chars")

# Verify
with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()
for section in REMOVE_SECTIONS:
    if f'id: "{section}"' in content:
        print(f"WARNING: {section} still found!")
    else:
        print(f"OK: {section} removed")
