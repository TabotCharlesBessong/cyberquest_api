with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find the first section
idx = content.find('a-online-safety')
with open("debug_output.txt", "w", encoding="utf-8") as f:
    f.write(f'Context around a-online-safety:\n')
    f.write(repr(content[idx-20:idx+300]) + "\n\n")
    
    # Check if color pattern exists
    color_idx = content.find('color: "#22c55e"')
    f.write(f'color found at: {color_idx}\n')
    if color_idx >= 0:
        f.write(repr(content[color_idx-30:color_idx+50]) + "\n\n")
    
    # Check if ageGroup pattern exists
    age_idx = content.find('ageGroup: "A"')
    f.write(f'ageGroup found at: {age_idx}\n')
    if age_idx >= 0:
        f.write(repr(content[age_idx-30:age_idx+50]) + "\n\n")
    
    # Check if units pattern exists near a-online-safety
    units_idx = content.find('units: [', idx)
    f.write(f'units found at: {units_idx}\n')
    if units_idx >= 0:
        f.write(repr(content[units_idx-30:units_idx+50]) + "\n\n")
    
    # Check what comes after { 
    brace_idx = content.rfind('{', 0, idx)
    f.write(f'Opening brace at: {brace_idx}\n')
    if brace_idx >= 0:
        f.write(repr(content[brace_idx:brace_idx+200]) + "\n")
