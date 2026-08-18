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

# Find all section IDs and their positions
section_pattern = re.compile(
    r'\{\s*\n\s*id:\s*"([^"]+)"',
    re.MULTILINE
)

matches = list(section_pattern.finditer(content))
print(f"Found {len(matches)} potential sections")
for m in matches:
    print(f"  Section ID: {m.group(1)} at position {m.start()}")

# For each section to remove, find its boundaries and remove it
for section_id in REMOVE_SECTIONS:
    # Find the section start
    start_pattern = re.compile(
        r'(\s*\{\s*\n\s*id:\s*"' + re.escape(section_id) + r'")',
        re.MULTILINE
    )
    start_match = start_pattern.search(content)
    if not start_match:
        print(f"Could not find start of section: {section_id}")
        continue
    
    # Find the end by counting braces from the start position
    start_pos = start_match.start()
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
    
    # Check what comes after end_pos
    after = content[end_pos:end_pos+20].replace('\n', '\\n')
    print(f"Section {section_id}: start={start_pos}, end={end_pos}, after={repr(after)}")
    
    # Remove the section including trailing comma and whitespace
    # Look backwards to remove preceding comma and whitespace
    before_start = start_pos
    while before_start > 0 and content[before_start-1] in ' \t\n,':
        before_start -= 1
    
    # Look forwards to remove following comma and whitespace  
    after_end = end_pos
    while after_end < len(content) and content[after_end] in ' \t\n,':
        after_end += 1
    
    content = content[:before_start] + content[after_end:]
    print(f"  Removed section, new length: {len(content)}")

with open("src/seeders/curriculumSeed.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("\nDone!")

# Verify
with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()
for section in REMOVE_SECTIONS:
    if f'id: "{section}"' in content:
        print(f"WARNING: {section} still found!")
    else:
        print(f"OK: {section} removed")
