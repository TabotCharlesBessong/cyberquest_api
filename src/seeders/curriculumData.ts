export interface BranchChoice {
  text: string;
  feedback: string;
  consequence: "positive" | "negative" | "neutral";
  xpDelta?: number;
}

export interface SeedLesson {
  stepId: string;
  type: "story" | "quiz" | "mini-game" | "challenge";
  title: string;
  ageGroup: "A" | "B" | "ALL";
  stepCategory: "intro" | "core" | "review" | "bridge" | "capstone";
  depthLevel: 1 | 2 | 3 | 4 | 5 | 6;
  text?: string;
  question?: string;
  options?: string[];
  answer?: number;
  explanation?: string;
  icon?: string;
  mascot?: string;
  speech?: string;
  conceptKeys?: string[];
  choices?: BranchChoice[];
  learningObjectives?: string[];
  successCriteria?: string[];
  connexusStandards?: string[];
  activityType?: string;
  materials?: string[];
}

export interface SeedLecture {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  badge: string;
  badgeName: string;
  order: number;
  lessons: SeedLesson[];
}

export const SEED_LECTURES: SeedLecture[] = [
  // ─────────────────────────────────────────────────────────
  // MODULE 1 — CyberSafe World
  // ─────────────────────────────────────────────────────────
  {
    slug: "cybersafe-world",
    title: "CyberSafe World",
    subtitle: "Your adventure begins",
    icon: "🌍",
    color: "#4D96FF",
    badge: "🗺️",
    badgeName: "Explorer",
    order: 1,
    lessons: [
      // ── GROUP A (ages 6-8) ──
      {
        stepId: "a-module-intro-1",
        type: "story",
        title: "Your adventure begins",
        ageGroup: "A",
        stepCategory: "intro",
        depthLevel: 1,
        text: "Welcome to CyberSafe World! Imagine the internet is a huge playground. There are fun games, friendly faces, and hidden dangers. Captain Cyber will be your guide. Together we will learn how to explore safely and protect ourselves. Are you ready?",
        icon: "🌍",
        mascot: "🦸",
        speech: "Every great explorer needs a map. This is yours — let's begin!",
        conceptKeys: ["internet_awareness", "module_intro"],
        learningObjectives: ["Understand the internet as a world with safe and unsafe areas","Understand the module theme and goals"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-meet-captain",
        type: "story",
        title: "Meet Captain Cyber",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 1,
        text: "Captain Cyber knows the internet like a treasure map. He knows where the fun places are and where the tricky spots hide. He is here to show you the safe paths.",
        icon: "🦸",
        mascot: "🦸",
        speech: "Hi! I'm Captain Cyber. I will teach you to be an internet explorer.",
        conceptKeys: ["internet_awareness"],
        learningObjectives: ["Understand the internet as a world with safe and unsafe areas"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-what-is-personal-info",
        type: "story",
        title: "What is personal info?",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 2,
        text: "Your name, address, school, and phone number are private. They are like treasure — only share them with people you and your family trust. A stranger online does not need to know them.",
        icon: "🔒",
        mascot: "🦸",
        speech: "Your private info is treasure. Keep it safe!",
        conceptKeys: ["pii_basics"],
        learningObjectives: ["Identify personally identifiable information"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a","ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-safe-or-not-safe",
        type: "quiz",
        title: "Safe or not safe?",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        question: "You are playing a game and a new player asks 'What is your full name and school?' What do you do?",
        options: [
          "Tell them — they seem friendly",
          "Do not tell them; tell a grown-up",
          "Only tell them your first name"
        ],
        answer: 1,
        explanation: "A new player should never get your full name and school. That is personal information. Tell a trusted adult instead.",
        icon: "🛡️",
        conceptKeys: ["pii_basics", "stranger_online"],
        learningObjectives: ["Identify personally identifiable information","Recognise risks from unknown people online"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a","ISTE 1.3.d"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-magic-door-rule",
        type: "story",
        title: "The magic door rule",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 2,
        text: "If a stranger online asks for your private information, imagine they are at your front door. What would you do? Close the door and tell a grown-up! The same rule applies online.",
        icon: "🚪",
        mascot: "🦸",
        speech: "When in doubt, close the door and find an adult.",
        conceptKeys: ["stranger_online", "tell_adult"],
        learningObjectives: ["Recognise risks from unknown people online","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-who-to-tell",
        type: "quiz",
        title: "Who should you tell?",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        question: "A stranger online keeps asking for your address. Who is the right person to tell?",
        options: ["A stranger", "Your teacher or parent", "No one — it is not a big deal"],
        answer: 1,
        explanation: "Always tell a trusted adult. They will help you stay safe.",
        icon: "👨‍👩‍👧",
        conceptKeys: ["tell_adult", "stranger_online"],
        learningObjectives: ["Know when and how to ask a trusted adult for help","Recognise risks from unknown people online"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-module1-review",
        type: "quiz",
        title: "Module 1 review",
        ageGroup: "A",
        stepCategory: "review",
        depthLevel: 3,
        question: "Which of these is the safest thing to do when someone online asks for your school name?",
        options: [
          "Tell them and ask what they want",
          "Do not tell them and tell a grown-up",
          "Tell a friend instead"
        ],
        answer: 1,
        explanation: "Keeping your school name private and telling an adult is always the safest choice.",
        icon: "📝",
        conceptKeys: ["pii_basics", "stranger_online", "tell_adult"],
        learningObjectives: ["Identify personally identifiable information","Recognise risks from unknown people online","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-module1-bridge",
        type: "story",
        title: "Your real-world mission",
        ageGroup: "A",
        stepCategory: "bridge",
        depthLevel: 4,
        text: "In the next 24 hours, find one real example of something you should keep private (like a school name or address). Tell a grown-up about it. If they confirm you did, Captain Cyber will reward you with extra gems!",
        icon: "🌍",
        mascot: "🦸",
        speech: "Learning does not stop at the screen. Real safety starts in real life.",
        conceptKeys: ["pii_basics", "tell_adult", "real_world_bridge"],
        learningObjectives: ["Identify personally identifiable information","Know when and how to ask a trusted adult for help","Connect online learning to offline habits"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-module1-capstone",
        type: "quiz",
        title: "Explorer quiz",
        ageGroup: "A",
        stepCategory: "capstone",
        depthLevel: 4,
        question: "A message from a stranger says 'I have a gift for you — what is your home address?' What is the best answer?",
        options: [
          "Give the address and wait for the gift",
          "Do not answer and tell a parent",
          "Give only your street name"
        ],
        answer: 1,
        explanation: "Strangers should never get your address. Always tell a parent or guardian.",
        icon: "🏆",
        conceptKeys: ["pii_basics", "stranger_online", "tell_adult"],
        learningObjectives: ["Identify personally identifiable information","Recognise risks from unknown people online","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      // ── GROUP B (ages 8-12) ──
      {
        stepId: "b-module-intro-1",
        type: "story",
        title: "Enter the grid",
        ageGroup: "B",
        stepCategory: "intro",
        depthLevel: 1,
        text: "The internet is not one thing — it is a billion places. Some are bright marketplaces, some are dark alleys. You cannot tell by looking. In this module, you will learn to map the terrain, read the signs, and move with confidence.",
        icon: "🌍",
        mascot: "🦸",
        speech: "A explorer who knows the terrain never gets lost. Let's draw your map.",
        conceptKeys: ["internet_awareness", "digital_footprint", "module_intro"],
        learningObjectives: ["Understand the internet as a world with safe and unsafe areas","Understand that online actions leave a permanent trail","Understand the module theme and goals"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-digital-footprint-basics",
        type: "quiz",
        title: "Digital footprint basics",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 2,
        question: "You post a photo on a public account. Three weeks later, a stranger screenshots it and uses it in a fake profile. Why does this happen?",
        options: [
          "The app deleted your photo",
          "Once something is online, it can be copied and shared beyond your control",
          "Your phone was hacked"
        ],
        answer: 1,
        explanation: "Your digital footprint is permanent. Assume anything you post can be shared widely.",
        icon: "👣",
        conceptKeys: ["digital_footprint"],
        learningObjectives: ["Understand that online actions leave a permanent trail"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-avatar-creation",
        type: "story",
        title: "Avatar creation",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 1,
        text: "Your online identity is yours to shape. Choose wisely — your avatar represents you in the CyberSafe World and reminds you that your digital self matters.",
        icon: "👤",
        mascot: "🦸",
        speech: "Your avatar is your digital self. Make it yours!",
        conceptKeys: ["online_identity"],
        learningObjectives: ["Understand that your digital self matters"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-pii-classification",
        type: "quiz",
        title: "PII classification",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        question: "You are signing up for a new game. It asks for your full name, birthdate, and home address. Which combination should you give?",
        options: [
          "All of it — the game needs to know",
          "Only what is required; never share address unless a parent approves",
          "Make up a fake name and real address"
        ],
        answer: 1,
        explanation: "Only share required information. Full address should never be shared without parental approval.",
        icon: "🪪",
        conceptKeys: ["pii_basics"],
        learningObjectives: ["Identify personally identifiable information"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-stranger-test",
        type: "story",
        title: "The stranger test",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        text: "Before sharing anything online, ask: 'Would I say this to a stranger in real life?' If the answer is no, do not post it. This simple test stops most oversharing before it happens.",
        icon: "🧪",
        mascot: "🦸",
        speech: "The stranger test is your best filter.",
        conceptKeys: ["stranger_online", "pii_basics"],
        learningObjectives: ["Recognise risks from unknown people online","Identify personally identifiable information"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-social-post-analysis",
        type: "quiz",
        title: "Social post analysis",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 4,
        question: "A classmate posts: 'At home alone tonight — my address is 12 Oak Street. Come over!' What is wrong here, and what should they do?",
        options: [
          "Nothing — it is just a joke",
          "They overshared location and should delete the post + tell an adult",
          "They should just unfriend anyone who comments"
        ],
        answer: 1,
        explanation: "Sharing your address publicly is dangerous. The fix is delete + tell an adult, not just unfriending.",
        icon: "📱",
        conceptKeys: ["digital_footprint", "pii_basics", "tell_adult"],
        learningObjectives: ["Understand that online actions leave a permanent trail","Identify personally identifiable information","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-module1-review",
        type: "quiz",
        title: "Module 1 review",
        ageGroup: "B",
        stepCategory: "review",
        depthLevel: 3,
        question: "Which statement about your digital footprint is true?",
        options: [
          "You can delete anything you post whenever you want",
          "Once something is online, it can live forever even if you delete it",
          "Only adults have a digital footprint"
        ],
        answer: 1,
        explanation: "Digital footprints persist through screenshots, archives, and caches. Think before you post.",
        icon: "📝",
        conceptKeys: ["digital_footprint", "pii_basics", "stranger_online"],
        learningObjectives: ["Understand that online actions leave a permanent trail","Identify personally identifiable information","Recognise risks from unknown people online"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-module1-bridge",
        type: "story",
        title: "Real-world mission",
        ageGroup: "B",
        stepCategory: "bridge",
        depthLevel: 4,
        text: "This week, find one piece of personal information you almost shared online and tell a parent or guardian why you chose not to. If they confirm it, Captain Cyber will reward you with bonus gems. Real safety starts offline.",
        icon: "🌍",
        mascot: "🦸",
        speech: "Bridging online learning to real life is what makes a true Cyber Guardian.",
        conceptKeys: ["digital_footprint", "pii_basics", "real_world_bridge"],
        learningObjectives: ["Understand that online actions leave a permanent trail","Identify personally identifiable information","Connect online learning to offline habits"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-module1-capstone",
        type: "quiz",
        title: "Module challenge",
        ageGroup: "B",
        stepCategory: "capstone",
        depthLevel: 5,
        question: "You want to join a new online club. They ask for your school, age, and a photo. What is the safest approach?",
        options: [
          "Send everything — you trust the club",
          "Share only what is necessary; never send a photo without a parent checking first",
          "Send a fake photo and real school name"
        ],
        answer: 1,
        explanation: "Minimum necessary information plus parental involvement is the safest approach.",
        icon: "🏆",
        conceptKeys: ["digital_footprint", "pii_basics", "stranger_online", "tell_adult"],
        learningObjectives: ["Understand that online actions leave a permanent trail","Identify personally identifiable information","Recognise risks from unknown people online","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 2 — The Bully Blocker
  // ─────────────────────────────────────────────────────────
  {
    slug: "bully-blocker",
    title: "The Bully Blocker",
    subtitle: "Stand up to cyberbullying",
    icon: "🛡️",
    color: "#FF7A59",
    badge: "💪",
    badgeName: "Defender",
    order: 2,
    lessons: [
      // ── GROUP A ──
      {
        stepId: "a-module-intro-2",
        type: "story",
        title: "A mean message",
        ageGroup: "A",
        stepCategory: "intro",
        depthLevel: 1,
        text: "One day, Captain Cyber received a message that made him feel sad. Someone had been unkind online — they did not know Captain Cyber, but they said something hurtful anyway. This is called cyberbullying. In this module, you will learn how to stop it and be a hero.",
        icon: "💬",
        mascot: "🦸",
        speech: "Even heroes need help sometimes. Let's learn how to be a Bully Blocker!",
        conceptKeys: ["cyberbullying_recognition", "module_intro"],
        learningObjectives: ["Identify signs of cyberbullying","Understand the module theme and goals"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-cross-module-review-1",
        type: "quiz",
        title: "Review: CyberSafe World",
        ageGroup: "A",
        stepCategory: "review",
        depthLevel: 2,
        question: "Remember Module 1? If a stranger asks for your address in a game chat, what do you do?",
        options: [
          "Tell them politely",
          "Do not tell them and tell a grown-up",
          "Give a fake address"
        ],
        answer: 1,
        explanation: "The magic door rule still applies. Close the door and find an adult.",
        icon: "🛡️",
        conceptKeys: ["pii_basics", "stranger_online", "tell_adult"],
        learningObjectives: ["Identify personally identifiable information","Recognise risks from unknown people online","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a","ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-what-is-cyberbullying",
        type: "story",
        title: "What is cyberbullying?",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 2,
        text: "Cyberbullying is when someone is mean to another person using phones, games or messages. It can hurt feelings even through a screen. The person being bullied is never at fault.",
        icon: "💬",
        mascot: "🦸",
        speech: "If someone is unkind online, you can block them and tell a grown-up.",
        conceptKeys: ["cyberbullying_recognition"],
        learningObjectives: ["Identify signs of cyberbullying"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-block-and-tell",
        type: "story",
        title: "Block and tell",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        text: "When someone is mean to you online, the first thing to do is block them. Then tell a trusted adult — a parent, teacher, or Captain Cyber! Blocking stops the message. Telling stops the problem.",
        icon: "🚫",
        mascot: "🦸",
        speech: "Block first, tell second. That is the rule!",
        conceptKeys: ["cyberbullying_response"],
        learningObjectives: ["Know the correct response to online bullying"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-bully-quiz-1",
        type: "quiz",
        title: "Someone is being unkind…",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        question: "Your friend shows you a mean message they received. They say 'Let's send it back to them.' What do you do?",
        options: [
          "Help them send it back",
          "Tell them not to; help them block and tell an adult",
          "Laugh and share it with more friends"
        ],
        answer: 1,
        explanation: "Sending it back makes you part of the problem. Blocking and telling is the brave choice.",
        icon: "🚫",
        conceptKeys: ["cyberbullying_response", "bystander_intervention"],
        learningObjectives: ["Know the correct response to online bullying","Understand how to help as a bystander"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.3.d","ISTE 1.2.a"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-be-a-buddy",
        type: "story",
        title: "Be a buddy",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        text: "If you see a friend being bullied online, support them. Tell them to block the bully and then tell an adult together. A true defender does not watch from the sidelines.",
        icon: "🤝",
        mascot: "🦸",
        speech: "A true defender helps their friends.",
        conceptKeys: ["bystander_intervention"],
        learningObjectives: ["Understand how to help as a bystander"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a","ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-what-would-you-do",
        type: "quiz",
        title: "What would you do?",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 4,
        question: "You see a classmate being bullied in a game chat. They have not told anyone. What is the best action?",
        options: [
          "Join the chat and defend them publicly",
          "Tell them privately to block and report, then tell an adult together",
          "Ignore it — it is not your business"
        ],
        answer: 1,
        explanation: "Privately supporting the victim and getting an adult involved is the safest, most effective response.",
        icon: "💪",
        conceptKeys: ["bystander_intervention", "cyberbullying_response"],
        learningObjectives: ["Understand how to help as a bystander","Know the correct response to online bullying"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-module2-review",
        type: "quiz",
        title: "Module 2 review",
        ageGroup: "A",
        stepCategory: "review",
        depthLevel: 3,
        question: "What are the two most important steps when someone is mean to you online?",
        options: [
          "Reply and block",
          "Block and tell a trusted adult",
          "Delete the app and cry"
        ],
        answer: 1,
        explanation: "Block first, tell second. Those two steps keep you safe and stop the bully.",
        icon: "📝",
        conceptKeys: ["cyberbullying_response", "bystander_intervention"],
        learningObjectives: ["Know the correct response to online bullying","Understand how to help as a bystander"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a","ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-module2-bridge",
        type: "story",
        title: "Your real-world mission",
        ageGroup: "A",
        stepCategory: "bridge",
        depthLevel: 4,
        text: "In the next 24 hours, think of someone who might be feeling left out or sad. Ask them to play a game with you. Being kind offline is just as important as being kind online. Tell a grown-up what you did!",
        icon: "🤝",
        mascot: "🦸",
        speech: "Kindness travels between the real world and the digital world.",
        conceptKeys: ["bystander_intervention", "cyberbullying_response", "real_world_bridge"],
        learningObjectives: ["Understand how to help as a bystander","Know the correct response to online bullying","Connect online learning to offline habits"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-module2-capstone",
        type: "quiz",
        title: "Defender quiz",
        ageGroup: "A",
        stepCategory: "capstone",
        depthLevel: 4,
        question: "A friend tells you someone is sending them mean messages. What is the FIRST thing you say?",
        options: [
          "Tell them to be stronger",
          "Show them how to block and offer to tell an adult together",
          "Tell them to send a mean message back"
        ],
        answer: 1,
        explanation: "A true defender helps with action, not advice to fight back.",
        icon: "🏆",
        conceptKeys: ["bystander_intervention", "cyberbullying_response"],
        learningObjectives: ["Understand how to help as a bystander","Know the correct response to online bullying"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "warm-retry-quiz",
      },
      // ── GROUP B ──
      {
        stepId: "b-module-intro-2",
        type: "story",
        title: "The invisible bully",
        ageGroup: "B",
        stepCategory: "intro",
        depthLevel: 1,
        text: "Someone types something cruel and hits send. In a second, someone else feels small. The worst part? The bully might be a stranger, a 'friend', or completely anonymous. Cyberbullying is real, it is common, and it is not your fault. In this module, you will learn how to stand up — for yourself and for others.",
        icon: "💬",
        mascot: "🦸",
        speech: "Courage is not about fighting. It is about doing the right thing when it matters.",
        conceptKeys: ["cyberbullying_recognition", "bystander_intervention", "module_intro"],
        learningObjectives: ["Identify signs of cyberbullying","Understand how to help as a bystander","Understand the module theme and goals"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-cross-module-review-1",
        type: "quiz",
        title: "Review: CyberSafe World",
        ageGroup: "B",
        stepCategory: "review",
        depthLevel: 2,
        question: "From Module 1: you posted a photo and now it is being shared without your permission. What does this teach you about digital footprints?",
        options: [
          "Nothing — it is just a photo",
          "Once content is online, you lose some control over it",
          "You can always delete it completely"
        ],
        answer: 1,
        explanation: "Digital footprints persist. This is why Module 1 taught you to think before you post.",
        icon: "🛡️",
        conceptKeys: ["digital_footprint", "pii_basics", "stranger_online"],
        learningObjectives: ["Understand that online actions leave a permanent trail","Identify personally identifiable information","Recognise risks from unknown people online"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-anonymous-message",
        type: "story",
        title: "The anonymous message",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 2,
        text: "A new student receives an anonymous message: 'No one likes you here.' Even though the sender is hidden, the hurt is real. This is cyberbullying. Anonymity does not make cruelty acceptable.",
        icon: "💬",
        mascot: "🦸",
        speech: "Anonymity does not make cruelty acceptable.",
        conceptKeys: ["cyberbullying_recognition", "anonymity_risk"],
        learningObjectives: ["Identify signs of cyberbullying","Understand anonymity does not excuse cruelty"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-bystander-choice",
        type: "quiz",
        title: "Bystander choice",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        question: "You see a classmate being bullied in a group chat. What do you do?",
        options: [
          "Join in to avoid being targeted",
          "Privately message the victim, report the bully, and tell a teacher",
          "Ignore it — not my problem"
        ],
        answer: 1,
        explanation: "Bystanders have power. Reporting and supporting the victim breaks the cycle.",
        icon: "⚖️",
        conceptKeys: ["bystander_intervention"],
        learningObjectives: ["Understand how to help as a bystander"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-evidence-and-report",
        type: "story",
        title: "Evidence and report",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        text: "Screenshots are evidence. Most platforms have a 'Report' button. Reporting is not tattling — it is protecting yourself and others. Screenshots + report = the strongest response.",
        icon: "📸",
        mascot: "🦸",
        speech: "Document. Report. Protect.",
        conceptKeys: ["cyberbullying_response", "platform_tools"],
        learningObjectives: ["Know the correct response to online bullying","Use block, report, and screenshot tools"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-platform-response",
        type: "quiz",
        title: "Platform response",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 4,
        question: "You are being cyberbullied in a game chat. The bully is anonymous. What is your best sequence of actions?",
        options: [
          "Reply with insults, then block",
          "Screenshot the messages, block the bully, report to the platform, and tell an adult",
          "Delete the game and never play again"
        ],
        answer: 1,
        explanation: "Screenshot + block + report + tell adult covers evidence, stopping the bully, platform action, and adult support.",
        icon: "📱",
        conceptKeys: ["cyberbullying_response", "platform_tools"],
        learningObjectives: ["Know the correct response to online bullying","Use block, report, and screenshot tools"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-bully-branch",
        type: "story",
        title: "The bystander branch",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 4,
        text: "You witness cyberbullying in a group chat. The bully is popular. Your choice will change what happens next.",
        icon: "🔀",
        mascot: "🦸",
        speech: "Every choice has a consequence. Choose wisely.",
        choices: [
          {
            text: "Join in to fit in",
            feedback: "The bully targets you next. The victim feels more alone. Your reputation suffers.",
            consequence: "negative",
            xpDelta: -10,
          },
          {
            text: "Privately support the victim and report the bully",
            feedback: "The victim thanks you. The bully is warned by moderators. You feel proud.",
            consequence: "positive",
            xpDelta: 25,
          },
          {
            text: "Ignore it and scroll away",
            feedback: "The bullying continues. Later, the victim tells an adult. You wish you had helped.",
            consequence: "neutral",
            xpDelta: 5,
          },
        ],
        conceptKeys: ["bystander_intervention", "cyberbullying_response", "anonymity_risk"],
        learningObjectives: ["Understand how to help as a bystander","Know the correct response to online bullying","Understand anonymity does not excuse cruelty"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-empathy-reboot",
        type: "story",
        title: "Empathy reboot",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        text: "Sometimes bullies are struggling themselves. That does not make their actions okay, but understanding why can help you respond calmly and seek help rather than retaliate.",
        icon: "🧠",
        mascot: "🦸",
        speech: "Empathy does not mean accepting cruelty. It means you understand it so you can respond better.",
        conceptKeys: ["empathy", "bystander_intervention"],
        learningObjectives: ["Develop empathy while maintaining boundaries","Understand how to help as a bystander"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-bully-blocker-round",
        type: "quiz",
        title: "Bully blocker round",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 5,
        question: "A friend is being bullied online. The bully is anonymous. Your friend is scared to tell an adult. What do you do?",
        options: [
          "Tell them to ignore it",
          "Offer to go with them to tell a teacher, and screenshot the evidence",
          "Message the bully back"
        ],
        answer: 1,
        explanation: "Screenshot evidence + adult support is the strongest response. You become the bridge.",
        icon: "🤝",
        conceptKeys: ["bystander_intervention", "cyberbullying_response", "platform_tools"],
        learningObjectives: ["Understand how to help as a bystander","Know the correct response to online bullying","Use block, report, and screenshot tools"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-module2-review",
        type: "quiz",
        title: "Module 2 review",
        ageGroup: "B",
        stepCategory: "review",
        depthLevel: 3,
        question: "What is the correct order of actions when you see cyberbullying?",
        options: [
          "Reply, block, then tell",
          "Screenshot, block, report, tell an adult",
          "Ignore, delete, then forget"
        ],
        answer: 1,
        explanation: "Evidence first, then block/report, then adult support. That sequence protects everyone.",
        icon: "📝",
        conceptKeys: ["cyberbullying_response", "bystander_intervention", "platform_tools"],
        learningObjectives: ["Know the correct response to online bullying","Understand how to help as a bystander","Use block, report, and screenshot tools"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-module2-bridge",
        type: "story",
        title: "Real-world mission",
        ageGroup: "B",
        stepCategory: "bridge",
        depthLevel: 4,
        text: "This week, ask a family member: 'Have you ever seen someone being treated unkindly online? What did they do?' Write down the best answer and share it with Captain Cyber for a reward.",
        icon: "🌍",
        mascot: "🦸",
        speech: "Real courage is practised offline before it is needed online.",
        conceptKeys: ["bystander_intervention", "cyberbullying_response", "real_world_bridge"],
        learningObjectives: ["Understand how to help as a bystander","Know the correct response to online bullying","Connect online learning to offline habits"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-module2-capstone",
        type: "quiz",
        title: "Defender exam",
        ageGroup: "B",
        stepCategory: "capstone",
        depthLevel: 5,
        question: "A bully creates a fake account to harass someone. The victim does not know who it is. What is the most effective action?",
        options: [
          "Create a fake account back",
          "Document everything, report the account, and support the victim to tell an adult",
          "Convince the victim to quit everything"
        ],
        answer: 1,
        explanation: "Documentation + platform report + adult support is the complete defence.",
        icon: "🏆",
        conceptKeys: ["cyberbullying_response", "bystander_intervention", "platform_tools", "anonymity_risk"],
        learningObjectives: ["Know the correct response to online bullying","Understand how to help as a bystander","Use block, report, and screenshot tools","Understand anonymity does not excuse cruelty"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 3 — The Phishing Fisher
  // ─────────────────────────────────────────────────────────
  {
    slug: "phishing-fisher",
    title: "The Phishing Fisher",
    subtitle: "Catch the scams!",
    icon: "🎣",
    color: "#2BC48A",
    badge: "🐟",
    badgeName: "Scam Catcher",
    order: 3,
    lessons: [
      // ── GROUP A ──
      {
        stepId: "a-too-good-to-be-true",
        type: "story",
        title: "Too good to be true?",
        ageGroup: "A",
        stepCategory: "intro",
        depthLevel: 1,
        text: "Captain Cyber got a message: 'You won a free tablet!' He did not even enter a competition. Someone was trying to trick him. This is called phishing — when someone uses bait to get your personal information.",
        icon: "🎣",
        mascot: "🦸",
        speech: "If it seems too good to be true, it usually is. Time to become a Phishing Fisher!",
        conceptKeys: ["phishing_hooks", "module_intro"],
        learningObjectives: ["Recognise bait messages and fake offers","Understand the module theme and goals"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-click-or-ask",
        type: "quiz",
        title: "Click or ask?",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 2,
        question: "You get a message: 'Click here to win a free tablet!' You did not enter any competition. What do you do?",
        options: [
          "Click right away — free stuff!",
          "Ask a grown-up first",
          "Share with all your friends"
        ],
        answer: 1,
        explanation: "Free prize messages are often scams. Always check with a grown-up!",
        icon: "🎁",
        conceptKeys: ["phishing_hooks", "tell_adult"],
        learningObjectives: ["Recognise bait messages and fake offers","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-strange-links",
        type: "story",
        title: "Strange links",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 2,
        text: "Weird links are like suspicious doors. You would not open a door to a stranger — do not click a link from one either. Look for the little lock icon and web address that makes sense.",
        icon: "🔗",
        mascot: "🦸",
        speech: "Strange links = keep out!",
        conceptKeys: ["suspicious_links"],
        learningObjectives: ["Identify and avoid dangerous links"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-meet-the-phishing-fisher",
        type: "story",
        title: "The Phishing Fisher",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        text: "Meet the Phishing Fisher — he casts fake bait (prizes, warnings, fake logins) hoping you will bite. Your job is to spot his bait and throw it back.",
        icon: "🎣",
        mascot: "🦸",
        speech: "The Phishing Fisher is sneaky, but we are smarter!",
        conceptKeys: ["phishing_awareness"],
        learningObjectives: ["Understand phishing tactics and prevention"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-catch-or-throw-back",
        type: "quiz",
        title: "Catch or throw back?",
        ageGroup: "A",
        stepCategory: "capstone",
        depthLevel: 3,
        question: "Which message looks safest?",
        options: [
          "cool-free-prize.click",
          "your-school-website.org",
          "win-now-now.biz"
        ],
        answer: 1,
        explanation: "Strange or 'too fun' links are traps. Trust real, known websites.",
        icon: "🔗",
        conceptKeys: ["suspicious_links", "phishing_awareness"],
        learningObjectives: ["Identify and avoid dangerous links","Understand phishing tactics and prevention"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a","ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "warm-retry-quiz",
      },
      // ── GROUP B ──
      {
        stepId: "b-prize-that-wasnt",
        type: "story",
        title: "The prize that wasn't",
        ageGroup: "B",
        stepCategory: "intro",
        depthLevel: 1,
        text: "You receive: 'Congratulations! You won an iPhone. Click here to claim.' The sender is 'support@apple-support.xyz'. Three red flags in one message: a prize you did not earn, a weird sender, and pressure to act fast.",
        icon: "🎣",
        mascot: "🦸",
        speech: "Legitimate companies do not give away iPhones in random DMs.",
        conceptKeys: ["phishing_hooks", "sender_spoofing"],
        learningObjectives: ["Recognise bait messages and fake offers","Recognise fake sender addresses"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-url-forensics",
        type: "quiz",
        title: "URL forensics",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 2,
        question: "You receive a link that looks like your school login. The real school site is your-school.org. Which URL is suspicious?",
        options: [
          "https://your-school.org/login",
          "https://your-school.secure-login.xyz",
          "https://google.com"
        ],
        answer: 1,
        explanation: "The domain 'secure-login.xyz' is not your-school.org. Always check the real domain before clicking.",
        icon: "🔍",
        conceptKeys: ["suspicious_links", "url_analysis"],
        learningObjectives: ["Identify and avoid dangerous links","Evaluate URLs for legitimacy"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a","ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-sender-spoofing",
        type: "story",
        title: "Sender spoofing",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        text: "Scammers can make an email look like it comes from anyone. 'From: teacher@school.com' does not mean it is actually from your teacher. Always check the real email address, not just the display name.",
        icon: "🎭",
        mascot: "🦸",
        speech: "Never trust the 'From' name alone. Check the real address.",
        conceptKeys: ["sender_spoofing"],
        learningObjectives: ["Recognise fake sender addresses"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-urgency-trap",
        type: "quiz",
        title: "Urgency trap",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 4,
        question: "A message says 'Your account will be deleted in 1 hour unless you act now.' It asks for your password. What combination of tactics is this?",
        options: [
          "A normal security update",
          "Urgency + authority spoofing + credential harvesting",
          "A helpful reminder from your school"
        ],
        answer: 1,
        explanation: "This combines urgency, fake authority, and a password grab. Three red flags at once.",
        icon: "⏰",
        conceptKeys: ["urgency_tactics", "sender_spoofing", "phishing_hooks"],
        learningObjectives: ["Identify pressure tactics in scams","Recognise fake sender addresses","Recognise bait messages and fake offers"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a","ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-phishing-boss",
        type: "story",
        title: "The Phishing Fisher boss",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 5,
        text: "The Phishing Fisher combines all his tricks: a fake prize, a spoofed sender, a weird URL, and urgent language. Can you spot all four? This is the boss level — real scams use multiple tactics at once.",
        icon: "👑",
        mascot: "🦸",
        speech: "The boss level uses every trick. Stay sharp.",
        conceptKeys: ["phishing_hooks", "sender_spoofing", "suspicious_links", "urgency_tactics"],
        learningObjectives: ["Recognise bait messages and fake offers","Recognise fake sender addresses","Identify and avoid dangerous links","Identify pressure tactics in scams"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-catch-or-release",
        type: "quiz",
        title: "Catch or release",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        question: "Which message is safe?",
        options: [
          "You won a lottery! Click now!",
          "Your parent asked you to come home.",
          "Free coins for your game — enter password"
        ],
        answer: 1,
        explanation: "Only the message from a real, trusted person is safe.",
        icon: "🎣",
        conceptKeys: ["phishing_awareness", "sender_spoofing"],
        learningObjectives: ["Understand phishing tactics and prevention","Recognise fake sender addresses"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-phishing-forensics",
        type: "quiz",
        title: "Phishing forensics exam",
        ageGroup: "B",
        stepCategory: "capstone",
        depthLevel: 6,
        question: "You receive an email from 'bank@secure-bank.com' asking for your password. What do you do?",
        options: [
          "Reply with your password",
          "Call the bank using the number on their official website",
          "Click the link to verify your account"
        ],
        answer: 1,
        explanation: "Never give passwords via email. Call the real bank directly using their official number.",
        icon: "🕵️",
        conceptKeys: ["phishing_awareness", "sender_spoofing", "tell_adult"],
        learningObjectives: ["Understand phishing tactics and prevention","Recognise fake sender addresses","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 4 — Password Castle
  // ─────────────────────────────────────────────────────────
  {
    slug: "password-castle",
    title: "Password Castle",
    subtitle: "Build your defences",
    icon: "🏰",
    color: "#8B5CF6",
    badge: "🔐",
    badgeName: "Lock Keeper",
    order: 4,
    lessons: [
      // ── GROUP A ──
      {
        stepId: "a-module-intro-4",
        type: "story",
        title: "The castle gate",
        ageGroup: "A",
        stepCategory: "intro",
        depthLevel: 1,
        text: "Captain Cyber's castle had a flimsy gate. Anyone could push it open. A password is like a castle gate — if it is weak, intruders can get in. In this module, you will build a Password Castle with locks so strong only YOU can open them.",
        icon: "🏰",
        mascot: "🦸",
        speech: "A strong password is the first line of defence. Let's build your castle!",
        conceptKeys: ["password_strength", "module_intro"],
        learningObjectives: ["Create and maintain strong passwords","Understand the module theme and goals"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-cross-module-review-3",
        type: "quiz",
        title: "Review: Phishing Fisher",
        ageGroup: "A",
        stepCategory: "review",
        depthLevel: 2,
        question: "From Module 3: you get a message saying 'Click here to win a free game!' What do you do?",
        options: [
          "Click it immediately",
          "Ask a grown-up first",
          "Share it with friends"
        ],
        answer: 1,
        explanation: "Free prize messages are often scams. Always check with a grown-up first.",
        icon: "🎣",
        conceptKeys: ["phishing_hooks", "suspicious_links", "tell_adult"],
        learningObjectives: ["Recognise bait messages and fake offers","Identify and avoid dangerous links","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-what-is-password",
        type: "story",
        title: "What is a password?",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 2,
        text: "A password is a secret word or phrase that proves it is really you. It is like the key to your diary or the code to your bike lock. You would not give your diary key to a stranger — do not share your password either!",
        icon: "🔑",
        mascot: "🦸",
        speech: "Passwords are secret keys. Keep them safe and secret!",
        conceptKeys: ["password_basics"],
        learningObjectives: ["Understand what passwords are and why they matter"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-password-rules",
        type: "quiz",
        title: "Password rules",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        question: "Which password is stronger?",
        options: [
          "123456",
          "MyNameIsSam",
          "Blue$Mountain42!",
        ],
        answer: 2,
        explanation: "Strong passwords mix letters, numbers, and symbols. Short or guessable passwords are easy to break.",
        icon: "💪",
        conceptKeys: ["password_strength"],
        learningObjectives: ["Create and maintain strong passwords"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-do-not-share",
        type: "story",
        title: "Do not share!",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 2,
        text: "Even your best friend should not know your password. If someone asks for it, say no and tell a grown-up. Real friends respect your secrets.",
        icon: "🤐",
        mascot: "🦸",
        speech: "Your password is YOUR business. Never share it.",
        conceptKeys: ["password_sharing"],
        learningObjectives: ["Never share passwords with anyone"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-password-manager-intro",
        type: "story",
        title: "Password helpers",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        text: "Remembering lots of passwords is hard. Grown-ups use a password manager — like a treasure chest that keeps all your keys safe. You only need to remember ONE strong password to open it.",
        icon: "🗝️",
        mascot: "🦸",
        speech: "A password manager is like a super-secure treasure chest for your keys.",
        conceptKeys: ["password_manager"],
        learningObjectives: ["Use a password manager securely"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-password-match",
        type: "quiz",
        title: "Password match",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        question: "Your sibling asks for your password so they can play your game. What do you do?",
        options: [
          "Give it to them",
          "Say no and tell a grown-up",
          "Change it after they finish"
        ],
        answer: 1,
        explanation: "Never share your password, even with family. Ask a grown-up to help instead.",
        icon: "🚫",
        conceptKeys: ["password_sharing", "tell_adult"],
        learningObjectives: ["Never share passwords with anyone","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.a","ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-module4-review",
        type: "quiz",
        title: "Module 4 review",
        ageGroup: "A",
        stepCategory: "review",
        depthLevel: 3,
        question: "What makes a strong password?",
        options: [
          "Your name or birthday",
          "A mix of letters, numbers, and symbols",
          "A short, easy word"
        ],
        answer: 1,
        explanation: "Mix letters, numbers, and symbols. Personal info is easy for hackers to guess.",
        icon: "📝",
        conceptKeys: ["password_strength", "password_basics"],
        learningObjectives: ["Create and maintain strong passwords","Understand what passwords are and why they matter"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "a-module4-bridge",
        type: "story",
        title: "Your real-world mission",
        ageGroup: "A",
        stepCategory: "bridge",
        depthLevel: 4,
        text: "Tonight, with a grown-up, check one of your accounts. Ask: 'Is our password strong?' If it is weak, change it TOGETHER. Share your Password Castle progress with Captain Cyber!",
        icon: "🔍",
        mascot: "🦸",
        speech: "Building a strong password together is a great team mission.",
        conceptKeys: ["password_strength", "password_manager", "real_world_bridge"],
        learningObjectives: ["Create and maintain strong passwords","Use a password manager securely","Connect online learning to offline habits"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a-module4-capstone",
        type: "quiz",
        title: "Lock Keeper quiz",
        ageGroup: "A",
        stepCategory: "capstone",
        depthLevel: 4,
        question: "You receive a message: 'Enter your password here to get free gems for your game.' What do you do?",
        options: [
          "Enter it — free gems!",
          "Close the message and tell a grown-up",
          "Enter just the first part"
        ],
        answer: 1,
        explanation: "Free offers that ask for passwords are traps. Never enter your password for a 'free' reward.",
        icon: "🏆",
        conceptKeys: ["password_strength", "phishing_hooks", "tell_adult"],
        learningObjectives: ["Create and maintain strong passwords","Recognise bait messages and fake offers","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b","ISTE 1.3.d"],
        activityType: "warm-retry-quiz",
      },
      // ── GROUP B ──
      {
        stepId: "b-module-intro-4",
        type: "story",
        title: "The cracked gate",
        ageGroup: "B",
        stepCategory: "intro",
        depthLevel: 1,
        text: "Captain Cyber's castle gate had a combination lock. The problem? The combination was 1-2-3-4. Any intruder could guess it in seconds. In this module, you will learn why weak passwords are cracked gates and how to build a vault no intruder can open.",
        icon: "🏰",
        mascot: "🦸",
        speech: "A strong password is the strongest wall in your digital castle.",
        conceptKeys: ["password_strength", "password_basics", "module_intro"],
        learningObjectives: ["Create and maintain strong passwords","Understand what passwords are and why they matter","Understand the module theme and goals"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-cross-module-review-3",
        type: "quiz",
        title: "Review: Phishing Fisher",
        ageGroup: "B",
        stepCategory: "review",
        depthLevel: 2,
        question: "From Module 3: you see a link that looks like your school site but the domain is wrong. What should you do?",
        options: [
          "Click it anyway",
          "Do not click and tell a trusted adult",
          "Share the link with friends"
        ],
        answer: 1,
        explanation: "A wrong domain means danger. Never click suspicious links.",
        icon: "🎣",
        conceptKeys: ["suspicious_links", "phishing_hooks", "tell_adult"],
        learningObjectives: ["Identify and avoid dangerous links","Recognise bait messages and fake offers","Know when and how to ask a trusted adult for help"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-password-cracking",
        type: "story",
        title: "How passwords get cracked",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 2,
        text: "Hackers use 'dictionary attacks' — they try thousands of common words in seconds. 'Password', '123456', and your pet's name can all be guessed. A strong password must be long, random, and unique.",
        icon: "🔓",
        mascot: "🦸",
        speech: "If it is in a dictionary, a hacker can crack it. Be unpredictable.",
        conceptKeys: ["password_strength", "password_basics"],
        learningObjectives: ["Create and maintain strong passwords","Understand what passwords are and why they matter"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-password-rules-b",
        type: "quiz",
        title: "Password forensics",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        question: "Which password would be hardest for a hacker to crack?",
        options: [
          "bella2010",
          "Tr0ub4dor&3",
          "jessica"
        ],
        answer: 1,
        explanation: "Mix upper/lowercase, numbers, and symbols. Avoid names, dates, or dictionary words.",
        icon: "🔍",
        conceptKeys: ["password_strength"],
        learningObjectives: ["Create and maintain strong passwords"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-password-reuse",
        type: "story",
        title: "Password reuse risk",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        text: "Using the same password for everything is like using ONE key for your house, your bike, and your school locker. If someone steals one key, they get everything. Every site needs its own unique password.",
        icon: "🔑",
        mascot: "🦸",
        speech: "One key for everything is a disaster waiting to happen.",
        conceptKeys: ["password_reuse"],
        learningObjectives: ["Understand risks of reusing passwords"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-two-factor-intro",
        type: "story",
        title: "Two-factor defence",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 4,
        text: "Two-factor authentication (2FA) is like a castle with TWO gates. Even if someone steals your key, they still cannot get in without the second gate (usually a code sent to your phone). Always turn it on when you can.",
        icon: "🔐",
        mascot: "🦸",
        speech: "2FA adds a second lock. Hackers hate it.",
        conceptKeys: ["two_factor_auth"],
        learningObjectives: ["Use 2FA for account security"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-password-leak",
        type: "quiz",
        title: "The password leak",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 4,
        question: "You read that a website you use had a 'data breach' and passwords were stolen. What do you do?",
        options: [
          "Nothing — it is not your fault",
          "Change that password immediately, and change any other site where you used the same one",
          "Tell everyone their passwords were stolen"
        ],
        answer: 1,
        explanation: "Change the compromised password and any duplicates. Password reuse multiplies the damage.",
        icon: "⚠️",
        conceptKeys: ["password_reuse", "data_breach_response"],
        learningObjectives: ["Understand risks of reusing passwords","Respond correctly to service breaches"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-password-boss",
        type: "story",
        title: "The Password Castle boss",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 5,
        text: "The boss level: a site requires at least 12 characters, mixed case, numbers, symbols, no dictionary words, and a unique password. This is what real security looks like. Build your castle to these standards.",
        icon: "👑",
        mascot: "🦸",
        speech: "The strongest castles have the strongest gates.",
        conceptKeys: ["password_strength", "password_reuse", "two_factor_auth"],
        learningObjectives: ["Create and maintain strong passwords","Understand risks of reusing passwords","Use 2FA for account security"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-module4-review",
        type: "quiz",
        title: "Module 4 review",
        ageGroup: "B",
        stepCategory: "review",
        depthLevel: 3,
        question: "Why is password reuse dangerous?",
        options: [
          "It makes your computer slower",
          "One breach exposes all your accounts",
          "It is not dangerous at all"
        ],
        answer: 1,
        explanation: "If one site is breached and you reused the password, attackers can access every other site too.",
        icon: "📝",
        conceptKeys: ["password_reuse", "data_breach_response"],
        learningObjectives: ["Understand risks of reusing passwords","Respond correctly to service breaches"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "warm-retry-quiz",
      },
      {
        stepId: "b-module4-bridge",
        type: "story",
        title: "Real-world mission",
        ageGroup: "B",
        stepCategory: "bridge",
        depthLevel: 4,
        text: "With a parent, review your password habits. Do you reuse passwords? Do you have 2FA turned on? Pick ONE account to strengthen this week and report back to Captain Cyber.",
        icon: "🔍",
        mascot: "🦸",
        speech: "Small improvements to your digital habits make a huge difference.",
        conceptKeys: ["password_strength", "password_reuse", "two_factor_auth", "real_world_bridge"],
        learningObjectives: ["Create and maintain strong passwords","Understand risks of reusing passwords","Use 2FA for account security","Connect online learning to offline habits"],
        successCriteria: ["Kid can apply the concept in this step"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "b-module4-capstone",
        type: "quiz",
        title: "Lock Keeper exam",
        ageGroup: "B",
        stepCategory: "capstone",
        depthLevel: 5,
        question: "You use the same password for your game account, email, and social media. Your game account gets hacked. What happens?",
        options: [
          "Only your game account is affected",
          "The hacker can try the same password on your email and social media",
          "Your password resets automatically"
        ],
        answer: 1,
        explanation: "Password reuse means one breach becomes many. Always use unique passwords per site.",
        icon: "🏆",
        conceptKeys: ["password_reuse", "data_breach_response", "password_strength"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 5 — Privacy Shield
  // ─────────────────────────────────────────────────────────
  {
    slug: "privacy-shield",
    title: "Privacy Shield",
    subtitle: "Guard your secrets",
    icon: "🛡️",
    color: "#F59E0B",
    badge: "🔒",
    badgeName: "Secret Guardian",
    order: 5,
    lessons: [
      // ── GROUP A ──
      {
        stepId: "a5-what-is-private",
        type: "story",
        title: "What is private?",
        ageGroup: "A",
        stepCategory: "intro",
        depthLevel: 1,
        text: "Your name, address, school, phone number, and photos with your face are private information. They are like treasure — you should only share them with people you trust, like your parents or teacher.",
        icon: "🛡️",
        mascot: "🦸",
        speech: "Personal info is private treasure. Guard it closely!",
        conceptKeys: ["private_info", "oversharing"],
        learningObjectives: ["Identify private information", "Understand why some details must be protected"],
        successCriteria: ["Kid can name 3 private details", "Kid says 'tell an adult' when unsure"],
        connexusStandards: ["ISTE 1.2.a", "ISTE 1.2.b"],
        activityType: "story-led-mascot",
      },
      {
        stepId: "a5-safe-to-share",
        type: "quiz",
        title: "Safe to share?",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 2,
        question: "Which of these is safe to share with someone online?",
        options: [
          "Your favourite colour",
          "Your home address",
          "Your school name"
        ],
        answer: 0,
        explanation: "Your favourite colour is safe to share. Your address and school are private.",
        icon: "✅",
        conceptKeys: ["private_info", "oversharing"],
        learningObjectives: ["Classify information as safe or private"],
        successCriteria: ["Kid correctly identifies safe vs private info 3/3 times"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "point-to-identify",
      },
      {
        stepId: "a5-strangers-online",
        type: "story",
        title: "Strangers online",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 2,
        text: "A stranger in a chat asks for your photo. What do you do? Captain Cyber says: say no, block them, and find a trusted adult. You do not owe strangers any pictures or information.",
        icon: "🚫",
        mascot: "🦸",
        speech: "Say no to strangers. Block and tell an adult.",
        conceptKeys: ["stranger_danger", "photo_privacy", "tell_adult"],
        learningObjectives: ["Recognise stranger requests", "Practice the no-block-tell response"],
        successCriteria: ["Kid can verbalise the no-block-tell sequence"],
        connexusStandards: ["ISTE 1.2.a", "ISTE 1.3.d"],
        activityType: "branching-response",
      },
      {
        stepId: "a5-shield-building",
        type: "story",
        title: "Your shield is strong",
        ageGroup: "A",
        stepCategory: "core",
        depthLevel: 3,
        text: "Tap to add protections to your Privacy Shield: lock your profile, turn off location, and keep personal details secret. A strong shield keeps you safe while you explore.",
        icon: "🛡️",
        mascot: "🦸",
        speech: "Tap, tap, tap — your shield is getting stronger!",
        conceptKeys: ["privacy_settings", "private_info"],
        learningObjectives: ["Identify privacy settings", "Understand how settings protect you"],
        successCriteria: ["Kid can name 2 privacy settings"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "interactive-shield-build",
        materials: ["tablet or desktop"],
      },
      {
        stepId: "a5-captain-cyber-quiz",
        type: "quiz",
        title: "Captain Cyber quiz",
        ageGroup: "A",
        stepCategory: "capstone",
        depthLevel: 3,
        question: "Which of these should you NEVER share with someone you meet online?",
        options: [
          "Your favourite game",
          "A photo of your face",
          "Your favourite colour"
        ],
        answer: 1,
        explanation: "Never share photos of yourself with strangers. Tell an adult if someone asks.",
        icon: "🏆",
        conceptKeys: ["private_info", "photo_privacy", "tell_adult"],
        learningObjectives: ["Review all Module 5 concepts", "Demonstrate retention"],
        successCriteria: ["Score 3/3 on capstone quiz"],
        connexusStandards: ["ISTE 1.2.a"],
        activityType: "warm-retry-quiz",
      },
      // ── GROUP B ──
      {
        stepId: "b-cross-module-review-5",
        type: "quiz",
        title: "Review: Password Castle",
        ageGroup: "B",
        stepCategory: "review",
        depthLevel: 2,
        question: "From Module 4: why is password reuse dangerous?",
        options: [
          "It makes your account look boring",
          "One breach exposes all accounts",
          "It is not dangerous"
        ],
        answer: 1,
        explanation: "Reuse multiplies risk. One breach becomes many.",
        icon: "🏰",
        conceptKeys: ["password_reuse", "data_breach_response"],
        connexusStandards: ["ISTE 1.2.b"],
      },
      {
        stepId: "b5-digital-footprint",
        type: "story",
        title: "The digital footprint",
        ageGroup: "B",
        stepCategory: "intro",
        depthLevel: 1,
        text: "Everything you post is archived. A post at age 10 can be seen at 16 — by future teachers, coaches, and colleges. Your digital footprint is permanent. Before you post, ask: 'Would I be comfortable with everyone seeing this forever?'",
        icon: "👣",
        mascot: "🦸",
        speech: "Your footprint lasts longer than you think. Think before you post.",
        conceptKeys: ["digital_footprint", "data_footprint"],
        learningObjectives: ["Understand permanence of online posts", "Connect present actions to future consequences"],
        successCriteria: ["Kid can explain why a post at 10 matters at 16"],
        connexusStandards: ["ISTE 1.2.b", "ISTE 1.3.d"],
        activityType: "narrative-scenario",
      },
      {
        stepId: "b5-what-is-private-b",
        type: "quiz",
        title: "What is private?",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 2,
        question: "Which combination could help a stranger find you in real life?",
        options: [
          "Your favourite food",
          "Your school, city, and team name",
          "Your favourite YouTuber"
        ],
        answer: 1,
        explanation: "School + city + team can pinpoint your location. Keep details vague.",
        icon: "📍",
        conceptKeys: ["private_info", "location_safety"],
        learningObjectives: ["Classify PII granularly", "Understand location risks"],
        successCriteria: ["Kid correctly identifies location-pinpointing combinations"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "multi-select-partial-credit",
      },
      {
        stepId: "b5-grooming-arc",
        type: "story",
        title: "The grooming arc",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        text: "A 'nice' stranger starts with friendly chats, then asks for photos, then asks to keep secrets. This is grooming. Real friends never ask you to keep secrets from your parents. If someone tries this, block and tell an adult immediately.",
        icon: "🎭",
        mascot: "🦸",
        speech: "Grooming starts small. Trust your gut and tell an adult.",
        conceptKeys: ["grooming_awareness", "manipulation_tactics"],
        learningObjectives: ["Recognise grooming patterns", "Understand manipulation stages"],
        successCriteria: ["Kid can name 2 grooming stages"],
        connexusStandards: ["ISTE 1.3.d", "ISTE 1.2.a"],
        activityType: "branching-consequence",
        choices: [
          {
            text: "Share a photo because they seem nice",
            feedback: "Groomers start with small requests. Sharing a photo is a red flag.",
            consequence: "negative",
            xpDelta: -5,
          },
          {
            text: "Block and tell a trusted adult",
            feedback: "You recognised the pattern. Protecting yourself is the right move.",
            consequence: "positive",
            xpDelta: 10,
          },
          {
            text: "Keep it a secret because they said no one else would understand",
            feedback: "Secrets from parents are a major grooming warning sign.",
            consequence: "negative",
            xpDelta: -5,
          },
        ],
      },
      {
        stepId: "b5-share-with-whom",
        type: "quiz",
        title: "Share-with-whom matrix",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 4,
        question: "Your school address is safe to share with:",
        options: [
          "A stranger in a game",
          "Your parent or teacher",
          "A new friend you met online"
        ],
        answer: 1,
        explanation: "Only trusted adults need your school address. Never share it with strangers or online friends.",
        icon: "📊",
        conceptKeys: ["private_info", "oversharing", "trusted_adults"],
        learningObjectives: ["Map information to audience trust levels", "Apply the share-with-whom matrix"],
        successCriteria: ["Kid correctly classifies 4/4 scenarios"],
        connexusStandards: ["ISTE 1.2.b", "ISTE 1.3.d"],
        activityType: "grid-classification",
      },
      {
        stepId: "b5-location-risks",
        type: "story",
        title: "Location risks",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 3,
        text: "Captain Cyber accidentally posted a photo with location tagging on. His exact address was visible to everyone. Geo-tagging can reveal your school or home. Always turn off location tagging for photos, or ask a grown-up to check.",
        icon: "📍",
        mascot: "🦸",
        speech: "A photo can broadcast your address. Turn off geotagging.",
        conceptKeys: ["geotagging", "location_safety", "photo_privacy"],
        learningObjectives: ["Understand hidden location data in photos", "Learn to disable geo-tagging"],
        successCriteria: ["Kid can explain what geo-tagging is and how to turn it off"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "narrative-scenario",
        materials: ["smartphone or tablet"],
      },
      {
        stepId: "b5-settings-challenge",
        type: "quiz",
        title: "Settings challenge",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 4,
        question: "You want to turn off location sharing on your phone. Where do you go?",
        options: [
          "Settings > Privacy > Location Services",
          "Home screen",
          "Messages app"
        ],
        answer: 0,
        explanation: "Location settings live under Privacy. A grown-up can help you find them.",
        icon: "⚙️",
        conceptKeys: ["privacy_settings", "location_safety"],
        learningObjectives: ["Navigate device privacy settings", "Turn off location sharing"],
        successCriteria: ["Kid can locate location settings with adult help"],
        connexusStandards: ["ISTE 1.2.b"],
        activityType: "simulated-ui",
        materials: ["smartphone or tablet"],
      },
      {
        stepId: "b5-privacy-plan",
        type: "challenge",
        title: "Privacy plan",
        ageGroup: "B",
        stepCategory: "core",
        depthLevel: 4,
        text: "Design your own Privacy Shield. Choose 3 rules you will follow: who you share info with, what you post, and how you handle strangers. Your plan is stored as 'my shield' — review it weekly.",
        icon: "🛡️",
        conceptKeys: ["privacy_settings", "private_info", "oversharing", "real_world_bridge"],
        learningObjectives: ["Create a personal privacy plan", "Commit to safe sharing habits"],
        successCriteria: ["Kid completes 3-rule privacy plan"],
        connexusStandards: ["ISTE 1.3.d", "ISTE 1.2.a"],
        activityType: "plan-builder",
      },
      {
        stepId: "b5-final-exam",
        type: "challenge",
        title: "Final exam",
        ageGroup: "B",
        stepCategory: "capstone",
        depthLevel: 5,
        text: "Mixed exam from all 5 modules: cyberbullying response, phishing detection, password strength, and privacy scenarios. 12 questions, timed. Score determines your league XP and badge.",
        icon: "🏆",
        conceptKeys: ["cyberbullying_response", "phishing_hooks", "password_strength", "private_info", "digital_footprint"],
        learningObjectives: ["Demonstrate mastery across all modules", "Apply knowledge under timed conditions"],
        successCriteria: ["Score ≥ 70% on final exam"],
        connexusStandards: ["ISTE 1.2.a", "ISTE 1.2.b", "ISTE 1.3.d"],
        activityType: "timed-exam",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // GRADUATION — End of Programme
  // ─────────────────────────────────────────────────────────
  {
    slug: "cyber-guardian-graduation",
    title: "Cyber Guardian Graduation",
    subtitle: "You did it!",
    icon: "🎓",
    color: "#10B981",
    badge: "🎓",
    badgeName: "Cyber Guardian",
    order: 6,
    lessons: [
      // ── GROUP A ──
      {
        stepId: "a-graduation-story",
        type: "story",
        title: "Captain Cyber's secret mission",
        ageGroup: "A",
        stepCategory: "capstone",
        depthLevel: 4,
        text: "Captain Cyber is proud of you! You have learned about personal information, cyberbullying, phishing, passwords, and privacy. Now you are a Cyber Safe Explorer. Your certificate is waiting, and so is a special secret mission from Captain Cyber.",
        icon: "🎓",
        mascot: "🦸",
        speech: "You are now a Cyber Safe Explorer! Keep exploring safely.",
        conceptKeys: ["graduation", "module_intro", "badge_earned"],
        learningObjectives: ["Celebrate completion of all 5 modules", "Reinforce identity as a safe explorer"],
        successCriteria: ["Kid receives Explorer badge and certificate"],
        connexusStandards: ["ISTE 1.3.d"],
        activityType: "celebration-narrative",
      },
      // ── GROUP B ──
      {
        stepId: "b-graduation-challenge",
        type: "challenge",
        title: "Classroom Champion round",
        ageGroup: "B",
        stepCategory: "capstone",
        depthLevel: 6,
        text: "You have completed all 5 modules. You are now a Cyber Guardian. Take this final challenge to earn your badge, certificate, and a spot on the Classroom Champion leaderboard.",
        icon: "🏆",
        conceptKeys: ["graduation", "module_intro", "badge_earned", "leaderboard"],
        learningObjectives: ["Demonstrate mastery across all 5 modules", "Earn Cyber Guardian status"],
        successCriteria: ["Score ≥ 80% on final challenge", "Earn Cyber Guardian badge"],
        connexusStandards: ["ISTE 1.2.a", "ISTE 1.2.b", "ISTE 1.3.d"],
        activityType: "live-competitive-round",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// NEW CURRICULUM STRUCTURE (Phase 4)
// Sections → Units → Lessons → Notes → Questions
// ─────────────────────────────────────────────────────────

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

function generateOptions(correct: string, wrongs: string[]): string[] {
  const all = [correct, ...wrongs];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

function q(lessonId: string, id: string, question: string, correct: string, wrongs: string[], explanation: string, difficulty: 1 | 2 | 3 | 4 | 5 = 1, xpReward: number = 10): CurriculumQuestion {
  return {
    id: `${lessonId}-${id}`,
    lessonId,
    question,
    options: generateOptions(correct, wrongs),
    correctIndex: 0,
    explanation,
    difficulty,
    xpReward,
  };
}

function lesson(unitId: string, id: string, title: string, notes: string, ageGroup: "A" | "B", difficulty: 1 | 2 | 3 | 4 | 5, questions: CurriculumQuestion[]): CurriculumLesson {
  return { id: `${unitId}-${id}`, unitId, title, notes, order: 0, ageGroup, difficulty, questions };
}

function unit(sectionId: string, id: string, title: string, description: string, icon: string, ageGroup: "A" | "B", lessons: CurriculumLesson[]): CurriculumUnit {
  return { id: `${sectionId}-${id}`, sectionId, title, description, icon, order: 0, ageGroup, lessons };
}

function section(id: string, title: string, description: string, icon: string, color: string, ageGroup: "A" | "B", units: CurriculumUnit[]): CurriculumSection {
  return { id, title, description, icon, color, order: 0, ageGroup, units };
}

export const CURRICULUM: CurriculumData = {
  sections: [
    // ─────────────────────────────────────────────────────────
    // GROUP B — Ages 8–12
    // ─────────────────────────────────────────────────────────
    section("gb-cybersafe-world", "CyberSafe World", "Understand the digital world.", "🌍", "#4D96FF", "B", [
      unit("gb-cybersafe-world", "how-internet-works", "How the Internet Works", "Learn what happens when you go online.", "🔌", "B", [
        lesson("gb-cybersafe-world-how-internet-works", "l1", "The Internet and You", "When you open a website, your device sends a request to a server. The server sends the website back. This all happens in seconds.", "B", 1, [
          q("gb-cybersafe-world-how-internet-works-l1", "q1", "What happens when you open a website?", "Your device asks a server for the website", ["The website jumps into your screen", "Nothing happens"], "Your device sends a request to a server.", 2, 10),
          q("gb-cybersafe-world-how-internet-works-l1", "q2", "How fast does a website load?", "In seconds", ["In hours", "In days"], "Websites load very quickly.", 2, 10),
          q("gb-cybersafe-world-how-internet-works-l1", "q3", "What is a server?", "A powerful computer that stores websites", ["A type of phone", "A game console"], "Servers store and send website data.", 3, 10),
        ]),
        lesson("gb-cybersafe-world-how-internet-works", "l2", "IP Addresses and DNS", "Every device has an IP address, like a home address for your computer. DNS translates website names to IP addresses.", "B", 2, [
          q("gb-cybersafe-world-how-internet-works-l2", "q1", "An IP address is like:", "A home address for your computer", ["A password", "A username"], "IP addresses identify devices on the internet.", 3, 10),
          q("gb-cybersafe-world-how-internet-works-l2", "q2", "What does DNS do?", "Translates website names to IP addresses", ["Blocks websites", "Creates passwords"], "DNS helps your device find websites by name.", 3, 10),
        ]),
      ]),

      unit("gb-cybersafe-world", "data-privacy", "Data and Privacy", "What is data and why does it matter?", "📊", "B", [
        lesson("gb-cybersafe-world-data-privacy", "l1", "What is Personal Data?", "Personal data is any information about you: name, email, photos, location, school. Companies collect this data and must protect it.", "B", 1, [
          q("gb-cybersafe-world-data-privacy-l1", "q1", "Which of these is personal data?", "Your email address", ["A public news article", "A weather report"], "Email address is personal data.", 2, 10),
          q("gb-cybersafe-world-data-privacy-l1", "q2", "Why do companies collect data?", "To improve their services", ["To give it away freely", "To delete it all"], "Companies use data to improve services.", 3, 10),
          q("gb-cybersafe-world-data-privacy-l1", "q3", "Who is responsible for protecting your data?", "Both you and the companies", ["Only you", "Only the company"], "Both users and companies share responsibility.", 3, 10),
        ]),
        lesson("gb-cybersafe-world-data-privacy", "l2", "Data Brokers and Tracking", "Data brokers collect info from many websites and sell it. They can build a detailed profile of you without your knowledge.", "B", 2, [
          q("gb-cybersafe-world-data-privacy-l2", "q1", "What do data brokers do?", "Collect and sell personal information", ["Give free cookies", "Fix computers"], "Data brokers sell personal information.", 3, 10),
          q("gb-cybersafe-world-data-privacy-l2", "q2", "How can you limit tracking?", "Use privacy settings and ad blockers", ["Share more info", "Click every ad"], "Privacy settings and ad blockers help limit tracking.", 4, 10),
        ]),
      ]),

      unit("gb-cybersafe-world", "digital-footprint", "Digital Footprint", "Your online actions leave a permanent trail.", "👣", "B", [
        lesson("gb-cybersafe-world-digital-footprint", "l1", "Digital Footprint Basics", "You post a photo on a public account. Three weeks later, a stranger screenshots it and uses it in a fake profile. Why does this happen?", "B", 2, [
          q("gb-cybersafe-world-digital-footprint-l1", "q1", "Why can a screenshot of your photo be used later?", "Once something is online, it can be copied and shared beyond your control", ["The app deleted your photo", "Your phone was hacked"], "Digital footprints are permanent.", 2, 10),
          q("gb-cybersafe-world-digital-footprint-l1", "q2", "What is a digital footprint?", "The trail of data you leave online", ["Your physical shoe size", "A type of virus", "A social media app"], "Everything you post creates a digital footprint.", 3, 10),
        ]),
        lesson("gb-cybersafe-world-digital-footprint", "l2", "The Stranger Test", "Before sharing anything online, ask: 'Would I say this to a stranger in real life?' If the answer is no, do not post it.", "B", 3, [
          q("gb-cybersafe-world-digital-footprint-l2", "q1", "The stranger test means:", "Would I say this to a stranger in real life?", ["Ask a stranger for advice", "Test your password strength", "Count your online friends"], "The stranger test is a simple filter for oversharing.", 3, 10),
          q("gb-cybersafe-world-digital-footprint-l2", "q2", "If you would not say it to a stranger, should you post it?", "No", ["Yes, if it is funny", "Only if no one is watching", "It depends"], "If you would not say it to a stranger, do not post it.", 4, 10),
        ]),
      ]),

      unit("gb-cybersafe-world", "online-identity", "Online Identity", "Your online identity is yours to shape.", "👤", "B", [
        lesson("gb-cybersafe-world-online-identity", "l1", "Avatar Creation", "Your online identity is yours to shape. Choose wisely — your avatar represents you in the CyberSafe World and reminds you that your digital self matters.", "B", 1, [
          q("gb-cybersafe-world-online-identity-l1", "q1", "Your avatar represents:", "Your digital self", ["Your real face", "Your password", "Your location"], "Your avatar is your online identity.", 2, 10),
          q("gb-cybersafe-world-online-identity-l1", "q2", "Why does your digital self matter?", "It shapes how others see you online", ["It is not real so it does not matter", "Only adults have digital identities"], "Your online identity matters.", 3, 10),
        ]),
        lesson("gb-cybersafe-world-online-identity", "l2", "PII Classification", "You are signing up for a new game. It asks for your full name, birthdate, and home address. Which combination should you give?", "B", 3, [
          q("gb-cybersafe-world-online-identity-l2", "q1", "What should you share when signing up for a game?", "Only what is required", ["All of it", "Make up a fake name and real address"], "Share only required information.", 3, 10),
          q("gb-cybersafe-world-online-identity-l2", "q2", "When should you share your home address?", "Never without a parent approving", ["Always for delivery", "Only with online friends"], "Never share your address without parental approval.", 4, 10),
        ]),
      ]),
    ]),

    section("gb-bully-blocker", "The Bully Blocker", "Stand up to cyberbullying.", "🛡️", "#FF7A59", "B", [
      unit("gb-bully-blocker", "recognition", "Cyberbullying Recognition", "Identify signs of cyberbullying.", "💬", "B", [
        lesson("gb-bully-blocker-recognition", "l1", "The Invisible Bully", "Someone types something cruel and hits send. In a second, someone else feels small. The worst part? The bully might be a stranger, a 'friend', or completely anonymous. Cyberbullying is real, it is common, and it is not your fault.", "B", 1, [
          q("gb-bully-blocker-recognition-l1", "q1", "Cyberbullying is:", "Being mean online", ["Playing a game", "Sharing a photo"], "Being mean online is cyberbullying.", 2, 10),
          q("gb-bully-blocker-recognition-l1", "q2", "Who can be a cyberbully?", "A stranger, friend, or anonymous person", ["Only strangers", "Only people you know"], "Bullies can be anyone online.", 3, 10),
        ]),
        lesson("gb-bully-blocker-recognition", "l2", "Bystander Choice", "You see a classmate being bullied in a group chat. What do you do?", "B", 3, [
          q("gb-bully-blocker-recognition-l2", "q1", "You see cyberbullying. Best action?", "Privately message the victim, report the bully, and tell a teacher", ["Join in to avoid being targeted", "Ignore it — not my problem"], "Bystanders have power to help.", 3, 10),
          q("gb-bully-blocker-recognition-l2", "q2", "Reporting is:", "Protecting yourself and others", ["Tattling", "Making it worse"], "Reporting is not tattling — it is protecting.", 4, 10),
        ]),
      ]),

      unit("gb-bully-blocker", "response", "Response and Evidence", "How to respond and document cyberbullying.", "📸", "B", [
        lesson("gb-bully-blocker-response", "l1", "Evidence and Report", "Screenshots are evidence. Most platforms have a 'Report' button. Reporting is not tattling — it is protecting yourself and others.", "B", 3, [
          q("gb-bully-blocker-response-l1", "q1", "What is evidence of cyberbullying?", "A screenshot", ["A rumor", "A deleted message"], "Screenshots preserve proof.", 3, 10),
          q("gb-bully-blocker-response-l1", "q2", "Why report cyberbullying?", "To protect yourself and others", ["To get the bully in trouble", "To show off"], "Reporting stops the bully and protects others.", 4, 10),
        ]),
        lesson("gb-bully-blocker-response", "l2", "Platform Response", "You are being cyberbullied in a game chat. The bully is anonymous. What is your best sequence of actions?", "B", 4, [
          q("gb-bully-blocker-response-l2", "q1", "Best sequence?", "Screenshot, block, report, tell an adult", ["Reply with insults, then block", "Delete the game"], "Evidence + block + report + adult is the strongest response.", 4, 10),
        ]),
      ]),
    ]),

    section("gb-phishing-fisher", "The Phishing Fisher", "Catch the scams!", "🎣", "#2BC48A", "B", [
      unit("gb-phishing-fisher", "url-forensics", "URL Forensics", "Evaluate URLs for legitimacy.", "🔍", "B", [
        lesson("gb-phishing-fisher-url-forensics", "l1", "URL Forensics", "You receive a link that looks like your school login. The real school site is your-school.org. Which URL is suspicious?", "B", 2, [
          q("gb-phishing-fisher-url-forensics-l1", "q1", "Which URL is suspicious?", "your-school.secure-login.xyz", ["your-school.org/login", "google.com"], "The domain is wrong.", 3, 10),
          q("gb-phishing-fisher-url-forensics-l1", "q2", "Always check the:", "Real domain before clicking", ["Emoji used", "Time it was sent"], "Check the real domain.", 4, 10),
        ]),
      ]),

      unit("gb-phishing-fisher", "sender-spoofing", "Sender Spoofing", "Scammers can make an email look like it comes from anyone.", "🎭", "B", [
        lesson("gb-phishing-fisher-sender-spoofing", "l1", "Sender Spoofing", "Scammers can make an email look like it comes from anyone. 'From: teacher@school.com' does not mean it is actually from your teacher. Always check the real email address.", "B", 3, [
          q("gb-phishing-fisher-sender-spoofing-l1", "q1", "Never trust the:", "'From' name alone", ["Subject line", "Email length"], "Check the real address.", 3, 10),
          q("gb-phishing-fisher-sender-spoofing-l1", "q2", "A fake sender email might look like:", "teacher@school.com but actually be different", ["A real school address", "A known teacher name"], "Display names can be spoofed.", 4, 10),
        ]),
      ]),

      unit("gb-phishing-fisher", "urgency-trap", "Urgency Trap", "Pressure tactics in scams.", "⏰", "B", [
        lesson("gb-phishing-fisher-urgency-trap", "l1", "Urgency Trap", "A message says 'Your account will be deleted in 1 hour unless you act now.' It asks for your password. What combination of tactics is this?", "B", 4, [
          q("gb-phishing-fisher-urgency-trap-l1", "q1", "This combines:", "Urgency + authority spoofing + credential harvesting", ["A normal update", "A helpful reminder"], "Three red flags at once.", 4, 10),
        ]),
      ]),
    ]),

    section("gb-password-castle", "Password Castle", "Build strong passwords to protect your castle.", "🏰", "#F59E0B", "B", [
      unit("gb-password-castle", "strength", "Password Strength", "Creating and managing secure passwords.", "🔑", "B", [
        lesson("gb-password-castle-strength", "l1", "Password Strength", "A strong password is long, uses uppercase, lowercase, numbers, and symbols. Avoid birthdays, pet names, or common words.", "B", 1, [
          q("gb-password-castle-strength-l1", "q1", "What makes a password strong?", "Length and character variety", ["Short and simple", "Only letters"], "Strong passwords are long and complex.", 2, 10),
          q("gb-password-castle-strength-l1", "q2", "Which is a weak password?", "password123", ["K9#mP2$vL", "Tr0ub4dor&3"], "password123 is common and easy to guess.", 3, 10),
        ]),
        lesson("gb-password-castle-strength", "l2", "Password Managers", "Password managers store all your passwords in one encrypted place. You only need to remember one master password.", "B", 2, [
          q("gb-password-castle-strength-l2", "q1", "What is a password manager?", "A tool that stores passwords securely", ["A notebook", "A friend"], "Password managers securely store passwords.", 3, 10),
          q("gb-password-castle-strength-l2", "q2", "How many passwords should you remember?", "One master password", ["All of them", "Half of them"], "You only need the master password.", 4, 10),
        ]),
      ]),
    ]),

    section("gb-privacy-shield", "Privacy Shield", "Protect your personal information.", "🛡️", "#22C55E", "B", [
      unit("gb-privacy-shield", "wifi-safety", "Public Wi-Fi Safety", "Risks of public networks and how to stay safe.", "📶", "B", [
        lesson("gb-privacy-shield-wifi-safety", "l1", "Public Wi-Fi Risks", "Public Wi-Fi at cafes or airports is convenient but risky. Hackers can intercept data on open networks.", "B", 2, [
          q("gb-privacy-shield-wifi-safety-l1", "q1", "Why is public Wi-Fi risky?", "Hackers can intercept your data", ["It is always fast", "It is free"], "Open networks can be intercepted.", 3, 10),
          q("gb-privacy-shield-wifi-safety-l1", "q2", "What should you avoid on public Wi-Fi?", "Online banking", ["Checking weather", "Reading news"], "Avoid sensitive activities.", 3, 10),
        ]),
        lesson("gb-privacy-shield-wifi-safety", "l2", "Staying Safe on Public Wi-Fi", "Use a VPN, stick to HTTPS sites, and avoid logging into accounts with sensitive info on public networks.", "B", 3, [
          q("gb-privacy-shield-wifi-safety-l2", "q1", "What does VPN stand for?", "Virtual Private Network", ["Very Private Network", "Virtual Public Network"], "VPN creates a secure tunnel.", 4, 10),
          q("gb-privacy-shield-wifi-safety-l2", "q2", "What does HTTPS mean?", "Secure connection to a website", ["A type of virus", "A fast internet"], "HTTPS means the connection is encrypted.", 4, 10),
        ]),
      ]),

      unit("gb-privacy-shield", "scam-recognition", "Scam Recognition", "Spotting scams in games, social media, and messages.", "🚨", "B", [
        lesson("gb-privacy-shield-scam-recognition", "l1", "Gaming Scams", "Scammers offer free skins, coins, or boosts in exchange for your account info. Never share login details for in-game items.", "B", 2, [
          q("gb-privacy-shield-scam-recognition-l1", "q1", "A scam offers free game skins for:", "Your account password", ["Your real name", "Your favorite color"], "Never share login details.", 2, 10),
          q("gb-privacy-shield-scam-recognition-l1", "q2", "If a deal seems too good to be true, it probably is:", "True", ["False", "Maybe"], "If it seems too good to be true, it is likely a scam.", 3, 10),
        ]),
        lesson("gb-privacy-shield-scam-recognition", "l2", "Social Media Scams", "Fake giveaways, fake accounts, and phishing links are common on social media. Verify before you click or share.", "B", 3, [
          q("gb-privacy-shield-scam-recognition-l2", "q1", "A social media giveaway might be a scam if:", "It asks for your password", ["It is from your favorite celebrity", "It has many likes"], "Giveaways should never ask for passwords.", 3, 10),
          q("gb-privacy-shield-scam-recognition-l2", "q2", "What should you do before clicking a social media link?", "Check the URL and sender", ["Click it first", "Share it with friends"], "Check URL and sender before clicking.", 4, 10),
        ]),
      ]),

      unit("gb-privacy-shield", "social-engineering", "Social Engineering", "How attackers manipulate people.", "🎭", "B", [
        lesson("gb-privacy-shield-social-engineering", "l1", "Manipulation Tactics", "Social engineers use urgency, authority, and curiosity to trick you. They might pretend to be IT, a boss, or a friend in trouble.", "B", 2, [
          q("gb-privacy-shield-social-engineering-l1", "q1", "Social engineering is:", "Manipulating people to reveal info", ["Building software", "Teaching social studies"], "It is psychological manipulation.", 3, 10),
          q("gb-privacy-shield-social-engineering-l1", "q2", "A scammer pretends to be IT support. This is:", "Social engineering", ["A normal IT ticket", "A security test"], "Pretending to be someone else is social engineering.", 3, 10),
        ]),
        lesson("gb-privacy-shield-social-engineering", "l2", "Preventing Social Engineering", "Verify identities independently. Never share passwords or sensitive info based on pressure. When in doubt, call the person directly.", "B", 3, [
          q("gb-privacy-shield-social-engineering-l2", "q1", "How do you verify a suspicious request?", "Contact the person through a known channel", ["Do what they ask immediately", "Ignore it completely"], "Verify independently.", 4, 10),
          q("gb-privacy-shield-social-engineering-l2", "q2", "What is a common pressure tactic?", "Urgency: 'Do this now!'", ["Polite request", "Friendly greeting"], "Urgency is a common manipulation tactic.", 4, 10),
        ]),
      ]),
    ]),

    section("ga-cybersafe-world", "CyberSafe World", "Your adventure begins.", "🌍", "#4D96FF", "A", [
      unit("ga-cybersafe-world", "internet-basics", "Internet Basics", "The internet connects devices all over the world.", "🌐", "A", [
        lesson("ga-cybersafe-world-internet-basics", "l1", "The Internet is Everywhere", "The internet connects phones, tablets, and computers. People use it to learn, play, and talk to friends. But remember: not everyone on the internet is who they say they are.", "A", 1, [
          q("ga-cybersafe-world-internet-basics-l1", "q1", "What connects computers all over the world?", "The internet", ["A TV", "A book", "A phone"], "The internet is the network that connects computers globally.", 1, 10),
          q("ga-cybersafe-world-internet-basics-l1", "q2", "Which device can use the internet?", "A tablet", ["A pencil", "A chair", "A shoe"], "Tablets can connect to the internet.", 1, 10),
          q("ga-cybersafe-world-internet-basics-l1", "q3", "Is everyone on the internet who they say they are?", "No", ["Yes", "Maybe", "Always"], "People online might pretend to be someone else.", 2, 10),
        ]),
        lesson("ga-cybersafe-world-internet-basics", "l2", "Good and Bad Things Online", "The internet has fun games, videos, and learning sites. But it can also have scary or mean things. Ask an adult if you see something that makes you uncomfortable.", "A", 1, [
          q("ga-cybersafe-world-internet-basics-l2", "q1", "What should you do if you see something scary online?", "Tell a trusted adult", ["Close it and forget it", "Share it with friends", "Keep it secret"], "Tell a trusted adult right away.", 1, 10),
          q("ga-cybersafe-world-internet-basics-l2", "q2", "Which of these is GOOD to do online?", "Learn a new game from a teacher", ["Talk to strangers", "Share your password", "Click unknown links"], "Learning from a teacher is safe.", 1, 10),
          q("ga-cybersafe-world-internet-basics-l2", "q3", "If a website asks for your home address, what do you do?", "Close the website and tell an adult", ["Type it in", "Ask a friend", "Ignore it"], "Never share personal info without adult permission.", 2, 10),
        ]),
      ]),

      unit("ga-cybersafe-world", "personal-info", "Personal Information", "Your name, address, and school are private.", "🔒", "A", [
        lesson("ga-cybersafe-world-personal-info", "l1", "My Personal Information", "Your name, address, phone number, and school are personal information. These are private. You should only share them with people your parents trust.", "A", 1, [
          q("ga-cybersafe-world-personal-info-l1", "q1", "Which of these is personal information?", "Your home address", ["A cat video", "A math game", "A cartoon"], "Your home address is personal and private.", 1, 10),
          q("ga-cybersafe-world-personal-info-l1", "q2", "Who should you share your name with online?", "Only people your parents trust", ["Everyone", "Strangers", "No one ever"], "Only share with trusted people your parents approve.", 1, 10),
          q("ga-cybersafe-world-personal-info-l1", "q3", "A website asks for your school name. What do you do?", "Ask a parent first", ["Type it immediately", "Make up a name", "Close the computer"], "Always ask a parent before sharing school info.", 2, 10),
        ]),
        lesson("ga-cybersafe-world-personal-info", "l2", "Keeping Info Private", "Imagine your personal information is a treasure chest. Only you and your parents have the key. Never give the key to strangers online.", "A", 2, [
          q("ga-cybersafe-world-personal-info-l2", "q1", "Your personal info is like:", "A treasure chest with a key", ["A toy everyone can play with", "A book in a library", "A free candy"], "Personal info is private, like a locked treasure chest.", 2, 10),
          q("ga-cybersafe-world-personal-info-l2", "q2", "If someone online asks for your photo, what do you do?", "Tell a parent", ["Send it right away", "Send a fake photo", "Ask them for theirs first"], "Always ask a parent before sending photos.", 2, 10),
        ]),
      ]),

      unit("ga-cybersafe-world", "safe-people", "Safe People Online", "How to recognize safe people and avoid strangers.", "👫", "A", [
        lesson("ga-cybersafe-world-safe-people", "l1", "Friends vs Strangers", "Online friends you know in real life are safe. Strangers are people you have never met. Never meet an online stranger without your parents.", "A", 1, [
          q("ga-cybersafe-world-safe-people-l1", "q1", "Who is safe online?", "Someone your parents know", ["A random person messaging you", "A username you don't recognize", "A stranger"], "People your parents know are safe.", 1, 10),
          q("ga-cybersafe-world-safe-people-l1", "q2", "Can you meet an online stranger alone?", "No, never", ["Yes, if they are nice", "Yes, with a friend", "Only if they give gifts"], "Never meet strangers without parents.", 2, 10),
        ]),
        lesson("ga-cybersafe-world-safe-people", "l2", "Grown-ups Who Help", "Police, teachers, and parents are helpers. If someone online makes you feel sad or scared, tell a grown-up right away.", "A", 2, [
          q("ga-cybersafe-world-safe-people-l2", "q1", "Who can you tell if someone online makes you scared?", "A parent or teacher", ["Keep it secret", "Tell another kid", "Tell the stranger"], "Tell a trusted grown-up.", 1, 10),
          q("ga-cybersafe-world-safe-people-l2", "q2", "A stranger offers you a gift online. What do you do?", "Tell a parent", ["Accept it", "Ask for more", "Keep it secret"], "Never accept gifts from strangers online without parents.", 2, 10),
        ]),
      ]),

      unit("ga-cybersafe-world", "passwords", "Password Basics", "Learn what passwords are and how to keep them secret.", "🔑", "A", [
        lesson("ga-cybersafe-world-passwords", "l1", "What is a Password?", "A password is like a secret key to your account. Only you should know it. Never share it with friends or strangers.", "A", 1, [
          q("ga-cybersafe-world-passwords-l1", "q1", "A password is like:", "A secret key", ["A public sign", "A toy", "A snack"], "A password is a secret key only you should know.", 1, 10),
          q("ga-cybersafe-world-passwords-l1", "q2", "Who should know your password?", "Only you", ["Your best friend", "Your teacher", "Everyone"], "Only you should know your password.", 1, 10),
          q("ga-cybersafe-world-passwords-l1", "q3", "If a friend asks for your password, what do you do?", "Say no and tell a parent", ["Share it", "Change it later", "Give them a fake one"], "Never share your password with anyone.", 2, 10),
        ]),
        lesson("ga-cybersafe-world-passwords", "l2", "Strong Secrets", "A strong password has letters, numbers, and symbols. The stronger the password, the safer your account.", "A", 2, [
          q("ga-cybersafe-world-passwords-l2", "q1", "Which password is stronger?", "K9#mP2", ["123456", "password", "cat"], "Strong passwords have letters, numbers, and symbols.", 2, 10),
          q("ga-cybersafe-world-passwords-l2", "q2", "What makes a password strong?", "Mix of letters, numbers, and symbols", ["Only letters", "Your name", "Short words"], "Mix of different characters makes it strong.", 2, 10),
        ]),
      ]),
    ]),

    section("ga-bully-blocker", "The Bully Blocker", "Stand up to cyberbullying.", "🛡️", "#FF7A59", "A", [
      unit("ga-bully-blocker", "understanding", "Understanding Cyberbullying", "What is cyberbullying and how to stop it.", "💬", "A", [
        lesson("ga-bully-blocker-understanding", "l1", "What is Cyberbullying?", "Cyberbullying is when someone uses the internet to be mean to another person. It is not okay. Tell an adult if you see it.", "A", 2, [
          q("ga-bully-blocker-understanding-l1", "q1", "Cyberbullying is:", "Being mean online", ["Playing a game", "Sharing a photo", "Saying hello"], "Being mean online is cyberbullying.", 2, 10),
          q("ga-bully-blocker-understanding-l1", "q2", "What should you do if you see cyberbullying?", "Tell an adult", ["Join in", "Ignore it", "Share it"], "Tell an adult immediately.", 2, 10),
        ]),
        lesson("ga-bully-blocker-understanding", "l2", "Block and Tell", "When someone is mean to you online, the first thing to do is block them. Then tell a trusted adult — a parent, teacher, or Captain Cyber! Blocking stops the message. Telling stops the problem.", "A", 3, [
          q("ga-bully-blocker-understanding-l2", "q1", "What is the first thing to do when someone is mean online?", "Block them", ["Reply with a mean message", "Cry", "Tell all your friends"], "Blocking stops the bully from contacting you.", 2, 10),
          q("ga-bully-blocker-understanding-l2", "q2", "After blocking, what should you do?", "Tell a trusted adult", ["Keep it secret", "Delete the app", "Forget about it"], "Telling an adult helps stop the problem.", 3, 10),
        ]),
      ]),

      unit("ga-bully-blocker", "bystander", "Bystander Intervention", "How to help when someone else is being bullied.", "🤝", "A", [
        lesson("ga-bully-blocker-bystander", "l1", "Be a Buddy", "If you see a friend being bullied online, support them. Tell them to block the bully and then tell an adult together. A true defender does not watch from the sidelines.", "A", 3, [
          q("ga-bully-blocker-bystander-l1", "q1", "If you see a friend being bullied, what should you do?", "Support them and tell an adult together", ["Watch and do nothing", "Join the bully", "Tell everyone at school"], "Supporting friends is the right thing to do.", 2, 10),
          q("ga-bully-blocker-bystander-l1", "q2", "A true defender:", "Helps their friends", ["Watches from the sidelines", "Joins the bully", "Ignores the problem"], "True defenders take action.", 2, 10),
        ]),
        lesson("ga-bully-blocker-bystander", "l2", "What Would You Do?", "You see a classmate being bullied in a game chat. They have not told anyone. What is the best action?", "A", 4, [
          q("ga-bully-blocker-bystander-l2", "q1", "You see cyberbullying. What is the best action?", "Tell them privately to block and report, then tell an adult together", ["Join the chat and defend them publicly", "Ignore it — not my business"], "Privately supporting the victim and getting an adult involved is safest.", 3, 10),
          q("ga-bully-blocker-bystander-l2", "q2", "Should you publicly shame the bully?", "No, block and report instead", ["Yes, that teaches them a lesson", "Only if they are really mean", "It depends on the situation"], "Blocking and reporting is safer than public fights.", 3, 10),
        ]),
      ]),

      unit("ga-bully-blocker", "kindness", "Kindness Online", "Treat others nicely on the internet.", "💬", "A", [
        lesson("ga-bully-blocker-kindness", "l1", "Being Kind Online", "Just like in real life, we should be kind online. Say nice things, help friends, and don't write mean messages.", "A", 1, [
          q("ga-bully-blocker-kindness-l1", "q1", "What should you do online?", "Be kind and nice", ["Be mean to others", "Ignore everyone", "Only talk to strangers"], "Be kind online just like in real life.", 1, 10),
          q("ga-bully-blocker-kindness-l1", "q2", "If someone is mean to you online, what do you do?", "Tell a trusted adult", ["Be mean back", "Keep it secret", "Tell everyone at school"], "Tell a trusted adult.", 1, 10),
        ]),
        lesson("ga-bully-blocker-kindness", "l2", "The Power of Words", "Words can hurt or help. A nice comment can make someone's day. A mean comment can hurt their feelings. Choose kind words.", "A", 2, [
          q("ga-bully-blocker-kindness-l2", "q1", "A nice comment can:", "Make someone happy", ["Hurt someone", "Break a computer", "Delete a game"], "Nice comments make people feel good.", 1, 10),
          q("ga-bully-blocker-kindness-l2", "q2", "If you see someone being bullied online, what do you do?", "Tell an adult and be kind to the person", ["Join in", "Ignore it", "Post about it"], "Tell an adult and be supportive.", 2, 10),
        ]),
      ]),
    ]),

    section("ga-phishing-fisher", "The Phishing Fisher", "Catch the scams!", "🎣", "#2BC48A", "A", [
      unit("ga-phishing-fisher", "what-is-phishing", "What is Phishing?", "Recognize fake messages and tricks.", "🎣", "A", [
        lesson("ga-phishing-fisher-what-is-phishing", "l1", "Too Good to Be True?", "Captain Cyber got a message: 'You won a free tablet!' He did not even enter a competition. Someone was trying to trick him. This is called phishing — when someone uses bait to get your personal information.", "A", 1, [
          q("ga-phishing-fisher-what-is-phishing-l1", "q1", "What is phishing?", "Tricking you to get your info", ["A type of fishing", "A security tool", "A game"], "Phishing uses bait to steal information.", 2, 10),
          q("ga-phishing-fisher-what-is-phishing-l1", "q2", "If a message says you won a prize but you did not enter, what is it?", "Probably a scam", ["A real prize", "A surprise gift", "A game reward"], "Unexpected prizes are often scams.", 2, 10),
        ]),
        lesson("ga-phishing-fisher-what-is-phishing", "l2", "Click or Ask?", "You get a message: 'Click here to win a free tablet!' You did not enter any competition. What do you do?", "A", 2, [
          q("ga-phishing-fisher-what-is-phishing-l2", "q1", "A message says you won a free tablet. What do you do?", "Ask a grown-up first", ["Click right away", "Share with friends"], "Free prize messages are often scams.", 2, 10),
          q("ga-phishing-fisher-what-is-phishing-l2", "q2", "Phishing tries to get:", "Your personal information", ["Your favorite color", "Your game score", "Your pet's name"], "Phishing steals personal information.", 3, 10),
        ]),
      ]),

      unit("ga-phishing-fisher", "strange-links", "Strange Links", "Weird links are like suspicious doors.", "🔗", "A", [
        lesson("ga-phishing-fisher-strange-links", "l1", "Strange Links", "Weird links are like suspicious doors. You would not open a door to a stranger — do not click a link from one either. Look for the little lock icon and web address that makes sense.", "A", 2, [
          q("ga-phishing-fisher-strange-links-l1", "q1", "A strange link is like:", "A suspicious door", ["A fun game", "A safe website", "A gift"], "Strange links can be dangerous.", 2, 10),
          q("ga-phishing-fisher-strange-links-l1", "q2", "What should you look for in a safe link?", "A lock icon and a known address", ["A picture of a cat", "The word 'free'", "Lots of pop-ups"], "Lock icons and known addresses are safer.", 3, 10),
        ]),
        lesson("ga-phishing-fisher-strange-links", "l2", "Pop-ups and Scams", "Pop-ups appear suddenly. Some say you won a prize. These are often tricks. Close them and tell an adult.", "A", 2, [
          q("ga-phishing-fisher-strange-links-l2", "q1", "What should you do with a pop-up?", "Close it and tell an adult", ["Click it immediately", "Download whatever it offers"], "Pop-ups can be tricks.", 2, 10),
          q("ga-phishing-fisher-strange-links-l2", "q2", "A pop-up says you won a prize. What do you do?", "Tell a parent", ["Click to claim", "Enter your info"], "Prize pop-ups are often scams.", 2, 10),
        ]),
      ]),

      unit("ga-phishing-fisher", "catch-or-throw", "Catch or Throw Back", "Spot safe messages and throw back dangerous ones.", "🎣", "A", [
        lesson("ga-phishing-fisher-catch-or-throw", "l1", "Catch or Throw Back?", "Which message looks safest? Your school website or a weird link that says 'win now'?", "A", 3, [
          q("ga-phishing-fisher-catch-or-throw-l1", "q1", "Which link is safest?", "your-school-website.org", ["cool-free-prize.click", "win-now-now.biz"], "Strange links are traps.", 2, 10),
          q("ga-phishing-fisher-catch-or-throw-l1", "q2", "A message from a stranger says you won a prize. What do you do?", "Throw it back — tell an adult", ["Catch it — click now", "Share it with friends"], "Unexpected prizes are scams.", 3, 10),
        ]),
      ]),
    ]),

    section("ga-password-castle", "Password Castle", "Build strong passwords to protect your castle.", "🏰", "#F59E0B", "A", [
      unit("ga-password-castle", "strength", "Password Strength", "What makes a password strong.", "🔑", "A", [
        lesson("ga-password-castle-strength", "l1", "What Makes a Password Strong?", "A strong password is long, uses uppercase, lowercase, numbers, and symbols. Avoid birthdays, pet names, or common words.", "A", 1, [
          q("ga-password-castle-strength-l1", "q1", "What makes a password strong?", "Length and character variety", ["Short and simple", "Only letters", "Your name"], "Strong passwords are long and complex.", 2, 10),
          q("ga-password-castle-strength-l1", "q2", "Which is a weak password?", "password123", ["K9#mP2$vL", "Tr0ub4dor&3"], "password123 is common and easy to guess.", 3, 10),
        ]),
        lesson("ga-password-castle-strength", "l2", "Strong Secrets", "A strong password has letters, numbers, and symbols. The stronger the password, the safer your account.", "A", 2, [
          q("ga-password-castle-strength-l2", "q1", "Which password is stronger?", "K9#mP2", ["123456", "password", "cat"], "Strong passwords have letters, numbers, and symbols.", 2, 10),
          q("ga-password-castle-strength-l2", "q2", "What makes a password strong?", "Mix of letters, numbers, and symbols", ["Only letters", "Your name", "Short words"], "Mix of different characters makes it strong.", 2, 10),
        ]),
      ]),

      unit("ga-password-castle", "safe-keepers", "Keeping Passwords Safe", "How to store and manage passwords.", "🔐", "A", [
        lesson("ga-password-castle-safe-keepers", "l1", "Password Managers", "Password managers store all your passwords in one encrypted place. You only need to remember one master password.", "A", 2, [
          q("ga-password-castle-safe-keepers-l1", "q1", "What is a password manager?", "A tool that stores passwords securely", ["A notebook", "A friend who remembers passwords", "A type of virus"], "Password managers securely store passwords.", 3, 10),
          q("ga-password-castle-safe-keepers-l1", "q2", "How many passwords should you remember if you use a manager?", "One master password", ["All of them", "None, you can forget them all"], "You only need the master password.", 4, 10),
        ]),
        lesson("ga-password-castle-safe-keepers", "l2", "Password Hygiene", "Never share your password. Change it if someone else finds out. Use different passwords for different accounts.", "A", 3, [
          q("ga-password-castle-safe-keepers-l2", "q1", "If someone finds out your password, what should you do?", "Change it immediately", ["Keep using it", "Share it with more people"], "Change compromised passwords right away.", 3, 10),
          q("ga-password-castle-safe-keepers-l2", "q2", "Should you use the same password for every account?", "No, use different passwords", ["Yes, it is easier", "Only for games"], "Different passwords keep accounts safer.", 4, 10),
        ]),
      ]),
    ]),

    section("ga-privacy-shield", "Privacy Shield", "Protect your personal information.", "🛡️", "#22C55E", "A", [
      unit("ga-privacy-shield", "settings", "Privacy Settings", "How to keep your accounts private.", "🔐", "A", [
        lesson("ga-privacy-shield-settings", "l1", "What are Privacy Settings?", "Privacy settings are controls that keep your information safe. Set them to private with help from your parents.", "A", 2, [
          q("ga-privacy-shield-settings-l1", "q1", "Privacy settings help:", "Keep your info safe", ["Make games faster", "Add more friends"], "Privacy settings protect your information.", 2, 10),
          q("ga-privacy-shield-settings-l1", "q2", "Who should help you set privacy settings?", "Your parents", ["A stranger", "Your pet"], "Parents should help with privacy settings.", 2, 10),
        ]),
        lesson("ga-privacy-shield-settings", "l2", "Checking Your Settings", "Check your privacy settings every few months. Make sure your account is on private so only people you know can see you.", "A", 3, [
          q("ga-privacy-shield-settings-l2", "q1", "How often should you check privacy settings?", "Every few months", ["Never", "Every day"], "Check regularly to stay safe.", 2, 10),
          q("ga-privacy-shield-settings-l2", "q2", "What setting is safest?", "Private", ["Public", "Everyone"], "Private is the safest setting.", 3, 10),
        ]),
      ]),

      unit("ga-privacy-shield", "safe-websites", "Safe Websites", "How to know if a website is safe.", "🌐", "A", [
        lesson("ga-privacy-shield-safe-websites", "l1", "Website Safety Signs", "Safe websites have a lock icon and no spelling mistakes. If a website looks weird, close it and ask an adult.", "A", 1, [
          q("ga-privacy-shield-safe-websites-l1", "q1", "What shows a website is safe?", "A lock icon", ["A clown icon", "A pizza icon"], "The lock icon shows safety.", 1, 10),
          q("ga-privacy-shield-safe-websites-l1", "q2", "What if a website has spelling mistakes?", "Close it and tell an adult", ["Keep using it", "Sign up anyway"], "Spelling mistakes can mean a site is unsafe.", 2, 10),
        ]),
        lesson("ga-privacy-shield-safe-websites", "l2", "Downloading Safely", "Only download apps and games with your parents' permission. Some downloads can hide viruses.", "A", 2, [
          q("ga-privacy-shield-safe-websites-l2", "q1", "Before downloading, you should:", "Ask a parent", ["Download anything", "Only download games"], "Always ask before downloading.", 1, 10),
          q("ga-privacy-shield-safe-websites-l2", "q2", "What can some downloads hide?", "Viruses", ["Candy", "Toys"], "Some downloads can contain viruses.", 2, 10),
        ]),
      ]),

      unit("ga-privacy-shield", "device-security", "Device Security", "Keeping your devices safe.", "📱", "A", [
        lesson("ga-privacy-shield-device-security", "l1", "Locking Your Device", "Always lock your phone or tablet with a password or fingerprint. This keeps strangers from seeing your info if you lose it.", "A", 1, [
          q("ga-privacy-shield-device-security-l1", "q1", "Why should you lock your device?", "To keep strangers from seeing your info", ["To make it look cool", "To save battery"], "Locking protects your information.", 1, 10),
          q("ga-privacy-shield-device-security-l1", "q2", "How can you lock a device?", "Password or fingerprint", ["By throwing it", "By hiding it"], "Passwords and fingerprints lock devices.", 1, 10),
        ]),
        lesson("ga-privacy-shield-device-security", "l2", "Lost Devices", "If you lose your device, tell an adult immediately. They can help you find it and make sure no one uses your info.", "A", 2, [
          q("ga-privacy-shield-device-security-l2", "q1", "If you lose your device, what do you do?", "Tell an adult immediately", ["Keep it secret", "Buy a new one"], "Tell an adult right away.", 1, 10),
          q("ga-privacy-shield-device-security-l2", "q2", "Why is a lost device dangerous?", "Someone might see your personal info", ["It might get lonely", "It might get bored"], "Lost devices can expose your info.", 2, 10),
        ]),
      ]),
    ]),

    // ─────────────────────────────────────────────────────────
    // GROUP B — Ages 8–12
    // ─────────────────────────────────────────────────────────
    section("gb-cybersafe-world", "CyberSafe World", "Understand the digital world.", "🌍", "#4D96FF", "B", [
      unit("gb-cybersafe-world", "how-internet-works", "How the Internet Works", "Learn what happens when you go online.", "🔌", "B", [
        lesson("gb-cybersafe-world-how-internet-works", "l1", "The Internet and You", "When you open a website, your device sends a request to a server. The server sends the website back. This all happens in seconds.", "B", 1, [
          q("gb-cybersafe-world-how-internet-works-l1", "q1", "What happens when you open a website?", "Your device asks a server for the website", ["The website jumps into your screen", "Nothing happens"], "Your device sends a request to a server.", 2, 10),
          q("gb-cybersafe-world-how-internet-works-l1", "q2", "How fast does a website load?", "In seconds", ["In hours", "In days"], "Websites load very quickly.", 2, 10),
          q("gb-cybersafe-world-how-internet-works-l1", "q3", "What is a server?", "A powerful computer that stores websites", ["A type of phone", "A game console"], "Servers store and send website data.", 3, 10),
        ]),
        lesson("gb-cybersafe-world-how-internet-works", "l2", "IP Addresses and DNS", "Every device has an IP address, like a home address for your computer. DNS translates website names to IP addresses.", "B", 2, [
          q("gb-cybersafe-world-how-internet-works-l2", "q1", "An IP address is like:", "A home address for your computer", ["A password", "A username"], "IP addresses identify devices on the internet.", 3, 10),
          q("gb-cybersafe-world-how-internet-works-l2", "q2", "What does DNS do?", "Translates website names to IP addresses", ["Blocks websites", "Creates passwords"], "DNS helps your device find websites by name.", 3, 10),
        ]),
      ]),

      unit("gb-cybersafe-world", "data-privacy", "Data and Privacy", "What is data and why does it matter?", "📊", "B", [
        lesson("gb-cybersafe-world-data-privacy", "l1", "What is Personal Data?", "Personal data is any information about you: name, email, photos, location, school. Companies collect this data and must protect it.", "B", 1, [
          q("gb-cybersafe-world-data-privacy-l1", "q1", "Which of these is personal data?", "Your email address", ["A public news article", "A weather report"], "Email address is personal data.", 2, 10),
          q("gb-cybersafe-world-data-privacy-l1", "q2", "Why do companies collect data?", "To improve their services", ["To give it away freely", "To delete it all"], "Companies use data to improve services.", 3, 10),
          q("gb-cybersafe-world-data-privacy-l1", "q3", "Who is responsible for protecting your data?", "Both you and the companies", ["Only you", "Only the company"], "Both users and companies share responsibility.", 3, 10),
        ]),
        lesson("gb-cybersafe-world-data-privacy", "l2", "Data Brokers and Tracking", "Data brokers collect info from many websites and sell it. They can build a detailed profile of you without your knowledge.", "B", 2, [
          q("gb-cybersafe-world-data-privacy-l2", "q1", "What do data brokers do?", "Collect and sell personal information", ["Give free cookies", "Fix computers"], "Data brokers sell personal information.", 3, 10),
          q("gb-cybersafe-world-data-privacy-l2", "q2", "How can you limit tracking?", "Use privacy settings and ad blockers", ["Share more info", "Click every ad"], "Privacy settings and ad blockers help limit tracking.", 4, 10),
        ]),
      ]),

      unit("gb-cybersafe-world", "digital-footprint", "Digital Footprint", "Your online actions leave a permanent trail.", "👣", "B", [
        lesson("gb-cybersafe-world-digital-footprint", "l1", "Digital Footprint Basics", "You post a photo on a public account. Three weeks later, a stranger screenshots it and uses it in a fake profile. Why does this happen?", "B", 2, [
          q("gb-cybersafe-world-digital-footprint-l1", "q1", "Why can a screenshot of your photo be used later?", "Once something is online, it can be copied and shared beyond your control", ["The app deleted your photo", "Your phone was hacked"], "Digital footprints are permanent.", 2, 10),
          q("gb-cybersafe-world-digital-footprint-l1", "q2", "What is a digital footprint?", "The trail of data you leave online", ["Your physical shoe size", "A type of virus", "A social media app"], "Everything you post creates a digital footprint.", 3, 10),
        ]),
        lesson("gb-cybersafe-world-digital-footprint", "l2", "The Stranger Test", "Before sharing anything online, ask: 'Would I say this to a stranger in real life?' If the answer is no, do not post it.", "B", 3, [
          q("gb-cybersafe-world-digital-footprint-l2", "q1", "The stranger test means:", "Would I say this to a stranger in real life?", ["Ask a stranger for advice", "Test your password strength", "Count your online friends"], "The stranger test is a simple filter for oversharing.", 3, 10),
          q("gb-cybersafe-world-digital-footprint-l2", "q2", "If you would not say it to a stranger, should you post it?", "No", ["Yes, if it is funny", "Only if no one is watching", "It depends"], "If you would not say it to a stranger, do not post it.", 4, 10),
        ]),
      ]),

      unit("gb-cybersafe-world", "online-identity", "Online Identity", "Your online identity is yours to shape.", "👤", "B", [
        lesson("gb-cybersafe-world-online-identity", "l1", "Avatar Creation", "Your online identity is yours to shape. Choose wisely — your avatar represents you in the CyberSafe World and reminds you that your digital self matters.", "B", 1, [
          q("gb-cybersafe-world-online-identity-l1", "q1", "Your avatar represents:", "Your digital self", ["Your real face", "Your password", "Your location"], "Your avatar is your online identity.", 2, 10),
          q("gb-cybersafe-world-online-identity-l1", "q2", "Why does your digital self matter?", "It shapes how others see you online", ["It is not real so it does not matter", "Only adults have digital identities"], "Your online identity matters.", 3, 10),
        ]),
        lesson("gb-cybersafe-world-online-identity", "l2", "PII Classification", "You are signing up for a new game. It asks for your full name, birthdate, and home address. Which combination should you give?", "B", 3, [
          q("gb-cybersafe-world-online-identity-l2", "q1", "What should you share when signing up for a game?", "Only what is required", ["All of it", "Make up a fake name and real address"], "Share only required information.", 3, 10),
          q("gb-cybersafe-world-online-identity-l2", "q2", "When should you share your home address?", "Never without a parent approving", ["Always for delivery", "Only with online friends"], "Never share your address without parental approval.", 4, 10),
        ]),
      ]),
    ]),

    section("gb-bully-blocker", "The Bully Blocker", "Stand up to cyberbullying.", "🛡️", "#FF7A59", "B", [
      unit("gb-bully-blocker", "recognition", "Cyberbullying Recognition", "Identify signs of cyberbullying.", "💬", "B", [
        lesson("gb-bully-blocker-recognition", "l1", "The Invisible Bully", "Someone types something cruel and hits send. In a second, someone else feels small. The worst part? The bully might be a stranger, a 'friend', or completely anonymous. Cyberbullying is real, it is common, and it is not your fault.", "B", 1, [
          q("gb-bully-blocker-recognition-l1", "q1", "Cyberbullying is:", "Being mean online", ["Playing a game", "Sharing a photo"], "Being mean online is cyberbullying.", 2, 10),
          q("gb-bully-blocker-recognition-l1", "q2", "Who can be a cyberbully?", "A stranger, friend, or anonymous person", ["Only strangers", "Only people you know"], "Bullies can be anyone online.", 3, 10),
        ]),
        lesson("gb-bully-blocker-recognition", "l2", "Bystander Choice", "You see a classmate being bullied in a group chat. What do you do?", "B", 3, [
          q("gb-bully-blocker-recognition-l2", "q1", "You see cyberbullying. Best action?", "Privately message the victim, report the bully, and tell a teacher", ["Join in to avoid being targeted", "Ignore it — not my problem"], "Bystanders have power to help.", 3, 10),
          q("gb-bully-blocker-recognition-l2", "q2", "Reporting is:", "Protecting yourself and others", ["Tattling", "Making it worse"], "Reporting is not tattling — it is protecting.", 4, 10),
        ]),
      ]),

      unit("gb-bully-blocker", "response", "Response and Evidence", "How to respond and document cyberbullying.", "📸", "B", [
        lesson("gb-bully-blocker-response", "l1", "Evidence and Report", "Screenshots are evidence. Most platforms have a 'Report' button. Reporting is not tattling — it is protecting yourself and others.", "B", 3, [
          q("gb-bully-blocker-response-l1", "q1", "What is evidence of cyberbullying?", "A screenshot", ["A rumor", "A deleted message"], "Screenshots preserve proof.", 3, 10),
          q("gb-bully-blocker-response-l1", "q2", "Why report cyberbullying?", "To protect yourself and others", ["To get the bully in trouble", "To show off"], "Reporting stops the bully and protects others.", 4, 10),
        ]),
        lesson("gb-bully-blocker-response", "l2", "Platform Response", "You are being cyberbullied in a game chat. The bully is anonymous. What is your best sequence of actions?", "B", 4, [
          q("gb-bully-blocker-response-l2", "q1", "Best sequence?", "Screenshot, block, report, tell an adult", ["Reply with insults, then block", "Delete the game"], "Evidence + block + report + adult is the strongest response.", 4, 10),
        ]),
      ]),
    ]),

    section("gb-phishing-fisher", "The Phishing Fisher", "Catch the scams!", "🎣", "#2BC48A", "B", [
      unit("gb-phishing-fisher", "url-forensics", "URL Forensics", "Evaluate URLs for legitimacy.", "🔍", "B", [
        lesson("gb-phishing-fisher-url-forensics", "l1", "URL Forensics", "You receive a link that looks like your school login. The real school site is your-school.org. Which URL is suspicious?", "B", 2, [
          q("gb-phishing-fisher-url-forensics-l1", "q1", "Which URL is suspicious?", "your-school.secure-login.xyz", ["your-school.org/login", "google.com"], "The domain is wrong.", 3, 10),
          q("gb-phishing-fisher-url-forensics-l1", "q2", "Always check the:", "Real domain before clicking", ["Emoji used", "Time it was sent"], "Check the real domain.", 4, 10),
        ]),
      ]),

      unit("gb-phishing-fisher", "sender-spoofing", "Sender Spoofing", "Scammers can make an email look like it comes from anyone.", "🎭", "B", [
        lesson("gb-phishing-fisher-sender-spoofing", "l1", "Sender Spoofing", "Scammers can make an email look like it comes from anyone. 'From: teacher@school.com' does not mean it is actually from your teacher. Always check the real email address.", "B", 3, [
          q("gb-phishing-fisher-sender-spoofing-l1", "q1", "Never trust the:", "'From' name alone", ["Subject line", "Email length"], "Check the real address.", 3, 10),
          q("gb-phishing-fisher-sender-spoofing-l1", "q2", "A fake sender email might look like:", "teacher@school.com but actually be different", ["A real school address", "A known teacher name"], "Display names can be spoofed.", 4, 10),
        ]),
      ]),

      unit("gb-phishing-fisher", "urgency-trap", "Urgency Trap", "Pressure tactics in scams.", "⏰", "B", [
        lesson("gb-phishing-fisher-urgency-trap", "l1", "Urgency Trap", "A message says 'Your account will be deleted in 1 hour unless you act now.' It asks for your password. What combination of tactics is this?", "B", 4, [
          q("gb-phishing-fisher-urgency-trap-l1", "q1", "This combines:", "Urgency + authority spoofing + credential harvesting", ["A normal update", "A helpful reminder"], "Three red flags at once.", 4, 10),
        ]),
      ]),
    ]),

    section("gb-password-castle", "Password Castle", "Build strong passwords to protect your castle.", "🏰", "#F59E0B", "B", [
      unit("gb-password-castle", "strength", "Password Strength", "Creating and managing secure passwords.", "🔑", "B", [
        lesson("gb-password-castle-strength", "l1", "Password Strength", "A strong password is long, uses uppercase, lowercase, numbers, and symbols. Avoid birthdays, pet names, or common words.", "B", 1, [
          q("gb-password-castle-strength-l1", "q1", "What makes a password strong?", "Length and character variety", ["Short and simple", "Only letters"], "Strong passwords are long and complex.", 2, 10),
          q("gb-password-castle-strength-l1", "q2", "Which is a weak password?", "password123", ["K9#mP2$vL", "Tr0ub4dor&3"], "password123 is common and easy to guess.", 3, 10),
        ]),
        lesson("gb-password-castle-strength", "l2", "Password Managers", "Password managers store all your passwords in one encrypted place. You only need to remember one master password.", "B", 2, [
          q("gb-password-castle-strength-l2", "q1", "What is a password manager?", "A tool that stores passwords securely", ["A notebook", "A friend"], "Password managers securely store passwords.", 3, 10),
          q("gb-password-castle-strength-l2", "q2", "How many passwords should you remember?", "One master password", ["All of them", "Half of them"], "You only need the master password.", 4, 10),
        ]),
      ]),
    ]),

    section("gb-privacy-shield", "Privacy Shield", "Protect your personal information.", "🛡️", "#22C55E", "B", [
      unit("gb-privacy-shield", "wifi-safety", "Public Wi-Fi Safety", "Risks of public networks and how to stay safe.", "📶", "B", [
        lesson("gb-privacy-shield-wifi-safety", "l1", "Public Wi-Fi Risks", "Public Wi-Fi at cafes or airports is convenient but risky. Hackers can intercept data on open networks.", "B", 2, [
          q("gb-privacy-shield-wifi-safety-l1", "q1", "Why is public Wi-Fi risky?", "Hackers can intercept your data", ["It is always fast", "It is free"], "Open networks can be intercepted.", 3, 10),
          q("gb-privacy-shield-wifi-safety-l1", "q2", "What should you avoid on public Wi-Fi?", "Online banking", ["Checking weather", "Reading news"], "Avoid sensitive activities.", 3, 10),
        ]),
        lesson("gb-privacy-shield-wifi-safety", "l2", "Staying Safe on Public Wi-Fi", "Use a VPN, stick to HTTPS sites, and avoid logging into accounts with sensitive info on public networks.", "B", 3, [
          q("gb-privacy-shield-wifi-safety-l2", "q1", "What does VPN stand for?", "Virtual Private Network", ["Very Private Network", "Virtual Public Network"], "VPN creates a secure tunnel.", 4, 10),
          q("gb-privacy-shield-wifi-safety-l2", "q2", "What does HTTPS mean?", "Secure connection to a website", ["A type of virus", "A fast internet"], "HTTPS means the connection is encrypted.", 4, 10),
        ]),
      ]),

      unit("gb-privacy-shield", "scam-recognition", "Scam Recognition", "Spotting scams in games, social media, and messages.", "🚨", "B", [
        lesson("gb-privacy-shield-scam-recognition", "l1", "Gaming Scams", "Scammers offer free skins, coins, or boosts in exchange for your account info. Never share login details for in-game items.", "B", 2, [
          q("gb-privacy-shield-scam-recognition-l1", "q1", "A scam offers free game skins for:", "Your account password", ["Your real name", "Your favorite color"], "Never share login details.", 2, 10),
          q("gb-privacy-shield-scam-recognition-l1", "q2", "If a deal seems too good to be true, it probably is:", "True", ["False", "Maybe"], "If it seems too good to be true, it is likely a scam.", 3, 10),
        ]),
        lesson("gb-privacy-shield-scam-recognition", "l2", "Social Media Scams", "Fake giveaways, fake accounts, and phishing links are common on social media. Verify before you click or share.", "B", 3, [
          q("gb-privacy-shield-scam-recognition-l2", "q1", "A social media giveaway might be a scam if:", "It asks for your password", ["It is from your favorite celebrity", "It has many likes"], "Giveaways should never ask for passwords.", 3, 10),
          q("gb-privacy-shield-scam-recognition-l2", "q2", "What should you do before clicking a social media link?", "Check the URL and sender", ["Click it first", "Share it with friends"], "Check URL and sender before clicking.", 4, 10),
        ]),
      ]),

      unit("gb-privacy-shield", "social-engineering", "Social Engineering", "How attackers manipulate people.", "🎭", "B", [
        lesson("gb-privacy-shield-social-engineering", "l1", "Manipulation Tactics", "Social engineers use urgency, authority, and curiosity to trick you. They might pretend to be IT, a boss, or a friend in trouble.", "B", 2, [
          q("gb-privacy-shield-social-engineering-l1", "q1", "Social engineering is:", "Manipulating people to reveal info", ["Building software", "Teaching social studies"], "It is psychological manipulation.", 3, 10),
          q("gb-privacy-shield-social-engineering-l1", "q2", "A scammer pretends to be IT support. This is:", "Social engineering", ["A normal IT ticket", "A security test"], "Pretending to be someone else is social engineering.", 3, 10),
        ]),
        lesson("gb-privacy-shield-social-engineering", "l2", "Preventing Social Engineering", "Verify identities independently. Never share passwords or sensitive info based on pressure. When in doubt, call the person directly.", "B", 3, [
          q("gb-privacy-shield-social-engineering-l2", "q1", "How do you verify a suspicious request?", "Contact the person through a known channel", ["Do what they ask immediately", "Ignore it completely"], "Verify independently.", 4, 10),
          q("gb-privacy-shield-social-engineering-l2", "q2", "What is a common pressure tactic?", "Urgency: 'Do this now!'", ["Polite request", "Friendly greeting"], "Urgency is a common manipulation tactic.", 4, 10),
        ]),
      ]),
    ]),
  ],
};
