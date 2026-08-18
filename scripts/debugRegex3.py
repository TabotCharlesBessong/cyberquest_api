with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

with open("debug_output2.txt", "w", encoding="utf-8") as f:
    # Check line endings around first section
    idx = content.find('a-online-safety')
    context = content[max(0, idx-50):idx+100]
    f.write("Context:\n")
    f.write(context)
    f.write("\n\n")
    
    # Check for {\n pattern
    pattern1 = r'\{\s*\n\s*id:\s*"a-online-safety"'
    import re
    m1 = re.search(pattern1, content)
    f.write(f"Pattern 1 (\\{{\\s*\\n\\s*id:) match: {m1 is not None}\n")
    
    # Check for {\n    id: pattern  
    pattern2 = r'\{\n\s*id:\s*"a-online-safety"'
    m2 = re.search(pattern2, content)
    f.write(f"Pattern 2 (\\{{\\n\\s*id:) match: {m2 is not None}\n")
    
    # Check exact chars around {
    brace_idx = content.rfind('{', 0, idx)
    snippet = content[brace_idx:brace_idx+30]
    f.write(f"\nSnippet around brace:\n")
    f.write(repr(snippet))
    f.write("\n")
    
    # Check if \n or \r\n
    f.write(f"\nLine ending test: {repr(content[brace_idx:brace_idx+2])}\n")
