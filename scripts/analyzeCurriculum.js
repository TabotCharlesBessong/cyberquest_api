const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "src", "seeders", "curriculumSeed.ts");
const content = fs.readFileSync(filePath, "utf-8");

// Count sections by counting top-level id patterns in SECTION_DEFS
const sectionMatches = content.match(/id: "[a-z][a-z0-9-]*",\s*\n\s*title:/g);
console.log("Sections:", sectionMatches ? sectionMatches.length : 0);

// Count units
const unitMatches = content.match(/\{\s*id: "[^"]+",\s*\n\s*title: "[^"]+",\s*\n\s*description: "[^"]+"/g);
console.log("Units:", unitMatches ? unitMatches.length : 0);

// Count lessons
const lessonMatches = content.match(/\{\s*id: "[^"]+",\s*\n\s*title: "[^"]+",\s*\n\s*notes: "/g);
console.log("Lessons:", lessonMatches ? lessonMatches.length : 0);

// Count questions
const questionMatches = content.match(/id: "q\d+"/g);
console.log("Questions:", questionMatches ? questionMatches.length : 0);

// Count lines
const lines = content.split("\n").length;
console.log("Total lines:", lines);

// Show section IDs
if (sectionMatches) {
  sectionMatches.forEach(m => {
    const idMatch = m.match(/id: "([^"]+)"/);
    if (idMatch) console.log("  Section:", idMatch[1]);
  });
}
