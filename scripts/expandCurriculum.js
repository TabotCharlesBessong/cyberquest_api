const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "src", "seeders", "curriculumSeed.ts");
const lines = fs.readFileSync(filePath, "utf-8").split("\n");

// Track state
let inSectionDefs = false;
let currentSection = null;
let sectionStartLine = -1;
let sectionDepth = 0;
let sectionStartDepth = 0;

const sections = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes("const SECTION_DEFS")) {
    inSectionDefs = true;
    continue;
  }
  
  if (inSectionDefs && line.includes("export const CURRICULUM")) {
    break;
  }
  
  if (inSectionDefs) {
    // Track section boundaries
    for (const char of line) {
      if (char === '{') {
        if (currentSection && sectionDepth === sectionStartDepth) {
          // This is a nested object inside the section
        }
        sectionDepth++;
        if (!currentSection && sectionDepth === 1) {
          sectionStartDepth = sectionDepth;
        }
      }
      if (char === '}') {
        sectionDepth--;
        if (currentSection && sectionDepth === sectionStartDepth - 1) {
          // Section ended
          currentSection.endLine = i;
          sections.push(currentSection);
          currentSection = null;
        }
      }
    }
    
    // Detect section start
    if (!currentSection && line.match(/\{\s*id: "/)) {
      const idMatch = line.match(/id: "([^"]+)"/);
      if (idMatch) {
        currentSection = {
          id: idMatch[1],
          startLine: i,
          endLine: -1,
        };
        sectionDepth = 1;
        sectionStartDepth = 1;
      }
    }
  }
}

console.log(`Found ${sections.length} sections:`);
sections.forEach(s => {
  const sectionLines = lines.slice(s.startLine, s.endLine + 1);
  const unitCount = sectionLines.filter(l => l.match(/\{\s*id: "/)).length;
  console.log(`  ${s.id}: lines ${s.startLine}-${s.endLine}, ${unitCount} units`);
});

// Now expand each section to have 5 units
// We'll insert new units before the section's closing }
function generateUnit(unitIndex, ageGroup) {
  const isA = ageGroup === "A";
  const questionCount = isA ? 8 : 12;
  
  const lessons = [];
  for (let l = 1; l <= 5; l++) {
    const notes = isA 
      ? "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!"
      : "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills that will help you navigate the digital world safely and responsibly. Discuss these concepts with a trusted adult or teacher.";
    
    const missionBriefing = isA
      ? "🎯 Mission: Safety Scout! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!"
      : "🎯 Mission: Digital Investigator! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!";
    
    const questions = [];
    for (let q = 1; q <= questionCount; q++) {
      const typeRoll = ((unitIndex * 5 + l + q) * 7) % 10;
      let question;
      if (typeRoll < 4) {
        question = `{
              id: "q${q}",
              type: "mcq",
              question: "Question ${q} about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            }`;
      } else if (typeRoll < 6) {
        question = `{
              id: "q${q}",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            }`;
      } else if (typeRoll < 8) {
        question = `{
              id: "q${q}",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            }`;
      } else {
        question = `{
              id: "q${q}",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "First step to take",
                "Second step to take",
                "Third step to take",
                "Fourth step to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Following steps in order keeps you safe.",
            }`;
      }
      questions.push(question);
    }
    
    lessons.push(`{
            id: "l${l}",
            title: "Lesson ${l}: Learning More",
            notes: "${notes}",
            missionBriefing: "${missionBriefing}",
            difficulty: ${((unitIndex + l) % 3) + 2},
            questions: [
              ${questions.join(",\n              ")}
            ],
          }`);
  }
  
  return `{
        id: "unit-${unitIndex + 1}",
        title: "Unit ${unitIndex + 1}",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          ${lessons.join(",\n          ")}
        ],
      }`;
}

// Process sections in reverse order to maintain line numbers
for (let s = sections.length - 1; s >= 0; s--) {
  const section = sections[s];
  const sectionLines = lines.slice(section.startLine, section.endLine + 1);
  
  // Count current units by finding unit objects
  let unitCount = 0;
  let inUnitsArray = false;
  for (const line of sectionLines) {
    if (line.includes("units: [")) {
      inUnitsArray = true;
    }
    if (inUnitsArray && line.match(/\{\s*id: "/)) {
      unitCount++;
    }
    if (inUnitsArray && line.includes("],") && !line.includes("questions:")) {
      // This might be the end of units array
    }
  }
  
  // Find ageGroup
  const ageGroupMatch = sectionLines.join("\n").match(/ageGroup: "([^"]+)"/);
  const ageGroup = ageGroupMatch ? ageGroupMatch[1] : "A";
  
  console.log(`Expanding ${section.id}: current units ≈ ${unitCount}, ageGroup=${ageGroup}`);
  
  // Find the last unit's closing and insert new units before section closes
  // We need to find the line with `    ],` that closes the units array
  // This is tricky because lessons also end with `],`
  
  // Simple approach: find the second-to-last `},` in the section
  // which should be the units array closing
  
  let insertLine = section.endLine;
  
  // Generate new units
  const newUnits = [];
  for (let i = unitCount; i < 5; i++) {
    newUnits.push(generateUnit(i, ageGroup));
  }
  
  if (newUnits.length > 0) {
    const newUnitsText = ",\n      " + newUnits.join(",\n      ");
    
    // Insert before the section's closing },
    // The section closes with `  },` on its own line (indented 2 spaces)
    // We need to insert before that line
    lines.splice(insertLine, 0, newUnitsText);
    
    // Update section end lines for all sections before this one
    for (let j = 0; j < s; j++) {
      sections[j].endLine += newUnitsText.split("\n").length;
    }
    
    console.log(`  Added ${newUnits.length} new units to ${section.id}`);
  }
}

// Write updated file
fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
console.log("\nExpanded curriculumSeed.ts written successfully.");

// Verify
const newContent = fs.readFileSync(filePath, "utf-8");
const newLineCount = newContent.split("\n").length;
console.log("New file lines:", newLineCount);
