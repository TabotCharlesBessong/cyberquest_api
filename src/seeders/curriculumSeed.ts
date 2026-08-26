export interface CurriculumQuestion {
  id: string;
  lessonId: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctIndex?: number;
  pairs?: { left: string; right: string }[];
  sentenceParts?: string[];
  sentence?: string;
  missingWords?: string[];
  correctSentence?: string;
  investigationSteps?: string[];
  correctOrder?: number[];
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  xpReward: number;
}

export interface CurriculumLesson {
  id: string;
  unitId: string;
  title: string;
  notes: string;
  missionBriefing?: string;
  voiceOver?: string;
  order: number;
  ageGroup: "A" | "B";
  difficulty: 1 | 2 | 3 | 4 | 5;
  questions: CurriculumQuestion[];
}

export interface CurriculumUnit {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  ageGroup: "A" | "B";
  lessons: CurriculumLesson[];
}

export interface CurriculumSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  ageGroup: "A" | "B";
  units: CurriculumUnit[];
}

export interface CurriculumData {
  sections: CurriculumSection[];
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seedInput: string): () => number {
  let x = hashSeed(seedInput) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], seed: string): T[] {
  const a = [...arr];
  const rand = seededRandom(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Old signature: q(lessonId, id, question, correct, wrongs, explanation, difficulty?, xpReward?)
function q(
  lessonId: string,
  id: string,
  question: string,
  correct: string,
  wrongs: string[],
  explanation: string,
  difficulty?: 1 | 2 | 3 | 4 | 5,
  xpReward?: number
): CurriculumQuestion;
// New signature: q(lessonId, id, type, question, payload, explanation, difficulty?, xpReward?)
function q(
  lessonId: string,
  id: string,
  type: QuestionType,
  question: string,
  payload: {
    correctIndex?: number;
    options?: string[];
    pairs?: { left: string; right: string }[];
    sentence?: string;
    missingWords?: string[];
    sentenceParts?: string[];
    correctSentence?: string;
    investigationSteps?: string[];
    correctOrder?: number[];
  },
  explanation: string,
  difficulty?: 1 | 2 | 3 | 4 | 5,
  xpReward?: number
): CurriculumQuestion;
// Implementation
function q(
  lessonId: string,
  id: string,
  typeOrQuestion: string | QuestionType,
  maybeQuestionOrCorrect: string | {
    correctIndex?: number;
    options?: string[];
    pairs?: { left: string; right: string }[];
    sentence?: string;
    missingWords?: string[];
    sentenceParts?: string[];
    correctSentence?: string;
    investigationSteps?: string[];
    correctOrder?: number[];
  },
  maybeCorrectOrWrongsOrPayload: string | string[] | {
    correctIndex?: number;
    options?: string[];
    pairs?: { left: string; right: string }[];
    sentence?: string;
    missingWords?: string[];
    sentenceParts?: string[];
    correctSentence?: string;
    investigationSteps?: string[];
    correctOrder?: number[];
  },
  maybeExplanationOrDifficulty: string | number,
  maybeDifficultyOrXpReward?: number,
  maybeXpReward?: number
): CurriculumQuestion {
  const QUESTION_TYPES: QuestionType[] = ["mcq", "matching", "sentence_builder", "investigation"];
  const isNewSignature = typeof typeOrQuestion === "string" && QUESTION_TYPES.includes(typeOrQuestion as QuestionType);

  let type: QuestionType = "mcq";
  let question: string = "";
  let payload: {
    correctIndex?: number;
    options?: string[];
    pairs?: { left: string; right: string }[];
    sentence?: string;
    missingWords?: string[];
    sentenceParts?: string[];
    correctSentence?: string;
    investigationSteps?: string[];
    correctOrder?: number[];
  } = {};
  let explanation: string = "";
  let difficulty: 1 | 2 | 3 | 4 | 5 = 1;
  let xpReward: number = 10;

  if (isNewSignature) {
    type = typeOrQuestion as QuestionType;
    question = maybeQuestionOrCorrect as string;
    payload = (maybeCorrectOrWrongsOrPayload || {}) as typeof payload;
    explanation = maybeExplanationOrDifficulty as string;
    difficulty = (maybeDifficultyOrXpReward as 1 | 2 | 3 | 4 | 5) || 1;
    xpReward = maybeXpReward || 10;
  } else {
    question = typeOrQuestion;
    const correct = maybeQuestionOrCorrect as string;
    const wrongs = maybeCorrectOrWrongsOrPayload as string[];
    explanation = maybeExplanationOrDifficulty as string;
    difficulty = (maybeDifficultyOrXpReward as 1 | 2 | 3 | 4 | 5) || 1;
    xpReward = maybeXpReward || 10;
    const options = shuffle([correct, ...wrongs], `${lessonId}-${id}`);
    const correctIndex = options.indexOf(correct);
    payload = { options, correctIndex };
  }

  return {
    id: `${lessonId}-${id}`,
    lessonId,
    type,
    question,
    options: payload.options,
    correctIndex: payload.correctIndex,
    pairs: payload.pairs,
    sentence: payload.sentence,
    missingWords: payload.missingWords,
    sentenceParts: payload.sentenceParts,
    correctSentence: payload.correctSentence,
    investigationSteps: payload.investigationSteps,
    correctOrder: payload.correctOrder,
    explanation,
    difficulty,
    xpReward,
  };
}

function lesson(
  unitId: string,
  id: string,
  title: string,
  notes: string,
  order: number,
  ageGroup: "A" | "B",
  difficulty: 1 | 2 | 3 | 4 | 5,
  questions: CurriculumQuestion[],
  missionBriefing?: string,
  voiceOver?: string
): CurriculumLesson {
  return { id: `${unitId}-${id}`, unitId, title, notes, missionBriefing, voiceOver, order, ageGroup, difficulty, questions };
}

function unit(
  sectionId: string,
  id: string,
  title: string,
  description: string,
  icon: string,
  order: number,
  ageGroup: "A" | "B",
  lessons: CurriculumLesson[]
): CurriculumUnit {
  return { id: `${sectionId}-${id}`, sectionId, title, description, icon, order, ageGroup, lessons };
}

function section(
  id: string,
  title: string,
  description: string,
  icon: string,
  color: string,
  order: number,
  ageGroup: "A" | "B",
  units: CurriculumUnit[]
): CurriculumSection {
  return { id, title, description, icon, color, order, ageGroup, units };
}

export type QuestionType = "mcq" | "matching" | "sentence_builder" | "investigation";

type QuestionDef = {
  id: string;
  type?: QuestionType;
  question: string;
  correct?: string;
  wrongs?: string[];
  options?: string[];
  correctIndex?: number;
  pairs?: { left: string; right: string }[];
  sentenceParts?: string[];
  sentence?: string;
  missingWords?: string[];
  correctSentence?: string;
  investigationSteps?: string[];
  correctOrder?: number[];
  explanation: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  xpReward?: number;
};

type LessonDef = {
  id: string;
  title: string;
  notes: string;
  missionBriefing?: string;
  voiceOver?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  questions: QuestionDef[];
};

type UnitDef = {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: LessonDef[];
};

type SectionDef = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  ageGroup: "A" | "B";
  units: UnitDef[];
};

function buildLesson(unitId: string, ageGroup: "A" | "B", def: LessonDef, order: number): CurriculumLesson {
  const lessonId = `${unitId}-${def.id}`;
  const questions = def.questions.map((qd) => {
    const type = qd.type || "mcq";
    if (type === "mcq" && qd.correct && qd.wrongs) {
      return q(
        lessonId,
        qd.id,
        qd.question,
        qd.correct,
        qd.wrongs,
        qd.explanation,
        qd.difficulty ?? def.difficulty,
        qd.xpReward ?? 10
      );
    }
     return q(
      lessonId,
      qd.id,
      type,
      qd.question,
      {
        options: qd.options,
        correctIndex: qd.correctIndex,
        pairs: qd.pairs,
        sentence: qd.sentence,
        missingWords: qd.missingWords,
        sentenceParts: qd.sentenceParts,
        correctSentence: qd.correctSentence,
        investigationSteps: qd.investigationSteps,
        correctOrder: qd.correctOrder,
      },
      qd.explanation,
      qd.difficulty ?? def.difficulty,
      qd.xpReward ?? 10
    );
  });
  return lesson(unitId, def.id, def.title, def.notes, order, ageGroup, def.difficulty, questions, def.missionBriefing, def.voiceOver);
}

function buildUnit(sectionId: string, ageGroup: "A" | "B", def: UnitDef, order: number): CurriculumUnit {
  const unitId = `${sectionId}-${def.id}`;
  const lessons = def.lessons.map((ld, lessonOrder) => buildLesson(unitId, ageGroup, ld, lessonOrder));
  return unit(sectionId, def.id, def.title, def.description, def.icon, order, ageGroup, lessons);
}

function buildSection(def: SectionDef, order: number): CurriculumSection {
  const units = def.units.map((ud, unitOrder) => buildUnit(def.id, def.ageGroup, ud, unitOrder));
  return section(def.id, def.title, def.description, def.icon, def.color, order, def.ageGroup, units);
}

const SECTION_DEFS: SectionDef[] = [
  {
    id: "a-online-safety",
    title: "Online Safety Basics",
    description: "Learn what is safe to share, who to trust, and how to browse safely.",
    icon: "🛡️",
    color: "#22c55e",
    ageGroup: "A",
    units: [
      {
        id: "personal-info",
        title: "Personal Information",
        description: "Know what to keep private and what is safe to share.",
        icon: "🧩",
        lessons: [
                    {
            id: "what-is-personal",
            title: "What Is Personal Info?",
            notes: "Personal info can identify you in real life. Keep it private online. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Which piece of information could a hacker use to steal your online account?",
                correct: "Your home address",
                wrongs: ["Your favorite color", "Your favorite animal", "Your favorite game"],
                explanation: "An address can be used to find you in real life.",
              },
              {
                id: "q2",
                question: "In an online game, which detail is safest to share with a teammate you just met?",
                correct: "Your favorite cartoon",
                wrongs: ["Your phone number", "Your full name and school", "Where you will be after school"],
                explanation: "Favorites are usually safe, but contact details and locations are not.",
              },
              {
                id: "q3",
                question: "Why do scammers want to steal your password?",
                correct: "Your account so others cannot log in",
                wrongs: ["Your shoes", "Your lunch", "Your homework folder"],
                explanation: "A password keeps other people out of your account.",
              },
              {
                id: "q4",
                question: "A message asks for your address and birthday. What should you do first?",
                correct: "Your parent's phone number",
                wrongs: ["A funny joke", "Your favorite sport", "A drawing you made"],
                explanation: "Phone numbers are personal information.",
              },
              {
                id: "q5",
                question: "If a website asks for your login details and you did not create an account there, what should you do?",
                correct: "Ask a trusted adult",
                wrongs: ["Type it quickly", "Share a friend's address instead", "Ignore the question and click random buttons"],
                explanation: "A trusted adult can help you decide what is safe.",
              },
{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
                    {
            id: "safe-to-share",
            title: "Safe vs Not Safe to Share",
            notes: "Share fun things, not details that can identify you or your family. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Which is OK to share on a kid-safe class forum?",
                correct: "Your favorite book",
                wrongs: ["Your street name", "Your exact age and school name", "A photo showing your house number"],
                explanation: "Favorites are fine; addresses and identifying details are not.",
              },
              {
                id: "q2",
                question: "A stranger asks: 'What school do you go to?' What is the best reply?",
                correct: "I can't share that",
                wrongs: ["I go to Lincoln School", "Here is my school website", "My school is near the mall"],
                explanation: "School details can identify your location.",
              },
              {
                id: "q3",
                question: "Which username is safest?",
                correct: "StarPanda7",
                wrongs: ["Emma_7Years_Old", "Noah_StreetName", "Mia_SchoolName"],
                explanation: "A safe username does not include real age, school, or location.",
              },
              {
                id: "q4",
                question: "Which photo is safest to post?",
                correct: "A drawing you made",
                wrongs: ["A selfie with your school badge", "A photo with your address in the background", "A photo showing your bus number"],
                explanation: "Avoid photos that show identifying information.",
              },
              {
                id: "q5",
                question: "If you are not sure whether something is safe to share, what should you do?",
                correct: "Ask a trusted adult before posting",
                wrongs: ["Post it and delete later", "Send it to strangers to check", "Share it only in a group chat"],
                explanation: "If you're unsure, get help first.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
                    {
            id: "trusted-adult",
            title: "Trusted Adults",
            notes: "Trusted adults can help when something online feels wrong or confusing. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Who is usually a trusted adult?",
                correct: "A parent or caregiver",
                wrongs: ["A stranger online", "Someone you just met in a game", "A person asking for secrets"],
                explanation: "Trusted adults are people who care for you in real life.",
              },
              {
                id: "q2",
                question: "If someone online makes you feel scared, what should you do?",
                correct: "Tell a trusted adult",
                wrongs: ["Keep it secret", "Send them your address to prove you're brave", "Argue with them for hours"],
                explanation: "Adults can help you stay safe.",
              },
              {
                id: "q3",
                question: "A message says: 'Don't tell your parents.' What is this?",
                correct: "A red flag",
                wrongs: ["A good secret", "A fun challenge", "A normal request"],
                explanation: "Safe adults never ask you to hide online problems from trusted adults.",
              },
              {
                id: "q4",
                question: "What is a good step before showing a scary message to an adult?",
                correct: "Take a screenshot if you can",
                wrongs: ["Delete everything and forget", "Reply with insults", "Share it with more strangers"],
                explanation: "Screenshots can help adults understand what happened.",
              },
              {
                id: "q5",
                question: "If you made a mistake online, should you still tell a trusted adult?",
                correct: "Yes, they can help fix it",
                wrongs: ["No, you will always get in trouble", "Only tell strangers", "Only tell your friends"],
                explanation: "Trusted adults help you learn and stay safe.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            }
          ],
          },
        ],
      },
      {
        id: "device-basics",
        title: "Device Safety",
        description: "Simple habits that protect your device and accounts.",
        icon: "📱",
        lessons: [
                    {
            id: "lock-your-device",
            title: "Lock Your Device",
            notes: "A lock code helps protect your apps and messages. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Why should you lock your tablet or phone?",
                correct: "So other people cannot open your apps",
                wrongs: ["So it becomes heavier", "So it charges faster", "So games become louder"],
                explanation: "A lock keeps your stuff private.",
              },
              {
                id: "q2",
                question: "Which is a good lock code choice?",
                correct: "A code only you and your parent know",
                wrongs: ["1234", "0000", "Your birthday"],
                explanation: "Common codes and birthdays are easy to guess.",
              },
              {
                id: "q3",
                question: "What should you do if you think someone knows your password?",
                correct: "Change it and tell a trusted adult",
                wrongs: ["Keep using it forever", "Post it online", "Use the same password for everything"],
                explanation: "Changing the password stops others from using it.",
              },
              {
                id: "q4",
                question: "Is it safe to share your password with friends?",
                correct: "No",
                wrongs: ["Yes, always", "Yes, if they promise", "Yes, if they share theirs too"],
                explanation: "Passwords are private, even with friends.",
              },
              {
                id: "q5",
                question: "When is it OK to ask for help with a password?",
                correct: "When you ask a trusted adult",
                wrongs: ["When a stranger asks you first", "When a game chat asks you", "When someone offers free coins"],
                explanation: "Only trusted adults should help with accounts.",
              },
{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
                    {
            id: "updates",
            title: "Updates Help",
            notes: "Updates can fix problems and make apps safer. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Why do devices get updates?",
                correct: "To fix bugs and improve safety",
                wrongs: ["To make passwords public", "To remove all games", "To break the internet"],
                explanation: "Updates often include security fixes.",
              },
              {
                id: "q2",
                question: "If an update pop-up looks strange, what should you do?",
                correct: "Ask a trusted adult before clicking",
                wrongs: ["Click it fast", "Give it your password", "Share it with strangers"],
                explanation: "Some pop-ups can be fake.",
              },
              {
                id: "q3",
                question: "Where is the safest place to get apps?",
                correct: "An official app store with an adult's help",
                wrongs: ["Random links in chat", "A stranger's website", "Pop-ups that promise prizes"],
                explanation: "Official stores reduce risk of unsafe apps.",
              },
              {
                id: "q4",
                question: "Should you install 'free coins' apps from unknown sites?",
                correct: "No",
                wrongs: ["Yes, always", "Yes, if it looks cool", "Yes, if it uses bright colors"],
                explanation: "Unknown downloads can be unsafe.",
              },
              {
                id: "q5",
                question: "What should you do before installing a new app?",
                correct: "Check with a trusted adult and read what it wants",
                wrongs: ["Install anything quickly", "Share your login to get it", "Turn off all safety settings"],
                explanation: "It helps to understand what the app is asking for.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
                    {
            id: "permissions",
            title: "App Permissions",
            notes: "Apps sometimes ask to use your camera, mic, or location. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "What is a permission?",
                correct: "A request to use something on your device",
                wrongs: ["A new game level", "A secret code", "A type of snack"],
                explanation: "Permissions allow apps to access parts of your device.",
              },
              {
                id: "q2",
                question: "A flashlight app asks to use your microphone. What should you think?",
                correct: "That seems unnecessary",
                wrongs: ["That's always normal", "It must be safe", "It will make the light brighter"],
                explanation: "Apps should only ask for what they need.",
              },
              {
                id: "q3",
                question: "Who should help you decide about permissions?",
                correct: "A trusted adult",
                wrongs: ["A stranger online", "A random pop-up", "Anyone in game chat"],
                explanation: "Adults can help you understand the risks.",
              },
              {
                id: "q4",
                question: "Which permission could reveal where you are?",
                correct: "Location",
                wrongs: ["Brightness", "Volume", "Wallpaper"],
                explanation: "Location can show your real-world position.",
              },
              {
                id: "q5",
                question: "If you don't need an app anymore, what is a safe choice?",
                correct: "Remove the app with adult help",
                wrongs: ["Share it with strangers", "Post your password", "Turn off your device forever"],
                explanation: "Removing unused apps can reduce risk.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
        ],
      },
      {
        id: "safe-browsing",
        title: "Safe Browsing",
        description: "Search and click wisely while exploring the web.",
        icon: "🔎",
        lessons: [
                    {
            id: "safe-search",
            title: "Safe Searching",
            notes: "Use kid-safe search tools and ask for help if results look scary. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "What is a safe way to search online?",
                correct: "Use a kid-safe search with adult guidance",
                wrongs: ["Click any random link", "Type your address into search", "Share your password in search"],
                explanation: "Kid-safe search and adult guidance help reduce unsafe results.",
              },
              {
                id: "q2",
                question: "If a search result looks scary or confusing, what should you do?",
                correct: "Close it and tell a trusted adult",
                wrongs: ["Keep watching alone", "Share it with strangers", "Click more scary links"],
                explanation: "Adults can help you handle unsafe content.",
              },
              {
                id: "q3",
                question: "Which search words are safest?",
                correct: "A school topic like 'planets for kids'",
                wrongs: ["Your phone number", "Your exact home address", "Your full name plus school"],
                explanation: "Avoid searching with personal details.",
              },
              {
                id: "q4",
                question: "What does it mean to 'think before you click'?",
                correct: "Check links and choose safe sites",
                wrongs: ["Click the first thing always", "Click pop-ups for prizes", "Click links from strangers"],
                explanation: "Thinking first helps you avoid unsafe sites.",
              },
              {
                id: "q5",
                question: "If a site asks you to log in and you don't know why, what should you do?",
                correct: "Ask a trusted adult",
                wrongs: ["Use your main password everywhere", "Make up a fake name and share your address", "Give the site your email and phone number"],
                explanation: "If you're unsure, get help before entering details.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
                    {
            id: "popups",
            title: "Pop-ups and Ads",
            notes: "Pop-ups can trick you. Avoid clicking and ask for help. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "A pop-up says 'You won a free phone!' What is it likely to be?",
                correct: "A trick",
                wrongs: ["A guarantee", "A school message", "A trusted adult note"],
                explanation: "Prize pop-ups are often scams.",
              },
              {
                id: "q2",
                question: "What is the safest action when a pop-up appears?",
                correct: "Close it or ask an adult for help",
                wrongs: ["Click it to see prizes", "Type your password", "Share your address"],
                explanation: "Don't interact with suspicious pop-ups.",
              },
              {
                id: "q3",
                question: "Why can ads be risky?",
                correct: "They can lead to unsafe sites",
                wrongs: ["They always teach math", "They make devices faster", "They fix passwords"],
                explanation: "Some ads are misleading and unsafe.",
              },
              {
                id: "q4",
                question: "If you clicked something by mistake and it looks weird, what should you do?",
                correct: "Tell a trusted adult right away",
                wrongs: ["Hide it forever", "Send it to strangers", "Keep clicking until it stops"],
                explanation: "Quick help can prevent bigger problems.",
              },
              {
                id: "q5",
                question: "Which is a safe habit when browsing?",
                correct: "Stay on approved sites",
                wrongs: ["Click unknown downloads", "Talk to strangers for links", "Share personal info to get access"],
                explanation: "Approved sites are less likely to be unsafe.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
                    {
            id: "strangers",
            title: "Strangers Online",
            notes: "Not everyone online is who they say they are. Keep boundaries. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Can someone online pretend to be a kid even if they are not?",
                correct: "Yes",
                wrongs: ["No, never", "Only on weekends", "Only in school apps"],
                explanation: "People can lie about who they are online.",
              },
              {
                id: "q2",
                question: "A stranger asks to meet in real life. What should you do?",
                correct: "Say no and tell a trusted adult",
                wrongs: ["Agree and go alone", "Share your address", "Keep it secret from adults"],
                explanation: "Meeting strangers is unsafe and adults must know.",
              },
              {
                id: "q3",
                question: "Which message is a red flag?",
                correct: "Don't tell your parents about our chat",
                wrongs: ["Great game!", "Good luck on your homework", "Nice job today"],
                explanation: "Asking for secrecy is a warning sign.",
              },
              {
                id: "q4",
                question: "What is a safe rule for chatting online?",
                correct: "Only chat with people you know in real life (or approved lists)",
                wrongs: ["Chat with anyone who asks", "Share your phone number to be friends", "Send your location to prove trust"],
                explanation: "Stick to people you actually know or safe groups.",
              },
              {
                id: "q5",
                question: "If someone is being mean in chat, what is a good action?",
                correct: "Block or report and tell a trusted adult",
                wrongs: ["Be mean back", "Share secrets to make them stop", "Keep chatting for hours"],
                explanation: "Use safety tools and get help.",
              },
{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
        ],
      },
    ( {
        id: "unit-4",
        title: "Unit 4",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 1! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 2! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 3! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 4! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 5! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          }
        ],
      } ) as UnitDef,
      ( {
        id: "unit-5",
        title: "Unit 5",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 1! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 2! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 3! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 4! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 5! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          }
        ],
      } ) as UnitDef] as UnitDef[],
  },
  {
    id: "a-kindness-online",
    title: "Kindness Online",
    description: "Be respectful, stop bullying, and make good choices in chats.",
    icon: "💬",
    color: "#3b82f6",
    ageGroup: "A",
    units: [
      {
        id: "kind-words",
        title: "Kind Words",
        description: "Learn how words online can hurt or help.",
        icon: "🌟",
        lessons: [
                    {
            id: "tone",
            title: "Tone Online",
            notes: "Messages can be misunderstood. Choose kind words. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Why can text messages be confusing?",
                correct: "People cannot hear your voice tone",
                wrongs: ["Phones always break", "Words have no meaning", "It is always sunny online"],
                explanation: "Without voice and face, messages can be misunderstood.",
              },
              {
                id: "q2",
                question: "Which message sounds kind?",
                correct: "Good try! Want some help?",
                wrongs: ["You are terrible!", "Quit the game forever", "Everyone hates you"],
                explanation: "Kind words support others.",
              },
              {
                id: "q3",
                question: "What should you do before sending a message when you are angry?",
                correct: "Pause and think",
                wrongs: ["Send it faster", "Add more insults", "Share someone's secret"],
                explanation: "Pausing helps you avoid hurtful messages.",
              },
              {
                id: "q4",
                question: "If you are not sure a joke will be kind, what is best?",
                correct: "Don't send it",
                wrongs: ["Send it to everyone", "Use all caps and emojis", "Tag the person so they feel bad"],
                explanation: "If it could hurt someone, skip it.",
              },
              {
                id: "q5",
                question: "A good online rule is:",
                correct: "Treat others the way you want to be treated",
                wrongs: ["Be mean to win", "Say anything because it's online", "Hide behind a fake name to be rude"],
                explanation: "Respect matters online too.",
              },
{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
                    {
            id: "cyberbullying",
            title: "What Is Cyberbullying?",
            notes: "Cyberbullying is using devices to be mean or hurtful again and again. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Cyberbullying is:",
                correct: "Being mean online on purpose and repeatedly",
                wrongs: ["Sharing a kind message", "Doing homework", "Playing fairly"],
                explanation: "Bullying online is harmful and repeated.",
              },
              {
                id: "q2",
                question: "Which is an example of cyberbullying?",
                correct: "Posting a mean comment about someone every day",
                wrongs: ["Saying 'hi'", "Helping a friend study", "Sharing a funny animal video"],
                explanation: "Repeated hurtful actions online are bullying.",
              },
              {
                id: "q3",
                question: "If someone bullies you online, what should you do?",
                correct: "Save evidence and tell a trusted adult",
                wrongs: ["Keep it secret", "Bully them back", "Share your password to stop them"],
                explanation: "Adults can help stop the bullying safely.",
              },
              {
                id: "q4",
                question: "Is it bullying if it happens online?",
                correct: "Yes, it still hurts",
                wrongs: ["No, online doesn't count", "Only if it's in a game", "Only if it's after school"],
                explanation: "Online words and actions can cause real harm.",
              },
              {
                id: "q5",
                question: "What is a safe tool you can use if someone is mean?",
                correct: "Block and report",
                wrongs: ["Share your address", "Send them money", "Give them your account"],
                explanation: "Blocking and reporting can stop contact.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
                    {
            id: "bystander",
            title: "Helping as a Bystander",
            notes: "If you see bullying, you can help safely by reporting and supporting. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "A bystander is someone who:",
                correct: "Sees what is happening",
                wrongs: ["Causes the bullying", "Is always the teacher", "Is a computer"],
                explanation: "Bystanders witness events.",
              },
              {
                id: "q2",
                question: "What is a safe way to help someone being bullied?",
                correct: "Report it and tell a trusted adult",
                wrongs: ["Join in", "Share the mean message", "Laugh and do nothing"],
                explanation: "Reporting helps stop it safely.",
              },
              {
                id: "q3",
                question: "Which message can support the target?",
                correct: "I'm sorry that happened. I'm here for you.",
                wrongs: ["You deserve it", "That's funny", "Ignore it forever"],
                explanation: "Supportive messages can help someone feel less alone.",
              },
              {
                id: "q4",
                question: "Should you share mean posts to 'show people'?",
                correct: "No, it spreads the harm",
                wrongs: ["Yes, always", "Only on weekends", "Only if it's a screenshot"],
                explanation: "Sharing can make bullying worse.",
              },
              {
                id: "q5",
                question: "If you feel unsafe stepping in directly, what should you do?",
                correct: "Get an adult to help",
                wrongs: ["Challenge the bully alone", "Meet them in person", "Give them your password"],
                explanation: "Safety first—ask adults for help.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            }
          ],
          },
        ],
      },
      {
        id: "digital-footprint",
        title: "Digital Footprint",
        description: "Learn that what you do online can last a long time.",
        icon: "👣",
        lessons: [
                    {
            id: "posts-last",
            title: "Posts Can Last",
            notes: "Even if you delete something, others may have saved it. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "A digital footprint is:",
                correct: "The trail you leave online",
                wrongs: ["A shoe print in mud", "A computer mouse", "A secret map"],
                explanation: "Online actions leave a trail of information.",
              },
              {
                id: "q2",
                question: "If you delete a post, is it always gone forever?",
                correct: "No, someone may have saved it",
                wrongs: ["Yes, always gone", "Only gone on Mondays", "Only gone if you use emojis"],
                explanation: "Screenshots and backups can keep it.",
              },
              {
                id: "q3",
                question: "What is a safe rule before posting?",
                correct: "Would I be okay if my family saw this?",
                wrongs: ["Will this hurt someone?", "Is this private?", "All of the above"],
                explanation: "Thinking ahead helps you post safely and kindly.",
              },
              {
                id: "q4",
                question: "Which post is safest?",
                correct: "A kind message about a hobby",
                wrongs: ["A picture with your address visible", "Your phone number", "A mean joke about someone"],
                explanation: "Avoid personal info and unkind content.",
              },
              {
                id: "q5",
                question: "Why is a good digital footprint important?",
                correct: "People may see it later",
                wrongs: ["It makes devices heavier", "It stops updates", "It changes your eye color"],
                explanation: "Your online actions can be seen later by others.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            }
          ],
          },
                    {
            id: "think-before-share",
            title: "Think Before Sharing",
            notes: "Share with care. Private info and hurtful content can cause problems. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Before sharing a photo, you should check for:",
                correct: "Personal info in the background",
                wrongs: ["More pop-ups", "More ads", "More game coins"],
                explanation: "Background details can reveal private information.",
              },
              {
                id: "q2",
                question: "What is oversharing?",
                correct: "Sharing too much personal info online",
                wrongs: ["Sharing one joke", "Sharing a drawing", "Sharing a recipe with family"],
                explanation: "Oversharing can be unsafe.",
              },
              {
                id: "q3",
                question: "A good question to ask is:",
                correct: "Is this kind and safe?",
                wrongs: ["Will this start drama?", "Will this embarrass someone?", "Will this reveal a secret?"],
                explanation: "Aim for safe and kind choices.",
              },
              {
                id: "q4",
                question: "If a friend asks you to share their secret photo, what should you do?",
                correct: "Say no and protect their privacy",
                wrongs: ["Share it to be funny", "Send it to strangers", "Post it publicly"],
                explanation: "Respect others' privacy.",
              },
              {
                id: "q5",
                question: "Which is a safe sharing choice?",
                correct: "A picture of a craft you made (no private info showing)",
                wrongs: ["A picture of your report card with your name", "A photo showing your house number", "A selfie with your school badge"],
                explanation: "Share content that doesn't identify you.",
              },
{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
                    {
            id: "privacy-settings",
            title: "Privacy Settings Basics",
            notes: "Privacy settings help control who can see your posts and messages. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "Privacy settings help you:",
                correct: "Control who can see your information",
                wrongs: ["Make games louder", "Charge your device", "Change the weather"],
                explanation: "They control visibility of your content and profile.",
              },
              {
                id: "q2",
                question: "Which is safer for a kid account?",
                correct: "Private account with parent help",
                wrongs: ["Public account for everyone", "No password at all", "Share your login with friends"],
                explanation: "Private settings reduce who can contact you.",
              },
              {
                id: "q3",
                question: "If you don't understand a setting, what should you do?",
                correct: "Ask a trusted adult",
                wrongs: ["Turn everything on", "Click random buttons", "Post your password to ask for help"],
                explanation: "Adults can help you set things safely.",
              },
              {
                id: "q4",
                question: "If someone you don't know can message you, what is a good step?",
                correct: "Change settings and block/report if needed",
                wrongs: ["Give them your number", "Meet them", "Share your address"],
                explanation: "Control who can reach you and use safety tools.",
              },
              {
                id: "q5",
                question: "What is the safest way to accept friend requests?",
                correct: "Only accept people you know in real life",
                wrongs: ["Accept everyone", "Accept anyone with a cool avatar", "Accept anyone who offers prizes"],
                explanation: "Strangers may not be safe.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
        ],
      },
      {
        id: "group-chats",
        title: "Group Chats",
        description: "Stay safe and respectful in group messages.",
        icon: "👥",
        lessons: [
                    {
            id: "rules",
            title: "Group Chat Rules",
            notes: "Follow rules: be kind, don't spam, and don't share private info. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "A good rule in group chat is:",
                correct: "Be kind and respectful",
                wrongs: ["Spam emojis to annoy people", "Share private info for fun", "Make mean jokes"],
                explanation: "Respect keeps chats safe and friendly.",
              },
              {
                id: "q2",
                question: "What should you avoid sharing in group chats?",
                correct: "Your address",
                wrongs: ["A funny sticker", "A homework tip", "A book recommendation"],
                explanation: "Addresses are personal information.",
              },
              {
                id: "q3",
                question: "If the chat gets mean, what should you do?",
                correct: "Leave, mute, or tell a trusted adult",
                wrongs: ["Join the mean messages", "Share secrets", "Threaten people"],
                explanation: "Use safe tools and get help.",
              },
              {
                id: "q4",
                question: "If someone adds strangers to the chat, what is a safe step?",
                correct: "Tell a trusted adult or a group admin",
                wrongs: ["Share your phone number", "Plan to meet them", "Give them your password"],
                explanation: "Adults/admins can remove unsafe members.",
              },
              {
                id: "q5",
                question: "Is it okay to pressure others to share secrets?",
                correct: "No",
                wrongs: ["Yes, always", "Yes, if it's in a group chat", "Yes, if they are your friend"],
                explanation: "Respect privacy and boundaries.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
                    {
            id: "screenshots",
            title: "Screenshots and Respect",
            notes: "Screenshots can spread messages. Ask before sharing. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "A screenshot is:",
                correct: "A picture of what is on your screen",
                wrongs: ["A new password", "A type of virus", "A game coin"],
                explanation: "Screenshots capture what you see on screen.",
              },
              {
                id: "q2",
                question: "Should you share private messages without asking?",
                correct: "No",
                wrongs: ["Yes, always", "Only if it's funny", "Only if you blur nothing"],
                explanation: "Sharing private messages can hurt trust and privacy.",
              },
              {
                id: "q3",
                question: "When is a screenshot helpful?",
                correct: "To show a trusted adult a problem",
                wrongs: ["To embarrass someone", "To spread rumors", "To start drama"],
                explanation: "Evidence can help adults fix issues.",
              },
              {
                id: "q4",
                question: "What should you do if someone shares your private message?",
                correct: "Tell a trusted adult and use report tools",
                wrongs: ["Share everyone's secrets back", "Meet them to fight", "Post your password publicly"],
                explanation: "Adults and reporting tools can help.",
              },
              {
                id: "q5",
                question: "A good privacy habit is:",
                correct: "Ask before posting about others",
                wrongs: ["Post first, think later", "Tag everyone to laugh at them", "Share personal info to get attention"],
                explanation: "Respect others' privacy.",
              },
{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
                    {
            id: "report-block",
            title: "Report and Block",
            notes: "Use tools to stop bad behavior: block, report, and tell adults. Cybercrime is any illegal activity that happens online or uses digital devices. Hackers, scammers, and bullies use the internet to trick people, steal information, or cause harm. Learning to spot these threats is your first line of defense. Always pause before clicking links, sharing personal details, or responding to strange messages. If something feels wrong, tell a trusted adult right away. The skills you build here will help protect you and your family online. Practice them every time you go online, and remember: when in doubt, check it out with an adult first.",
            missionBriefing: "Mission: Safety Scout! Your mission is to complete this lesson and answer the questions. Listen carefully!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 1,
            questions: [

              {
                id: "q1",
                question: "What does 'block' usually do?",
                correct: "Stops someone from contacting you",
                wrongs: ["Gives them your address", "Makes your device slower", "Deletes your homework"],
                explanation: "Blocking prevents messages and contact.",
              },
              {
                id: "q2",
                question: "What does 'report' do?",
                correct: "Tells the app or moderators about a problem",
                wrongs: ["Shares your password", "Buys coins", "Changes your grades"],
                explanation: "Reporting alerts the platform to unsafe behavior.",
              },
              {
                id: "q3",
                question: "If someone is being mean repeatedly, what is best?",
                correct: "Block, report, and tell a trusted adult",
                wrongs: ["Keep arguing", "Share more personal info", "Meet them to prove a point"],
                explanation: "Use tools and get adult support.",
              },
              {
                id: "q4",
                question: "Should you respond to a bully to 'win'?",
                correct: "No, it can make it worse",
                wrongs: ["Yes, always", "Yes, with secrets", "Yes, with threats"],
                explanation: "Engaging often escalates problems.",
              },
              {
                id: "q5",
                question: "If you are worried you will get in trouble, should you still tell an adult?",
                correct: "Yes, safety comes first",
                wrongs: ["No, never", "Only tell strangers", "Only tell later next year"],
                explanation: "Trusted adults can help you stay safe.",
              },
{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
        ],
      },
    ( {
        id: "unit-4",
        title: "Unit 4",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 1! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 2! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 3! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 4! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 5! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          }
        ],
      } ) as UnitDef,
      ( {
        id: "unit-5",
        title: "Unit 5",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 1! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 2! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 3! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 4! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 5! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          }
        ],
      } ) as UnitDef] as UnitDef[],
  },
  {
    id: "b-privacy-passwords",
    title: "Privacy & Passwords",
    description: "Protect accounts and personal data with strong habits.",
    icon: "🔐",
    color: "#a855f7",
    ageGroup: "B",
    units: [
      {
        id: "passwords",
        title: "Passwords",
        description: "Build strong passwords and keep them safe.",
        icon: "🔑",
        lessons: [
                    {
            id: "strong-passphrases",
            title: "Strong Passphrases",
            notes: "Long passphrases are easier to remember and harder to guess. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "Which password is strongest?",
                correct: "BlueTiger!River9",
                wrongs: ["password", "12345678", "emma2014"],
                explanation: "Strong passwords are longer, less predictable, and mix different character types.",
              },
              {
                id: "q2",
                question: "Why are long passphrases useful?",
                correct: "They are harder to guess and can be memorable",
                wrongs: ["They make Wi‑Fi faster", "They remove ads", "They stop all hackers instantly"],
                explanation: "Length adds strength, and phrases can be remembered.",
              },
              {
                id: "q3",
                question: "Which is a bad password habit?",
                correct: "Using your name or birthday",
                wrongs: ["Using a long phrase", "Using a mix of characters", "Keeping it secret"],
                explanation: "Personal details are easy to guess.",
              },
              {
                id: "q4",
                question: "If someone sees you type your password in public, what should you do?",
                correct: "Change it as soon as possible",
                wrongs: ["Keep using it forever", "Post it online", "Reuse it everywhere"],
                explanation: "If it might be exposed, change it.",
              },
              {
                id: "q5",
                question: "Which is a strong passphrase idea?",
                correct: "A sentence with extra characters",
                wrongs: ["Your pet name only", "Your school name", "A single short word"],
                explanation: "A longer phrase with variety is stronger.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
                    {
            id: "reuse",
            title: "Password Reuse",
            notes: "Reusing passwords is risky because one leak can unlock many accounts. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "Why is reusing the same password risky?",
                correct: "If one account is hacked, others can be hacked too",
                wrongs: ["It makes your phone heavier", "It improves battery life", "It stops updates"],
                explanation: "A leaked password can be tried on other sites.",
              },
              {
                id: "q2",
                question: "If a game site is breached, what should you do about similar passwords?",
                correct: "Change them on other sites too",
                wrongs: ["Do nothing", "Share the password with friends", "Use an even shorter password"],
                explanation: "Password reuse spreads risk.",
              },
              {
                id: "q3",
                question: "Which is the safest approach?",
                correct: "Different strong passwords for important accounts",
                wrongs: ["One password for everything", "Share one password with friends", "Use your birthday everywhere"],
                explanation: "Unique passwords limit damage.",
              },
              {
                id: "q4",
                question: "A password manager can help by:",
                correct: "Storing unique passwords securely",
                wrongs: ["Posting your passwords online", "Removing all passwords", "Making pop-ups appear"],
                explanation: "Managers help you use unique passwords without memorizing all of them.",
              },
              {
                id: "q5",
                question: "If you must remember one thing about passwords, it is:",
                correct: "Use strong and unique passwords",
                wrongs: ["Use short and easy passwords", "Reuse the same password", "Share passwords in chat"],
                explanation: "Strong and unique is the safest habit.",
              },
{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q9",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q10",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            }
          ],
          },
                    {
            id: "two-factor",
            title: "Two-Factor Authentication (2FA)",
            notes: "2FA adds a Do not click any links or download attachments (like a code) to protect your account. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "Two-factor authentication adds:",
                correct: "A Do not click any links or download attachments to log in",
                wrongs: ["More pop-ups", "A louder ringtone", "A new keyboard"],
                explanation: "2FA requires something else besides the password.",
              },
              {
                id: "q2",
                question: "Why does 2FA help?",
                correct: "A password alone is not enough to log in",
                wrongs: ["It makes passwords shorter", "It shares your location", "It removes updates"],
                explanation: "Even if a password is stolen, the attacker may not have the code.",
              },
              {
                id: "q3",
                question: "Which is an example of a 2FA method?",
                correct: "A one-time code from an authenticator app",
                wrongs: ["Your favorite color", "Your username", "A public comment"],
                explanation: "A one-time code is a second factor.",
              },
              {
                id: "q4",
                question: "If someone asks you to share your 2FA code, what should you do?",
                correct: "Never share it",
                wrongs: ["Share it to be polite", "Post it to get help", "Send it if they promise a prize"],
                explanation: "Sharing the code lets others access your account.",
              },
              {
                id: "q5",
                question: "Where should you keep recovery codes?",
                correct: "Somewhere safe with a trusted adult",
                wrongs: ["In a public chat", "On a sticky note on your laptop", "As your username"],
                explanation: "Recovery codes must be protected like passwords.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q11",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q12",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
        ],
      },
      {
        id: "privacy-data",
        title: "Privacy & Data",
        description: "Understand what data is sensitive and how to protect it.",
        icon: "🗂️",
        lessons: [
                    {
            id: "pii-sensitive",
            title: "PII and Sensitive Data",
            notes: "PII is information that can identify a person. Some data is extra sensitive. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "Which is personally identifiable information (PII)?",
                correct: "A phone number",
                wrongs: ["A favorite movie", "A game high score", "A cartoon character"],
                explanation: "Phone numbers can identify and contact a person.",
              },
              {
                id: "q2",
                question: "Which is sensitive and should be protected carefully?",
                correct: "Passwords",
                wrongs: ["A sports team you like", "A joke", "A color"],
                explanation: "Passwords protect accounts and must be kept private.",
              },
              {
                id: "q3",
                question: "Why is sharing your school and schedule risky?",
                correct: "It can reveal your real-world location and routine",
                wrongs: ["It makes your phone slower", "It improves Wi‑Fi speed", "It changes your device color"],
                explanation: "Location and routine can be used to target you.",
              },
              {
                id: "q4",
                question: "Which is the safest profile choice?",
                correct: "No real name or location in your bio",
                wrongs: ["Full name + school", "Home address", "Phone number"],
                explanation: "Avoid sharing identifying details publicly.",
              },
              {
                id: "q5",
                question: "If you must share private data for a school task, you should:",
                correct: "Use approved tools with teacher/parent guidance",
                wrongs: ["Post it publicly", "Send it to strangers", "Share it in game chat"],
                explanation: "Use trusted channels and adult/teacher guidance.",
              },
{
              id: "q6",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q7",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            }
          ],
          },
                    {
            id: "location",
            title: "Location Sharing",
            notes: "Location can be shared by apps, photos, and posts. Control it. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "Which permission can reveal where you are?",
                correct: "Location access",
                wrongs: ["Volume", "Brightness", "Wallpaper"],
                explanation: "Location access can share your position.",
              },
              {
                id: "q2",
                question: "A photo can reveal location if it shows:",
                correct: "Street signs or house numbers",
                wrongs: ["A blank wall", "A cartoon drawing", "A book cover"],
                explanation: "Visible signs/numbers can identify where you are.",
              },
              {
                id: "q3",
                question: "Which is a safer choice for location settings?",
                correct: "Only allow location when needed",
                wrongs: ["Always allow for every app", "Share location publicly", "Turn off passwords"],
                explanation: "Limit location access to reduce risk.",
              },
              {
                id: "q4",
                question: "A stranger asks for your city. What should you do?",
                correct: "Do not share it",
                wrongs: ["Share exact location", "Share your school too", "Share your daily schedule"],
                explanation: "Location details can be unsafe to share with strangers.",
              },
              {
                id: "q5",
                question: "Who can help you check location settings?",
                correct: "A trusted adult",
                wrongs: ["A stranger in comments", "A random pop-up", "Anyone who offers prizes"],
                explanation: "Trusted adults can help you configure privacy safely.",
              },
{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q9",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q10",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            }
          ],
          },
                    {
            id: "breach",
            title: "If Data Leaks",
            notes: "If a site is hacked, change passwords and review account security. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "A data breach means:",
                correct: "A company had data stolen or exposed",
                wrongs: ["A phone got louder", "A game updated", "A battery charged faster"],
                explanation: "Breaches expose user data.",
              },
              {
                id: "q2",
                question: "If your password may be leaked, what is a good Identify the suspicious message?",
                correct: "Change the password",
                wrongs: ["Share it publicly", "Use the same password everywhere", "Ignore it forever"],
                explanation: "Changing passwords reduces risk quickly.",
              },
              {
                id: "q3",
                question: "What else is smart to do after changing a password?",
                correct: "Turn on 2FA if available",
                wrongs: ["Turn off all security", "Post your new password", "Reuse the old one"],
                explanation: "2FA adds more protection.",
              },
              {
                id: "q4",
                question: "If you reused the password on other sites, you should:",
                correct: "Change it on those sites too",
                wrongs: ["Keep it the same", "Tell strangers", "Write it on a public sticky note"],
                explanation: "Reuse spreads the damage from one breach to many accounts.",
              },
              {
                id: "q5",
                question: "Who should you tell if your account may be at risk?",
                correct: "A trusted adult",
                wrongs: ["A stranger online", "Only the bully", "No one"],
                explanation: "Adults can help secure accounts and contact support if needed.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q9",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            }
          ],
          },
        ],
      },
      {
        id: "accounts-devices",
        title: "Accounts & Devices",
        description: "Secure logins and avoid unsafe sign-in prompts.",
        icon: "👤",
        lessons: [
                    {
            id: "security-checklist",
            title: "Security Checklist",
            notes: "Use strong passwords, 2FA, and updated devices. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "Which is part of a good account security checklist?",
                correct: "Use strong unique passwords",
                wrongs: ["Reuse one password", "Share your login", "Disable updates"],
                explanation: "Unique passwords reduce account takeovers.",
              },
              {
                id: "q2",
                question: "Which is a good sign your account is safe?",
                correct: "2FA is enabled",
                wrongs: ["Password is '1234'", "Password is your birthday", "You share it with friends"],
                explanation: "2FA improves security a lot.",
              },
              {
                id: "q3",
                question: "Why are updates important?",
                correct: "They often fix security problems",
                wrongs: ["They remove passwords", "They expose data", "They make scams safer"],
                explanation: "Security updates patch vulnerabilities.",
              },
              {
                id: "q4",
                question: "What should you do if you get a login alert you didn't expect?",
                correct: "Change your password and tell a trusted adult",
                wrongs: ["Ignore it", "Share your password to check", "Turn off your account forever"],
                explanation: "Unexpected alerts can mean someone tried to log in.",
              },
              {
                id: "q5",
                question: "A safe account habit is:",
                correct: "Review privacy and security settings regularly",
                wrongs: ["Never check settings", "Post your recovery email publicly", "Accept unknown friend requests"],
                explanation: "Regular checks can catch risky settings.",
              },
{
              id: "q6",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            }
          ],
          },
                    {
            id: "fake-login",
            title: "Fake Login Pages",
            notes: "Scammers create fake pages to steal passwords. Check the URL and source. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [

              {
                id: "q1",
                question: "A fake login page is designed to:",
                correct: "Trick you into typing your password",
                wrongs: ["Help you learn math", "Make your device faster", "Fix your keyboard"],
                explanation: "Fake pages steal credentials.",
              },
              {
                id: "q2",
                question: "A safer way to log in is to:",
                correct: "Use the official app or type the site address yourself",
                wrongs: ["Click links from random messages", "Use any pop-up", "Share your password in chat"],
                explanation: "Avoid unknown links and use official sources.",
              },
              {
                id: "q3",
                question: "Which URL looks more trustworthy for example.com?",
                correct: "https://example.com/login",
                wrongs: ["https://example.com.login-secure.net", "https://examp1e.com/login", "http://example.com.free-prize.net"],
                explanation: "Look for the real domain name and HTTPS.",
              },
              {
                id: "q4",
                question: "If a site asks you to 'confirm' your password again unexpectedly, you should:",
                correct: "Stop and verify it's the real site",
                wrongs: ["Type it immediately", "Send it to a friend", "Post it publicly"],
                explanation: "Unexpected prompts can be phishing.",
              },
              {
                id: "q5",
                question: "If you think you entered your password on a fake page, what should you do?",
                correct: "Change your password immediately",
                wrongs: ["Do nothing", "Reuse it elsewhere", "Share it to warn others"],
                explanation: "Changing the password quickly helps protect your account.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q9",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            }
          ],
          },
                    {
            id: "shared-devices",
            title: "Shared Devices",
            notes: "Be careful when using shared devices: log out and don't save passwords. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "On a shared computer, a safe habit is:",
                correct: "Log out when finished",
                wrongs: ["Stay logged in forever", "Save passwords in the browser", "Share your login with others"],
                explanation: "Logging out prevents the next user from accessing your account.",
              },
              {
                id: "q2",
                question: "Should you click 'remember me' on a public device?",
                correct: "No",
                wrongs: ["Yes, always", "Yes, if you are in a hurry", "Yes, if it is a school day"],
                explanation: "Public devices should not store your login.",
              },
              {
                id: "q3",
                question: "If you forgot to log out, what should you do?",
                correct: "Change your password and log out from other sessions if possible",
                wrongs: ["Ignore it", "Tell strangers your password", "Reuse the same password everywhere"],
                explanation: "Changing password and closing sessions helps secure the account.",
              },
              {
                id: "q4",
                question: "Why are shared devices riskier?",
                correct: "Other people could access your account",
                wrongs: ["They cannot connect to Wi‑Fi", "They stop updates", "They make passwords stronger"],
                explanation: "Accounts can remain open or passwords can be saved.",
              },
              {
                id: "q5",
                question: "If a browser offers to save your password on a shared device, you should:",
                correct: "Decline",
                wrongs: ["Accept", "Share the saved password", "Write it in a public note"],
                explanation: "Avoid storing passwords on shared devices.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            }
          ],
          },
        ],
      },
    ( {
        id: "unit-4",
        title: "Unit 4",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 1! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q12",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 2! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q11",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q12",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 3! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q10",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q11",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 4! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q9",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q10",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 5! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q9",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          }
        ],
      } ) as UnitDef,
      ( {
        id: "unit-5",
        title: "Unit 5",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 1! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 2! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 3! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 4! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 5! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          }
        ],
      } ) as UnitDef] as UnitDef[],
  },
  {
    id: "b-scams-phishing",
    title: "Scams & Phishing",
    description: "Spot red flags, avoid suspicious links, and know what to do after a mistake.",
    icon: "🎣",
    color: "#f97316",
    ageGroup: "B",
    units: [
      {
        id: "phishing-basics",
        title: "Phishing Basics",
        description: "Learn how phishing messages try to steal info.",
        icon: "📨",
        lessons: [
                    {
            id: "red-flags",
            title: "Phishing Red Flags",
            notes: "Watch for urgency, threats, and unexpected requests for info. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "A common phishing red flag is:",
                correct: "Urgent pressure like 'act now!'",
                wrongs: ["A friendly greeting", "A homework reminder", "A known teacher message in a school app"],
                explanation: "Scammers rush you so you don't think.",
              },
              {
                id: "q2",
                question: "A message says: 'Your account will be deleted in 10 minutes.' What is this trying to do?",
                correct: "Create fear so you click",
                wrongs: ["Help you learn", "Improve your internet speed", "Teach keyboard shortcuts"],
                explanation: "Urgency is used to trick you.",
              },
              {
                id: "q3",
                question: "Which request is suspicious?",
                correct: "Send your password to confirm your account",
                wrongs: ["Reset your password through the official site", "Enable 2FA", "Ask a parent for help"],
                explanation: "No real service should ask you to send your password.",
              },
              {
                id: "q4",
                question: "If a message includes many spelling mistakes and weird links, you should:",
                correct: "Treat it as suspicious",
                wrongs: ["Trust it more", "Share it with friends", "Reply with personal details"],
                explanation: "Poor spelling and strange links are common scam signs.",
              },
              {
                id: "q5",
                question: "What is a safer next step when you get an unexpected security email?",
                correct: "Open the real site directly and check your account",
                wrongs: ["Click the email link immediately", "Reply with your password", "Forward it to strangers"],
                explanation: "Verify using trusted paths, not unknown links.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q9",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            }
          ],
          },
                    {
            id: "links",
            title: "Suspicious Links",
            notes: "Hover and check domains. Don't click unknown or shortened links. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [

              {
                id: "q1",
                question: "Why are shortened links risky?",
                correct: "They hide the real destination",
                wrongs: ["They make Wi‑Fi faster", "They remove viruses", "They prove a link is safe"],
                explanation: "You can't easily see where they go.",
              },
              {
                id: "q2",
                question: "A safer way to open a site is to:",
                correct: "Type the address yourself or use a bookmark",
                wrongs: ["Click unknown DMs", "Click pop-ups", "Download random files"],
                explanation: "Typing/bookmarks reduce phishing risk.",
              },
              {
                id: "q3",
                question: "Which is a suspicious sign in a link?",
                correct: "A domain that looks slightly misspelled",
                wrongs: ["A familiar domain", "HTTPS on the correct domain", "A link from a known official app"],
                explanation: "Look-alike domains are common in phishing.",
              },
              {
                id: "q4",
                question: "If you accidentally clicked a suspicious link, what should you do?",
                correct: "Close it and tell a trusted adult",
                wrongs: ["Enter your password to check", "Keep clicking until it loads", "Share it in a group chat"],
                explanation: "Stop quickly and get help.",
              },
              {
                id: "q5",
                question: "What should you do with unexpected file downloads from a link?",
                correct: "Do not open them; ask for help",
                wrongs: ["Open immediately", "Send to friends", "Rename and open"],
                explanation: "Unexpected downloads can be harmful.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
                    {
            id: "spoofing",
            title: "Sender Spoofing",
            notes: "Names can be faked. Check the email address and context. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [

              {
                id: "q1",
                question: "Sender spoofing means:",
                correct: "A scammer pretends to be someone else",
                wrongs: ["A phone charges faster", "A password gets stronger", "A device update installs"],
                explanation: "Scammers impersonate trusted people or companies.",
              },
              {
                id: "q2",
                question: "The display name says 'Support Team' but the email looks strange. What should you do?",
                correct: "Do not trust it and verify another way",
                wrongs: ["Send your password", "Click all links", "Reply with private info"],
                explanation: "Verify using official channels.",
              },
              {
                id: "q3",
                question: "Which is a safer verification step?",
                correct: "Contact the company via its official website",
                wrongs: ["Reply to the suspicious email", "Call a number in the email", "Click a link to 'confirm'"],
                explanation: "Use known, official contact routes.",
              },
              {
                id: "q4",
                question: "A scam message often tries to get you to:",
                correct: "Share a password or click a link",
                wrongs: ["Drink water", "Study for a test", "Play outside"],
                explanation: "Phishing aims to steal credentials or data.",
              },
              {
                id: "q5",
                question: "If you are unsure whether a message is real, you should:",
                correct: "Ask a trusted adult and pause",
                wrongs: ["Act quickly", "Share it widely", "Send private information"],
                explanation: "Pausing reduces mistakes and adults can help.",
              },
{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q7",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q8",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            }
          ],
          },
        ],
      },
      {
        id: "social-engineering",
        title: "Social Engineering",
        description: "Understand how scammers manipulate emotions to get info.",
        icon: "🕵️",
        lessons: [
                    {
            id: "urgency",
            title: "Urgency & Pressure",
            notes: "Scammers rush you so you skip checking details. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [

              {
                id: "q1",
                question: "Why do scammers use urgency?",
                correct: "So you act without thinking",
                wrongs: ["So you learn faster", "So you sleep better", "So devices charge faster"],
                explanation: "Pressure reduces careful checking.",
              },
              {
                id: "q2",
                question: "Which message uses urgency?",
                correct: "Reply in 5 minutes or lose your account!",
                wrongs: ["Take your time to review settings", "Let's study tomorrow", "See you at practice"],
                explanation: "Short deadlines are a common trick.",
              },
              {
                id: "q3",
                question: "The safest response to urgent messages is to:",
                correct: "Pause, verify, and ask for help",
                wrongs: ["Click immediately", "Share passwords", "Send money"],
                explanation: "Verification prevents scams.",
              },
              {
                id: "q4",
                question: "A good habit is to:",
                correct: "Use official apps/sites instead of links in messages",
                wrongs: ["Use any link", "Trust unknown senders", "Turn off security settings"],
                explanation: "Official paths reduce phishing.",
              },
              {
                id: "q5",
                question: "If you feel pressured, it is a sign to:",
                correct: "Slow down",
                wrongs: ["Speed up", "Share more info", "Ignore all warnings"],
                explanation: "Pressure is a red flag.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q11",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q12",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
                    {
            id: "too-good",
            title: "Too Good to Be True",
            notes: "Free prizes and unbelievable offers are common scam traps. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "A message says you won a prize you never entered. This is likely:",
                correct: "A scam",
                wrongs: ["A guaranteed gift", "A teacher assignment", "A system update"],
                explanation: "Unexpected prizes are classic scams.",
              },
              {
                id: "q2",
                question: "What is a common scam request?",
                correct: "Pay a fee to get the prize",
                wrongs: ["Read a book", "Drink water", "Do homework"],
                explanation: "Scammers often demand money or data.",
              },
              {
                id: "q3",
                question: "Which is the safest choice with prize messages?",
                correct: "Ignore and report if possible",
                wrongs: ["Click the link", "Send personal info", "Share it widely"],
                explanation: "Don't engage with scams.",
              },
              {
                id: "q4",
                question: "Why do scammers offer 'free' items?",
                correct: "To trick you into giving info or clicking links",
                wrongs: ["To help your grades", "To increase your battery", "To make your phone waterproof"],
                explanation: "They want your data, money, or access.",
              },
              {
                id: "q5",
                question: "If you are unsure, a good step is to:",
                correct: "Ask a trusted adult",
                wrongs: ["Act alone quickly", "Share your password", "Meet the sender"],
                explanation: "Adults can help verify offers safely.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            }
          ],
          },
                    {
            id: "verify",
            title: "Verify Out of Band",
            notes: "Verify using another method, not the same message thread. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [

              {
                id: "q1",
                question: "What does 'verify out of band' mean?",
                correct: "Check using a different trusted method",
                wrongs: ["Reply to the same message", "Share your password", "Click the suspicious link twice"],
                explanation: "Use another method like calling a known number or checking official sites.",
              },
              {
                id: "q2",
                question: "A friend texts asking for money. A safe check is to:",
                correct: "Call them using a saved number or ask in person",
                wrongs: ["Send money immediately", "Share your password", "Forward the text to strangers"],
                explanation: "Accounts can be hacked; verify in another way.",
              },
              {
                id: "q3",
                question: "Why is verifying in the same chat risky?",
                correct: "The scammer may control that channel",
                wrongs: ["It is always safer", "It deletes viruses", "It makes passwords longer"],
                explanation: "If the account is compromised, the scammer answers too.",
              },
              {
                id: "q4",
                question: "A safe source to verify a company message is:",
                correct: "The company website you type yourself",
                wrongs: ["A link in the message", "A random number in the email", "A pop-up ad"],
                explanation: "Type the address or use trusted bookmarks.",
              },
              {
                id: "q5",
                question: "When you verify something, you should be looking for:",
                correct: "Consistency with official information",
                wrongs: ["The fastest possible click", "A promise of prizes", "More urgent pressure"],
                explanation: "Real messages match official info and don't pressure you to hurry.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q11",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q12",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
        ],
      },
      {
        id: "report-recover",
        title: "Report & Recover",
        description: "Know what to do after a mistake and how to report safely.",
        icon: "🛟",
        lessons: [
                    {
            id: "clicked",
            title: "If You Clicked",
            notes: "Mistakes happen. Stop, tell an adult, and secure your accounts. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "If you clicked a phishing link, what should you do first?",
                correct: "Stop and tell a trusted adult",
                wrongs: ["Keep clicking", "Share your password", "Delete everything without telling anyone"],
                explanation: "Adults can help you take the right steps.",
              },
              {
                id: "q2",
                question: "If you typed your password on a suspicious page, you should:",
                correct: "Change your password immediately",
                wrongs: ["Reuse it", "Post it to warn people", "Ignore it"],
                explanation: "Change it fast to lock attackers out.",
              },
              {
                id: "q3",
                question: "A good extra protection after changing a password is:",
                correct: "Enable 2FA",
                wrongs: ["Turn off security settings", "Share your new password", "Use a shorter password"],
                explanation: "2FA adds a second barrier.",
              },
              {
                id: "q4",
                question: "Why is it important to act quickly after a mistake?",
                correct: "It reduces the chance of account takeover",
                wrongs: ["It makes your phone faster", "It guarantees free prizes", "It deletes all messages"],
                explanation: "Quick actions can prevent damage.",
              },
              {
                id: "q5",
                question: "Who can help you recover and report safely?",
                correct: "A trusted adult",
                wrongs: ["A stranger", "The scammer", "Anyone who asks for a fee"],
                explanation: "Recovery should be done with trusted help.",
              },
{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats."
            },
{
              id: "q11",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q12",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            }
          ],
          },
                    {
            id: "report",
            title: "Reporting Scams",
            notes: "Use in-app report tools and tell trusted adults. Do not fight scammers. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "Why should you report scams?",
                correct: "It helps protect other people too",
                wrongs: ["It gives scammers money", "It makes phishing easier", "It deletes your device"],
                explanation: "Reports help platforms take action.",
              },
              {
                id: "q2",
                question: "A safe way to report is:",
                correct: "Use the app's report button",
                wrongs: ["Send your password", "Meet the scammer", "Post personal info publicly"],
                explanation: "Use built-in tools and official channels.",
              },
              {
                id: "q3",
                question: "Should you reply to scammers to 'teach them a lesson'?",
                correct: "No",
                wrongs: ["Yes, always", "Yes, with threats", "Yes, with personal info"],
                explanation: "Engaging can make you a bigger target.",
              },
              {
                id: "q4",
                question: "If you receive scam DMs repeatedly, you should also:",
                correct: "Block the sender",
                wrongs: ["Share your number", "Send money", "Give account access"],
                explanation: "Blocking stops contact.",
              },
              {
                id: "q5",
                question: "If you are unsure whether it is a scam, you should:",
                correct: "Ask a trusted adult to review it",
                wrongs: ["Click anyway", "Send the code they request", "Share it widely"],
                explanation: "Adults can help spot red flags.",
              },
{
              id: "q6",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            }
          ],
          },
                    {
            id: "evidence",
            title: "Saving Evidence Safely",
            notes: "Screenshots and details can help reports, but keep them private. As you navigate the digital world, remember that your actions online have real-world consequences. Develop critical thinking skills to evaluate the information you encounter. Build positive digital habits that will serve you well throughout your life. Engage with technology responsibly and help others do the same.",
            missionBriefing: "Mission: Digital Inspector! Your mission is to analyze the scenarios, apply critical thinking, and make safe choices.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [

              {
                id: "q1",
                question: "What can help when reporting a scam?",
                correct: "A screenshot of the message",
                wrongs: ["Sharing your password", "Sending money", "Deleting everything immediately"],
                explanation: "Evidence helps moderators understand what happened.",
              },
              {
                id: "q2",
                question: "Where is it safest to share evidence?",
                correct: "With a trusted adult or official support",
                wrongs: ["Public social media", "Random group chats", "In the comments section"],
                explanation: "Keep evidence private and share only with trusted channels.",
              },
              {
                id: "q3",
                question: "Should you repost scam messages to warn people?",
                correct: "No, it can spread the scam",
                wrongs: ["Yes, always", "Yes, with your phone number", "Yes, with the link"],
                explanation: "Reposting can help scammers reach more people.",
              },
              {
                id: "q4",
                question: "A safe evidence habit is to:",
                correct: "Record details like the sender name and time",
                wrongs: ["Share your login", "Argue with the scammer", "Send your location"],
                explanation: "Details can support a report.",
              },
              {
                id: "q5",
                question: "After reporting, a good next step is to:",
                correct: "Review account security (passwords, 2FA)",
                wrongs: ["Turn off security", "Share credentials", "Click more links"],
                explanation: "Security review helps prevent future issues.",
              },
{
              id: "q6",
              type: "investigation",
              question: "Order the steps:",
              investigationSteps: [
                "Identify the suspicious message",
                "Do not click any links or download attachments",
                "Report it to a trusted adult or authority",
                "Change passwords if you entered any details",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "Follow these steps in order."
            },
{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime."
            },
{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            },
{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime."
            }
          ],
          },
        ],
      },
    ( {
        id: "unit-4",
        title: "Unit 4",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 1! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q12",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 2! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q11",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q12",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 3! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q10",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q11",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 4! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q9",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q10",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 5! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q9",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          }
        ],
      } ) as UnitDef,
      ( {
        id: "unit-5",
        title: "Unit 5",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 1! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 2! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 3! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 4! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 5! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          }
        ],
      } ) as UnitDef] as UnitDef[],
  },
  {
    id: "b-social-media-safety",
    title: "Social Media & Deepfakes",
    description: "Understand social media risks, deepfakes, and how to verify truth.",
    icon: "📱",
    color: "#8b5cf6",
    ageGroup: "B",
    units: [
      {
        id: "smart-social-media",
        title: "Smart Social Media Use",
        description: "Learn how to use social platforms safely and wisely.",
        icon: "🌐",
        lessons: [
          {
            id: "being-smart-online",
            title: "Being Smart Online",
            notes: "Social media lets people share photos, videos, and thoughts with friends and even the whole world. But not everything you see or read online is true or kind. Some posts are designed to get likes by making people angry or scared. Others might try to sell you something you do not need or trick you into sharing personal information. Being smart online means pausing before you post, questioning what you read, and thinking about who can see your content. It also means understanding that once something is posted, it can be copied, saved, and shared by others even if you delete it later. Your digital footprint - the trail of data you leave behind - can affect your reputation, friendships, and even future opportunities. Learning to manage your online presence thoughtfully is one of the most important skills you can develop for the digital age.",
            missionBriefing: "🎯 Mission: Social Media Detective! Your task is to investigate a social media feed, identify risky posts, and learn how to protect your digital footprint. Stay sharp!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
                id: "q1",
                type: "mcq",
                question: "Why should you pause before posting?",
                correct: "Because posts can be shared and saved by others",
                wrongs: ["Because posts are always private", "Because only your friends see them", "Because it does not matter"],
                explanation: "Once posted, content can spread beyond your control.",
              },
              {
                id: "q2",
                type: "matching",
                question: "Match the social media situation to the smart choice:",
                pairs: [
                  { left: "A friend posts an angry comment", right: "Do not add fuel; report or block if needed" },
                  { left: "An ad says 'You won a free phone!'", right: "It is likely a trick; do not click" },
                  { left: "Someone you do not know asks to follow you", right: "Think carefully before accepting" },
                ],
                explanation: "Smart choices keep you safer online.",
              },
              {
                id: "q3",
                type: "sentence_builder",
                question: "Build the golden rule of social media:",
                sentenceParts: ["Think", "before", "you", "post", "and", "pause", "before", "you", "share"],
                correctSentence: "Think before you post and pause before you share",
                explanation: "This rule protects your digital footprint.",
              },
              {
                id: "q4",
                type: "investigation",
                question: "Order the steps to review a risky post:",
                investigationSteps: [
                  "Read the post carefully",
                  "Check if the source is trustworthy",
                  "Do not share it until you verify",
                  "Report it if it is harmful or fake",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "Verifying before acting stops misinformation.",
              },
              {
                id: "q5",
                type: "mcq",
                question: "What is a digital footprint?",
                correct: "The trail of data you leave online",
                wrongs: ["The shoes you wear online", "A type of social media app", "Your online avatar"],
                explanation: "Your digital footprint follows you everywhere.",
              },
              {
                id: "q6",
                type: "mcq",
                question: "Which post is safest to share?",
                correct: "A photo of your drawing",
                wrongs: ["Your school address and bus route", "A screenshot of someone's private message", "Your home phone number"],
                explanation: "Safe posts do not reveal personal details.",
              },
              {
                id: "q7",
                type: "matching",
                question: "Match the risk to the consequence:",
                pairs: [
                  { left: "Posting your location in real time", right: "Strangers might know where you are" },
                  { left: "Sharing a fake news story", right: "You could mislead friends" },
                  { left: "Giving out your phone number", right: "You could get unwanted messages" },
                ],
                explanation: "Every post has possible consequences.",
              },
              {
                id: "q8",
                type: "investigation",
                question: "Put these privacy habits in order:",
                investigationSteps: [
                  "Check who can see your posts",
                  "Turn on privacy settings",
                  "Think before you tag friends",
                  "Regularly review old posts",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "These habits protect your privacy.",
              },
              {
                id: "q9",
                type: "mcq",
                question: "Why can deleted posts still be a problem?",
                correct: "Others may have saved or screenshotted them",
                wrongs: ["They never really existed", "Deleting always removes everything", "Only adults can see deleted posts"],
                explanation: "Deleted content can still exist elsewhere.",
              },
              {
                id: "q10",
                type: "sentence_builder",
                question: "Build a safe sharing rule:",
                sentenceParts: ["Share", "less", "than", "you", "think", "is", "necessary"],
                correctSentence: "Share less than you think is necessary",
                explanation: "Oversharing is a common online risk.",
              },
              {
                id: "q11",
                type: "matching",
                question: "Match the scenario to the smart action:",
                pairs: [
                  { left: "A brand-new account follows you", right: "Check their profile before following back" },
                  { left: "A quiz asks for your birthday and address", right: "Do not take the quiz" },
                  { left: "A friend tags you in an old embarrassing photo", right: "Ask them to remove the tag" },
                ],
                explanation: "These actions protect your reputation.",
              },
              {
                id: "q12",
                type: "investigation",
                question: "Order the steps if someone pressures you to post something:",
                investigationSteps: [
                  "Say no clearly",
                  "Block or report if they keep pushing",
                  "Tell a trusted adult",
                  "Review your privacy settings together",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "No one should pressure you to post.",
              },
            ],
          },
          {
            id: "privacy-settings-101",
            title: "Privacy Settings 101",
            notes: "Every social media platform and app has privacy settings - controls that let you decide who can see your posts, who can message you, and what information the app collects. Many young users skip these settings because they seem complicated or because they want to get started quickly. But privacy settings are like locks on a door: they keep out people you do not want inside. On most platforms, you can set your account to private so only approved followers can see your posts. You can also turn off location sharing, limit who sees your friends list, and control whether apps can access your camera or microphone. Taking twenty minutes to review these settings with a trusted adult can dramatically reduce your risk. Make it a habit to check settings after any app update, because companies sometimes change what you can control. The more you understand these tools, the more power you have over your own digital experience.",
            missionBriefing: "🔒 Mission: Privacy Fortress Builder! Your challenge is to explore privacy settings, understand what each control does, and build the strongest possible protection for a social media account.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
                id: "q1",
                type: "mcq",
                question: "What does a private account setting do?",
                correct: "Only approved followers can see your posts",
                wrongs: ["Everyone on the internet can see your posts", "No one can message you", "It hides your profile completely"],
                explanation: "Private accounts limit who sees your content.",
              },
              {
                id: "q2",
                type: "sentence_builder",
                question: "Build the privacy principle:",
                sentenceParts: ["You", "control", "who", "sees", "your", "online", "world"],
                correctSentence: "You control who sees your online world",
                explanation: "Privacy settings put you in charge.",
              },
              {
                id: "q3",
                type: "matching",
                question: "Match the setting to what it protects:",
                pairs: [
                  { left: "Who can send you messages", right: "Your inbox privacy" },
                  { left: "Who sees your friends list", right: "Your social connections" },
                  { left: "Location sharing", right: "Your physical safety" },
                ],
                explanation: "Each setting guards a different part of your life.",
              },
              {
                id: "q4",
                type: "investigation",
                question: "Order the steps to secure a new social account:",
                investigationSteps: [
                  "Set the account to private",
                  "Turn off location sharing",
                  "Review who can tag you",
                  "Save the settings and check them monthly",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "Securing an account takes a few important steps.",
              },
              {
                id: "q5",
                type: "mcq",
                question: "Why should you review privacy settings after an app update?",
                correct: "Companies sometimes change what you can control",
                wrongs: ["Updates never affect settings", "Settings are permanent", "Adults handle all updates"],
                explanation: "Updates can reset or change your controls.",
              },
              {
                id: "q6",
                type: "mcq",
                question: "Which setting helps protect your physical location?",
                correct: "Turning off location sharing",
                wrongs: ["Turning on notifications", "Using a funny username", "Posting more photos"],
                explanation: "Location sharing can reveal where you are.",
              },
              {
                id: "q7",
                type: "matching",
                question: "Match the risky default to the safer choice:",
                pairs: [
                  { left: "Default: public profile", right: "Change to private" },
                  { left: "Default: location on", right: "Turn location off" },
                  { left: "Default: everyone can tag you", right: "Limit tags to friends" },
                ],
                explanation: "Defaults are often set for the company, not you.",
              },
              {
                id: "q8",
                type: "investigation",
                question: "Put these privacy review steps in order:",
                investigationSteps: [
                  "Open the app's privacy or security section",
                  "Check each setting one by one",
                  "Ask an adult if you are unsure",
                  "Save changes and set a reminder to review again",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "Regular reviews keep your privacy strong.",
              },
              {
                id: "q9",
                type: "mcq",
                question: "What can happen if your profile is public?",
                correct: "Strangers can see your posts and photos",
                wrongs: ["Only your friends see everything", "The app becomes faster", "You get more followers automatically"],
                explanation: "Public profiles are visible to anyone.",
              },
              {
                id: "q10",
                type: "sentence_builder",
                question: "Build a safe settings rule:",
                sentenceParts: ["Check", "your", "settings", "every", "few", "months"],
                correctSentence: "Check your settings every few months",
                explanation: "Regular checks catch unwanted changes.",
              },
              {
                id: "q11",
                type: "matching",
                question: "Match the control to its purpose:",
                pairs: [
                  { left: "Who can comment on your posts", right: "Prevent unwanted comments" },
                  { left: "Who sees your email address", right: "Stop strangers from contacting you" },
                  { left: "Data sharing with advertisers", right: "Limit what companies collect" },
                ],
                explanation: "These controls protect different parts of you.",
              },
              {
                id: "q12",
                type: "investigation",
                question: "Order the actions if a setting resets after an update:",
                investigationSteps: [
                  "Log in and check the settings right away",
                  "Change anything that reverted to public",
                  "Tell a trusted adult if you see something odd",
                  "Set a reminder to check again in one month",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "Updates can surprise you; stay on top of it.",
              },
            ],
          },
        ],
      },
      {
        id: "deepfakes-truth",
        title: "Deepfakes & Truth",
        description: "Learn about manipulated media and how to spot what is real.",
        icon: "🎭",
        lessons: [
          {
            id: "what-are-deepfakes",
            title: "What Are Deepfakes?",
            notes: "Deepfakes are videos, images, or audio clips that have been changed using artificial intelligence to make it look like someone said or did something they never actually did. The technology is becoming easier to use, which means fake videos of celebrities, politicians, and even regular people are starting to appear online. Some deepfakes are harmless fun - like putting your favorite actor's face on a dancing cat video. But others are created to spread lies, damage reputations, or trick people into believing something false. As a young digital citizen, it is important to know that seeing is not always believing. A video that looks real might have been edited. Learning to question what you see, check multiple sources, and ask a trusted adult when something seems strange are all critical skills. Media literacy - the ability to analyze and evaluate media messages - is your best defense against deepfakes and other forms of misinformation.",
            missionBriefing: "🎭 Mission: Truth Verifier! Deepfake technology is making it harder to tell real from fake. Your mission is to learn the clues that reveal manipulated media and become a master truth verifier.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
                id: "q1",
                type: "mcq",
                question: "What is a deepfake and why is it dangerous in cybercrime?",
                correct: "Media altered by AI to look real",
                wrongs: ["A type of filter in photo apps", "A cartoon about deep oceans", "A video game character"],
                explanation: "Deepfakes use AI to manipulate real media.",
              },
              {
                id: "q2",
                type: "matching",
                question: "Match the deepfake type to its description:",
                pairs: [
                  { left: "Face-swapped video", right: "Someone's face is put on another person's body" },
                  { left: "Cloned voice audio", right: "AI copies someone's voice to say fake words" },
                  { left: "Fake celebrity endorsement", right: "A celebrity appears to support something they never did" },
                ],
                explanation: "Deepfakes come in several formats.",
              },
              {
                id: "q3",
                type: "sentence_builder",
                question: "Build the deepfake rule:",
                sentenceParts: ["Seeing", "is", "not", "always", "believing", "online"],
                correctSentence: "Seeing is not always believing online",
                explanation: "Always question what you see.",
              },
              {
                id: "q4",
                type: "investigation",
                question: "Order the steps to verify a suspicious video:",
                investigationSteps: [
                  "Pause and do not share it immediately",
                  "Check if other trusted sources report the same thing",
                  "Look for signs of editing (weird faces, voices)",
                  "Ask a trusted adult or teacher",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "Verification stops the spread of fakes.",
              },
              {
                id: "q5",
                type: "mcq",
                question: "Why are deepfakes dangerous?",
                correct: "They can spread false information",
                wrongs: ["They are always funny", "They make videos shorter", "They improve video quality"],
                explanation: "Deepfakes can make people believe lies.",
              },
              {
                id: "q6",
                type: "mcq",
                question: "What should you do if you see a video that looks strange or shocking?",
                correct: "Do not share it; ask an adult to check",
                wrongs: ["Share it quickly to warn others", "Comment that it is fake without checking", "Save it to show all your friends"],
                explanation: "Sharing unverified content spreads misinformation.",
              },
              {
                id: "q7",
                type: "matching",
                question: "Match the deepfake clue to what it reveals:",
                pairs: [
                  { left: "Face looks slightly wobbly or blurry", right: "Possible video manipulation" },
                  { left: "Voice sounds robotic or monotone", right: "Possible cloned audio" },
                  { left: "The person says something out of character", right: "Context may be fake" },
                ],
                explanation: "These clues can help spot manipulation.",
              },
              {
                id: "q8",
                type: "investigation",
                question: "Put these media literacy habits in order:",
                investigationSteps: [
                  "Always check the source of a post",
                  "Compare with at least two other sources",
                  "Ask: does this seem too strange to be true?",
                  "Ask an adult if you are still unsure",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "These habits build strong truth-checking skills.",
              },
              {
                id: "q9",
                type: "mcq",
                question: "What is media literacy?",
                correct: "The ability to analyze and evaluate media messages",
                wrongs: ["Knowing how to make videos", "Being able to edit photos", "Watching a lot of TV"],
                explanation: "Media literacy helps you judge what you see.",
              },
              {
                id: "q10",
                type: "sentence_builder",
                question: "Build the verification rule:",
                sentenceParts: ["Always", "check", "multiple", "sources", "before", "believing"],
                correctSentence: "Always check multiple sources before believing",
                explanation: "Multiple sources help confirm truth.",
              },
              {
                id: "q11",
                type: "matching",
                question: "Match the action to the situation:",
                pairs: [
                  { left: "A celebrity endorses a random product", right: "Check the celebrity's real account for confirmation" },
                  { left: "A video shows something shocking", right: "Search for news reports from real outlets" },
                  { left: "An audio clip seems out of context", right: "Listen for odd pauses or tone changes" },
                ],
                explanation: "These steps help you spot deepfakes.",
              },
              {
                id: "q12",
                type: "investigation",
                question: "Order the response if someone sends you a deepfake:",
                investigationSteps: [
                  "Do not forward the deepfake",
                  "Tell a trusted adult what you received",
                  "Block the sender if it was a message",
                  "Help others by sharing how to spot fakes",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "Stopping the spread and helping others is key.",
              },
            ],
          },
          {
            id: "checking-whats-real",
            title: "Checking What's Real",
            notes: "In a world where anyone can create and share content, the ability to fact-check and verify information is a superpower. Fact-checking means looking for evidence that something is true, rather than just accepting it because it looks convincing or comes from someone you know. Start by checking the source: who created the content, and do they have a history of being accurate? Next, look for corroboration: do other reliable sources report the same facts? Be especially careful with content that triggers strong emotions like fear, anger, or excitement - these feelings can make you less critical and more likely to share without thinking. Reverse image search tools can help you see if a photo has been used before in a different context. And when in doubt, ask a trusted adult or a teacher. They can model good research habits and help you find trustworthy information. Practicing these skills now will make you a more informed citizen and a smarter consumer of information throughout your life.",
            missionBriefing: "🔍 Mission: Fact-Checking Ninja! Your mission is to learn the step-by-step process of fact-checking any claim you see online. By the end, you will be able to separate fact from fiction like a pro.",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 5,
            questions: [
              {
                id: "q1",
                type: "mcq",
                question: "What is the Identify the suspicious message in fact-checking?",
                correct: "Check who created the content",
                wrongs: ["Share it to ask others", "Ignore the source", "Look at the pictures only"],
                explanation: "The source tells you a lot about reliability.",
              },
              {
                id: "q2",
                type: "sentence_builder",
                question: "Build the fact-checking rule:",
                sentenceParts: ["Verify", "before", "you", "trust", "and", "check", "before", "you", "share"],
                correctSentence: "Verify before you trust and check before you share",
                explanation: "Verification prevents spreading false info.",
              },
              {
                id: "q3",
                type: "matching",
                question: "Match the verification tool to its use:",
                pairs: [
                  { left: "Reverse image search", right: "See if a photo was used elsewhere" },
                  { left: "Cross-referencing sources", right: "Confirm facts with multiple outlets" },
                  { left: "Checking the date", right: "Make sure the info is current" },
                ],
                explanation: "Different tools catch different problems.",
              },
              {
                id: "q4",
                type: "investigation",
                question: "Order the fact-checking steps:",
                investigationSteps: [
                  "Identify the original source",
                  "Check if other reliable sources confirm it",
                  "Look for evidence and data",
                  "Decide if the claim is likely true, false, or unproven",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "A systematic approach prevents mistakes.",
              },
              {
                id: "q5",
                type: "mcq",
                question: "Why should you be careful with content that triggers strong emotions?",
                correct: "Emotions can make you less critical",
                wrongs: ["Emotions always help you think", "Scary content is always true", "Angry posts are always correct"],
                explanation: "Strong emotions are a common manipulation tactic.",
              },
              {
                id: "q6",
                type: "mcq",
                question: "What does corroboration mean?",
                correct: "Confirming a fact with multiple sources",
                wrongs: ["Deleting old posts", "Sharing with friends", "Ignoring the truth"],
                explanation: "Corroboration strengthens your confidence in a claim.",
              },
              {
                id: "q7",
                type: "matching",
                question: "Match the red flag to the fact-checking action:",
                pairs: [
                  { left: "No author or source listed", right: "Treat the claim with skepticism" },
                  { left: "The claim seems too extreme to be true", right: "Search for reputable fact-checkers" },
                  { left: "The image looks manipulated", right: "Run a reverse image search" },
                ],
                explanation: "Red flags trigger deeper investigation.",
              },
              {
                id: "q8",
                type: "investigation",
                question: "Put these verification steps in order:",
                investigationSteps: [
                  "Pause before sharing anything shocking",
                  "Find the original source of the claim",
                  "Search for fact-checks from reputable organizations",
                  "Decide whether to share, correct, or drop the claim",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "Following a process keeps you from rushing to judgment.",
              },
              {
                id: "q9",
                type: "mcq",
                question: "Which source is most reliable for fact-checking?",
                correct: "Reputable fact-checking organizations",
                wrongs: ["Random social media comments", "Anonymous forum posts", "Your friend's cousin"],
                explanation: "Reputable organizations follow strict verification methods.",
              },
              {
                id: "q10",
                type: "sentence_builder",
                question: "Build the critical thinking rule:",
                sentenceParts: ["Question", "what", "you", "see", "and", "verify", "before", "you", "share"],
                correctSentence: "Question what you see and verify before you share",
                explanation: "Critical thinking stops the spread of misinformation.",
              },
              {
                id: "q11",
                type: "matching",
                question: "Match the tool to the problem it solves:",
                pairs: [
                  { left: "A photo that might be old", right: "Check the date and context" },
                  { left: "A quote that sounds fake", right: "Find the original speech or interview" },
                  { left: "A viral claim with no evidence", right: "Look for data or expert confirmation" },
                ],
                explanation: "Each tool addresses a different type of doubt.",
              },
              {
                id: "q12",
                type: "investigation",
                question: "Order the steps if you discover you shared something false:",
                investigationSteps: [
                  "Admit the mistake to yourself",
                  "Correct the record if you can",
                  "Tell the people you shared it with",
                  "Learn the fact-checking steps to use next time",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "Correcting mistakes builds trust and learning.",
              },
            ],
          },
        ],
      },
    ( {
        id: "unit-3",
        title: "Unit 3",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 1! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 2! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 3! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 4! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 5! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          }
        ],
      } ) as UnitDef,
      ( {
        id: "unit-4",
        title: "Unit 4",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 1! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q12",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 2! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q10",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q11",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q12",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 3! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q9",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q10",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q11",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 4! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q9",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q10",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 5! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q9",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          }
        ],
      } ) as UnitDef,
      ( {
        id: "unit-5",
        title: "Unit 5",
        description: "Learn more about this important topic.",
        icon: "📚",
        lessons: [
          {
            id: "l1",
            title: "Lesson 1: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 1! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 2! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 3! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q12",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 4! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q11",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson covers advanced digital citizenship topics for older learners. You will explore real-world scenarios, analyze online behavior, and develop critical thinking skills. Discuss these concepts with a trusted adult or teacher to deepen your understanding.",
            missionBriefing: "🎯 Mission: Digital Investigator 5! Your task is to investigate this topic, analyze scenarios, and make smart decisions. Stay critical and think deeply!",
            voiceOver: "Listen to this lesson carefully and learn how to stay safe from cybercrime.",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q3",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q4",
              type: "investigation",
              question: "Put these steps in the correct order:",
              investigationSteps: [
                "Identify the suspicious message to take",
                "Do not click any links or download attachments to take",
                "Report it to a trusted adult or authority to take",
                "Change passwords if you entered any details to take",
              ],
              correctOrder: [0, 1, 2, 3],
              explanation: "These steps help you respond safely to a cyber incident.",
            },{
              id: "q5",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q6",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q7",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q8",
              type: "mcq",
              question: "What is the safest action in this cybercrime scenario?",
              correct: "Report it to a trusted adult",
              wrongs: ["Ignore the message", "Reply with personal details", "Share it with strangers"],
              explanation: "This choice helps prevent cybercrime.",
            },{
              id: "q9",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q10",
              type: "matching",
              question: "Match the cybercrime term to its definition:",
              pairs: [
                { left: "Phishing", right: "Fake messages that steal information" },
                { left: "Malware", right: "Software that harms your device" },
                 { left: "Social Engineering", right: "Tricking people into giving up data" },
                 { left: "Virus", right: "A type of harmful software" },
              ],
              explanation: "Knowing these terms helps you spot cybercrime.",
            },{
              id: "q11",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            },{
              id: "q12",
              type: "sentence_builder",
              question: "Build the safety rule:",
              sentence: "Stop ___ think ___ verify ___ before ___ you ___ click",
              missingWords: ["think", "verify", "before", "you", "click"],
              correctSentence: "Stop think verify before you click",
              explanation: "Following this rule keeps you safer from online threats.",
            }
            ],
          }
        ],
      } ) as UnitDef] as UnitDef[],
  }as SectionDef
];

export const CURRICULUM: CurriculumData = {
  sections: SECTION_DEFS.map((sd, sectionOrder) => buildSection(sd, sectionOrder)),
};
