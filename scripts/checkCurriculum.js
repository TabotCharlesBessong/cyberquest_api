const { CURRICULUM } = require('./src/seeders/curriculumSeed.ts');

console.log('Checking CURRICULUM sections...');
let issues = [];

for (const section of CURRICULUM.sections) {
  if (!section) {
    issues.push('Found undefined section');
    continue;
  }
  
  if (!section.units) {
    issues.push(`Section ${section.id} has no units`);
    continue;
  }
  
  for (const unit of section.units) {
    if (!unit) {
      issues.push(`Section ${section.id} has undefined unit`);
      continue;
    }
    
    if (!unit.lessons) {
      issues.push(`Section ${section.id}, Unit ${unit.id} has no lessons`);
      continue;
    }
    
    for (const lesson of unit.lessons) {
      if (!lesson) {
        issues.push(`Section ${section.id}, Unit ${unit.id} has undefined lesson`);
        continue;
      }
      
      if (!lesson.questions) {
        issues.push(`Section ${section.id}, Unit ${unit.id}, Lesson ${lesson.id} has no questions`);
        continue;
      }
      
      for (const q of lesson.questions) {
        if (!q) {
          issues.push(`Section ${section.id}, Unit ${unit.id}, Lesson ${lesson.id} has undefined question`);
        }
      }
    }
  }
}

if (issues.length > 0) {
  console.log('Found issues:');
  issues.forEach(i => console.log(' - ' + i));
} else {
  console.log('No issues found!');
}

console.log(`Total sections: ${CURRICULUM.sections.length}`);
