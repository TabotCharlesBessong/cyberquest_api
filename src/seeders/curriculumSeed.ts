export interface CurriculumQuestion {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  xpReward: number;
}

export interface CurriculumLesson {
  id: string;
  unitId: string;
  title: string;
  notes: string;
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

function q(
  lessonId: string,
  id: string,
  question: string,
  correct: string,
  wrongs: string[],
  explanation: string,
  difficulty: 1 | 2 | 3 | 4 | 5 = 1,
  xpReward: number = 10
): CurriculumQuestion {
  const options = shuffle([correct, ...wrongs], `${lessonId}-${id}`);
  const correctIndex = options.indexOf(correct);
  return {
    id: `${lessonId}-${id}`,
    lessonId,
    question,
    options,
    correctIndex,
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
  questions: CurriculumQuestion[]
): CurriculumLesson {
  return { id: `${unitId}-${id}`, unitId, title, notes, order, ageGroup, difficulty, questions };
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

type QuestionDef = {
  id: string;
  question: string;
  correct: string;
  wrongs: string[];
  explanation: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  xpReward?: number;
};

type LessonDef = {
  id: string;
  title: string;
  notes: string;
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
  const questions = def.questions.map((qd) =>
    q(
      lessonId,
      qd.id,
      qd.question,
      qd.correct,
      qd.wrongs,
      qd.explanation,
      qd.difficulty ?? def.difficulty,
      qd.xpReward ?? 10
    )
  );
  return lesson(unitId, def.id, def.title, def.notes, order, ageGroup, def.difficulty, questions);
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
            notes: "Personal info can identify you in real life. Keep it private online.",
            difficulty: 1,
            questions: [
              {
                id: "q1",
                question: "Which of these is personal information?",
                correct: "Your home address",
                wrongs: ["Your favorite color", "Your favorite animal", "Your favorite game"],
                explanation: "An address can be used to find you in real life.",
              },
              {
                id: "q2",
                question: "Which is safest to share online with a class friend?",
                correct: "Your favorite cartoon",
                wrongs: ["Your phone number", "Your full name and school", "Where you will be after school"],
                explanation: "Favorites are usually safe, but contact details and locations are not.",
              },
              {
                id: "q3",
                question: "What does a password help protect?",
                correct: "Your account so others cannot log in",
                wrongs: ["Your shoes", "Your lunch", "Your homework folder"],
                explanation: "A password keeps other people out of your account.",
              },
              {
                id: "q4",
                question: "Which information should you keep private online?",
                correct: "Your parent's phone number",
                wrongs: ["A funny joke", "Your favorite sport", "A drawing you made"],
                explanation: "Phone numbers are personal information.",
              },
              {
                id: "q5",
                question: "If a game asks for your real name and address, what should you do first?",
                correct: "Ask a trusted adult",
                wrongs: ["Type it quickly", "Share a friend's address instead", "Ignore the question and click random buttons"],
                explanation: "A trusted adult can help you decide what is safe.",
              },
            ],
          },
          {
            id: "safe-to-share",
            title: "Safe vs Not Safe to Share",
            notes: "Share fun things, not details that can identify you or your family.",
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
            ],
          },
          {
            id: "trusted-adult",
            title: "Trusted Adults",
            notes: "Trusted adults can help when something online feels wrong or confusing.",
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
            notes: "A lock code helps protect your apps and messages.",
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
            ],
          },
          {
            id: "updates",
            title: "Updates Help",
            notes: "Updates can fix problems and make apps safer.",
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
            ],
          },
          {
            id: "permissions",
            title: "App Permissions",
            notes: "Apps sometimes ask to use your camera, mic, or location.",
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
            notes: "Use kid-safe search tools and ask for help if results look scary.",
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
            ],
          },
          {
            id: "popups",
            title: "Pop-ups and Ads",
            notes: "Pop-ups can trick you. Avoid clicking and ask for help.",
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
            ],
          },
          {
            id: "strangers",
            title: "Strangers Online",
            notes: "Not everyone online is who they say they are. Keep boundaries.",
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
            ],
          },
        ],
      },
    ],
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
            notes: "Messages can be misunderstood. Choose kind words.",
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
            ],
          },
          {
            id: "cyberbullying",
            title: "What Is Cyberbullying?",
            notes: "Cyberbullying is using devices to be mean or hurtful again and again.",
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
            ],
          },
          {
            id: "bystander",
            title: "Helping as a Bystander",
            notes: "If you see bullying, you can help safely by reporting and supporting.",
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
            notes: "Even if you delete something, others may have saved it.",
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
            ],
          },
          {
            id: "think-before-share",
            title: "Think Before Sharing",
            notes: "Share with care. Private info and hurtful content can cause problems.",
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
            ],
          },
          {
            id: "privacy-settings",
            title: "Privacy Settings Basics",
            notes: "Privacy settings help control who can see your posts and messages.",
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
            notes: "Follow rules: be kind, don't spam, and don't share private info.",
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
            ],
          },
          {
            id: "screenshots",
            title: "Screenshots and Respect",
            notes: "Screenshots can spread messages. Ask before sharing.",
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
            ],
          },
          {
            id: "report-block",
            title: "Report and Block",
            notes: "Use tools to stop bad behavior: block, report, and tell adults.",
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
            ],
          },
        ],
      },
    ],
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
            notes: "Long passphrases are easier to remember and harder to guess.",
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
            ],
          },
          {
            id: "reuse",
            title: "Password Reuse",
            notes: "Reusing passwords is risky because one leak can unlock many accounts.",
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
            ],
          },
          {
            id: "two-factor",
            title: "Two-Factor Authentication (2FA)",
            notes: "2FA adds a second step (like a code) to protect your account.",
            difficulty: 2,
            questions: [
              {
                id: "q1",
                question: "Two-factor authentication adds:",
                correct: "A second step to log in",
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
            notes: "PII is information that can identify a person. Some data is extra sensitive.",
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
            ],
          },
          {
            id: "location",
            title: "Location Sharing",
            notes: "Location can be shared by apps, photos, and posts. Control it.",
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
            ],
          },
          {
            id: "breach",
            title: "If Data Leaks",
            notes: "If a site is hacked, change passwords and review account security.",
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
                question: "If your password may be leaked, what is a good first step?",
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
            notes: "Use strong passwords, 2FA, and updated devices.",
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
            ],
          },
          {
            id: "fake-login",
            title: "Fake Login Pages",
            notes: "Scammers create fake pages to steal passwords. Check the URL and source.",
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
            ],
          },
          {
            id: "shared-devices",
            title: "Shared Devices",
            notes: "Be careful when using shared devices: log out and don't save passwords.",
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
            ],
          },
        ],
      },
    ],
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
            notes: "Watch for urgency, threats, and unexpected requests for info.",
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
            ],
          },
          {
            id: "links",
            title: "Suspicious Links",
            notes: "Hover and check domains. Don't click unknown or shortened links.",
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
            ],
          },
          {
            id: "spoofing",
            title: "Sender Spoofing",
            notes: "Names can be faked. Check the email address and context.",
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
            notes: "Scammers rush you so you skip checking details.",
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
            ],
          },
          {
            id: "too-good",
            title: "Too Good to Be True",
            notes: "Free prizes and unbelievable offers are common scam traps.",
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
            ],
          },
          {
            id: "verify",
            title: "Verify Out of Band",
            notes: "Verify using another method, not the same message thread.",
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
            notes: "Mistakes happen. Stop, tell an adult, and secure your accounts.",
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
            ],
          },
          {
            id: "report",
            title: "Reporting Scams",
            notes: "Use in-app report tools and tell trusted adults. Do not fight scammers.",
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
            ],
          },
          {
            id: "evidence",
            title: "Saving Evidence Safely",
            notes: "Screenshots and details can help reports, but keep them private.",
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
            ],
          },
        ],
      },
    ],
  },
];

export const CURRICULUM: CurriculumData = {
  sections: SECTION_DEFS.map((sd, sectionOrder) => buildSection(sd, sectionOrder)),
};
