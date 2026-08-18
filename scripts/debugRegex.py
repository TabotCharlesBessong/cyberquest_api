with open("src/seeders/curriculumSeed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find the first section
idx = content.find('a-online-safety')
print('Context around a-online-safety:')
print(repr(content[idx-20:idx+300]))

# Check if color pattern exists
color_idx = content.find('color: "#22c55e"')
print(f'\ncolor found at: {color_idx}')
if color_idx >= 0:
    print(repr(content[color_idx-30:color_idx+50]))

# Check if ageGroup pattern exists
age_idx = content.find('ageGroup: "A"')
print(f'\nageGroup found at: {age_idx}')
if age_idx >= 0:
    print(repr(content[age_idx-30:age_idx+50]))

# Check if units pattern exists near a-online-safety
units_idx = content.find('units: [', idx)
print(f'\nunits found at: {units_idx}')
if units_idx >= 0:
    print(repr(content[units_idx-30:units_idx+50]))
