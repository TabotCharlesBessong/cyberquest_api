with open("src/seeders/curriculumSeed.ts", "r") as f:
    content = f.read()
pos = content.find('id: "a-online-safety"')
print("Found at position:", pos)
print("Context:")
print(repr(content[pos-100:pos+200]))
