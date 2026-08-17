with open("scripts/expandCurriculum.py", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('"","".join(questions)', '","\\n              ".join(questions)')
content = content.replace('"",".join(lessons)', '",\\n          ".join(lessons)')
content = content.replace('"",".join(new_units)', '",\\n      ".join(new_units)')
content = content.replace('"",".join(units)', '",\\n      ".join(units)')

with open("scripts/expandCurriculum.py", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
