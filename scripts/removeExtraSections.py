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

lines = content.split('\n')
new_lines = []
skip_mode = False
brace_depth = 0
section_start_line = None

i = 0
while i < len(lines):
    line = lines[i]
    stripped = line.strip()
    
    if not skip_mode:
        # Check if this could be a section start (object opening)
        if stripped == '{' or stripped.startswith('{'):
            # Look ahead up to 5 lines for id pattern
            found_section_id = None
            for j in range(i, min(i + 6, len(lines))):
                jstripped = lines[j].strip()
                m = re.search(r'id:\s*"([^"]+)"', jstripped)
                if m:
                    potential_id = m.group(1)
                    if potential_id in REMOVE_SECTIONS:
                        found_section_id = potential_id
                    break
            
            if found_section_id:
                skip_mode = True
                section_start_line = i + 1
                brace_depth = 0
                i += 1
                continue
    
    if skip_mode:
        brace_depth += stripped.count('{') - stripped.count('}')
        # End of section: when we close the top-level object and hit a comma or closing bracket
        if brace_depth <= 0 and ('},' in stripped or ']' in stripped):
            skip_mode = False
            brace_depth = 0
            i += 1
            continue
    
    new_lines.append(line)
    i += 1

content = '\n'.join(new_lines)

with open("src/seeders/curriculumSeed.ts", "w", encoding="utf-8") as f:
    f.write(content)

print(f"Removed extra sections from curriculumSeed.ts")
print(f"File now has {len(new_lines)} lines (was {len(lines)} lines)")

# Verify
with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()
for section in REMOVE_SECTIONS:
    if f'id: "{section}"' in content:
        print(f"WARNING: {section} still found in file!")
    else:
        print(f"OK: {section} removed")
