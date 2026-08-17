import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const filePath = join(process.cwd(), "cyberquest_api", "src", "seeders", "curriculumSeed.ts");
const content = readFileSync(filePath, "utf-8");

// Parse the SECTION_DEFS array from the file
const sectionDefsMatch = content.match(/const SECTION_DEFS: SectionDef\[\] = \[([\s\S]*?)\];/);
if (!sectionDefsMatch) {
  console.error("Could not find SECTION_DEFS");
  process.exit(1);
}

const sectionsText = sectionDefsMatch[1];

// Count current sections, units, lessons
const sectionMatches = [...sectionsText.matchAll(/id: "([^"]+)"/g)];
console.log("Current IDs found:", sectionMatches.map(m => m[1]).slice(0, 20));

// Count units per section by finding section boundaries
const sectionBoundaries = [];
let currentSection = null;
const lines = content.split("\n");
let inSections = false;
let sectionDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("const SECTION_DEFS")) {
    inSections = true;
    continue;
  }
  if (inSections && line.includes("export const CURRICULUM")) {
    break;
  }
  if (inSections) {
    // Track section boundaries
    if (line.match(/\{\s*id:/)) {
      if (currentSection) {
        sectionBoundaries.push(currentSection);
      }
      currentSection = { start: i, id: line.match(/id: "([^"]+)"/)?.[1] };
    }
  }
}

console.log("Section boundaries:", sectionBoundaries.map(s => s.id));

// Check how many units each section has
const unitCounts = {};
const lessonCounts = {};
let currentSectionId = null;

for (const line of lines) {
  const sectionMatch = line.match(/id: "([^"]+)",\s*\n\s*title:/);
  if (sectionMatch) {
    currentSectionId = sectionMatch[1];
    unitCounts[currentSectionId] = 0;
  }
  
  if (currentSectionId && line.includes('id: "' + currentSectionId.split("-").slice(0, -1).join("-") + "-')) {
    // This is a unit ID
    unitCounts[currentSectionId] = (unitCounts[currentSectionId] || 0) + 1;
  }
}

console.log("Unit counts per section:", unitCounts);

// Check question counts in existing lessons
const questionCounts = [];
const lessonQuestionMatches = [...content.matchAll(/questions: \[([\s\S]*?)\]/g)];
for (const match of lessonQuestionMatches.slice(0, 10)) {
  const questionsText = match[1];
  const count = (questionsText.match(/id: "q\d+"/g) || []).length;
  questionCounts.push(count);
}
console.log("Question counts in first 10 lessons:", questionCounts);
