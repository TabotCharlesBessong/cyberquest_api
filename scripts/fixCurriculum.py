import re

with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Sections to remove entirely
REMOVE_SECTIONS = {
    "a-malware-safety",
    "a-online-communication", 
    "a-digital-footprint",
    "b-digital-citizenship",
    "b-information-literacy",
    "b-cybersecurity-basics",
}

# Generic placeholder patterns to replace
GENERIC_QUESTIONS = [
    (r'question: "Question \d+ about this.*?"', "question: \"What is the safest action in this cybercrime scenario?\""),
    (r'question: "Question \d+ about this lesson.*?"', "question: \"What is the safest action in this cybercrime scenario?\""),
    (r'correct: "The correct choice"', "correct: \"Report it to a trusted adult\""),
    (r'wrongs: \[\"Wrong choice A\", "Wrong choice B\", "Wrong choice C\"\]', 'wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"]'),
    (r'question: "Match the terms:"', "question: \"Match the cybercrime term to its definition:\""),
    (r'question: "Match the terms related to this lesson:"', "question: \"Match the cybercrime term to its definition:\""),
    (r'{ left: "Term A", right: "Definition A" }', '{ left: "Phishing", right: "Fake messages that steal information" }'),
    (r'{ left: "Term B", right: "Definition B" }', '{ left: "Malware", right: "Software that harms your device" }'),
    (r'{ left: "Term C", right: "Definition C" }', '{ left: "Social Engineering", right: "Tricking people into giving up data" }'),
    (r'question: "Build the rule:"', "question: \"Build the safety rule:\""),
    (r'sentenceParts: \["Always", "think", "before", "you", "act", "online"\]', 'sentenceParts: ["Stop", "think", "verify", "before", "you", "click"]'),
    (r'correctSentence: "Always think before you act online"', 'correctSentence: "Stop think verify before you click"'),
    (r'question: "Build the important rule:"', "question: \"Build the safety rule:\""),
    (r'question: "Build the golden rule of social media:"', "question: \"Build the golden rule of social media:\""),
    (r'explanation: "This is the correct explanation for the answer\."', "explanation: \"This choice helps prevent cybercrime.\""),
    (r'explanation: "This is the correct explanation\."', "explanation: \"This choice helps prevent cybercrime.\""),
    (r'explanation: "This is a good rule to follow\."', "explanation: \"Following this rule keeps you safer from online threats.\""),
    (r'explanation: "This rule helps you make safe choices\."', "explanation: \"Following this rule keeps you safer from online threats.\""),
    (r'explanation: "Matching helps you learn\."', "explanation: \"Knowing these terms helps you spot cybercrime.\""),
    (r'explanation: "Matching helps you understand key concepts\."', "explanation: \"Knowing these terms helps you spot cybercrime.\""),
    (r'explanation: "Following steps in order keeps you safe\."', "explanation: \"These steps help you respond safely to a cyber incident.\""),
    (r'First step', "Identify the suspicious message"),
    (r'Second step', "Do not click any links or download attachments"),
    (r'Third step', "Report it to a trusted adult or authority"),
    (r'Fourth step', "Change passwords if you entered any details"),
    (r'First step to take', "Identify the suspicious message"),
    (r'Second step to take', "Do not click any links or download attachments"),
    (r'Third step to take', "Report it to a trusted adult or authority"),
    (r'Fourth step to take', "Change passwords if you entered any details"),
]

# Repetitive notes template to expand
OLD_NOTES_TEMPLATE = "Remember to always ask a trusted adult if you are unsure. The internet is a fun place, but it is important to stay safe. Keep your personal information private and only share it with people you trust. Practice these skills every time you go online!"

NEW_NOTES_TEMPLATE = "Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first."

# Replace repetitive notes
content = content.replace(OLD_NOTES_TEMPLATE, NEW_NOTES_TEMPLATE)

# Apply generic question replacements
for pattern, replacement in GENERIC_QUESTIONS:
    content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)

# Add voiceOver field to each lesson
# Pattern: after missionBriefing, add voiceOver
def add_voiceover(match):
    return match.group(1) + '            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",\n' + match.group(2)

content = re.sub(
    r'(missionBriefing: ".*?",\n)(\s+difficulty:)',
    add_voiceover,
    content
)

# Now remove extra sections
lines = content.split('\n')
new_lines = []
skip_until_next_section = False
brace_depth = 0
in_section_to_remove = False

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # Detect section start
    if stripped.startswith('{') and 'id:' in stripped:
        # Check if this is a section start
        if re.search(r'id:\s*"(a-|b-)"', stripped):
            # Extract section id
            m = re.search(r'id:\s*"([^"]+)"', stripped)
            if m:
                section_id = m.group(1)
                if section_id in REMOVE_SECTIONS:
                    in_section_to_remove = True
                    brace_depth = 0
                    continue
    
    if in_section_to_remove:
        # Track braces to know when section ends
        brace_depth += stripped.count('{') - stripped.count('}')
        if brace_depth <= 0 and '},' in stripped:
            in_section_to_remove = False
            brace_depth = 0
        continue
    
    new_lines.append(line)

content = '\n'.join(new_lines)

# Write back
with open("src/seeders/curriculumSeed.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Curriculum fix complete!")
print(f"Removed {len(REMOVE_SECTIONS)} extra sections")
