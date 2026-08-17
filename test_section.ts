
type QuestionDef = {
  id: string;
  question: string;
  correct: string;
  wrongs: string[];
  explanation: string;
};

type LessonDef = {
  id: string;
  title: string;
  notes: string;
  missionBriefing?: string;
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
    ,
      {
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
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q2",
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
            },{
              id: "q3",
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
            },{
              id: "q4",
              type: "mcq",
              question: "Question 4 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q5",
              type: "mcq",
              question: "Question 5 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q6",
              type: "mcq",
              question: "Question 6 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q7",
              type: "mcq",
              question: "Question 7 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 2! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            difficulty: 4,
            questions: [
              {
              id: "q1",
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
            },{
              id: "q2",
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
            },{
              id: "q3",
              type: "mcq",
              question: "Question 3 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q4",
              type: "mcq",
              question: "Question 4 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q5",
              type: "mcq",
              question: "Question 5 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q6",
              type: "mcq",
              question: "Question 6 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q8",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 3! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            difficulty: 2,
            questions: [
              {
              id: "q1",
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
            },{
              id: "q2",
              type: "mcq",
              question: "Question 2 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q3",
              type: "mcq",
              question: "Question 3 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q4",
              type: "mcq",
              question: "Question 4 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q5",
              type: "mcq",
              question: "Question 5 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q7",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 4! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "Question 1 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q2",
              type: "mcq",
              question: "Question 2 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q3",
              type: "mcq",
              question: "Question 3 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q4",
              type: "mcq",
              question: "Question 4 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q6",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q8",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 5! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "Question 1 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q2",
              type: "mcq",
              question: "Question 2 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q3",
              type: "mcq",
              question: "Question 3 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q5",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q7",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q8",
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
            }
            ],
          }
        ],
      },
      {
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
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "Question 1 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q2",
              type: "mcq",
              question: "Question 2 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q4",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q6",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q7",
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
            },{
              id: "q8",
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
            }
            ],
          },{
            id: "l2",
            title: "Lesson 2: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 2! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "mcq",
              question: "Question 1 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q3",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q5",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q6",
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
            },{
              id: "q7",
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
            },{
              id: "q8",
              type: "mcq",
              question: "Question 8 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            }
            ],
          },{
            id: "l3",
            title: "Lesson 3: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 3! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            difficulty: 3,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q2",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q4",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q5",
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
            },{
              id: "q6",
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
            },{
              id: "q7",
              type: "mcq",
              question: "Question 7 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q8",
              type: "mcq",
              question: "Question 8 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            }
            ],
          },{
            id: "l4",
            title: "Lesson 4: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 4! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            difficulty: 4,
            questions: [
              {
              id: "q1",
              type: "matching",
              question: "Match the terms related to this lesson:",
              pairs: [
                { left: "Term A", right: "Definition A" },
                { left: "Term B", right: "Definition B" },
                { left: "Term C", right: "Definition C" },
              ],
              explanation: "Matching helps you understand key concepts.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q3",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q4",
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
            },{
              id: "q5",
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
            },{
              id: "q6",
              type: "mcq",
              question: "Question 6 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q7",
              type: "mcq",
              question: "Question 7 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q8",
              type: "mcq",
              question: "Question 8 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            }
            ],
          },{
            id: "l5",
            title: "Lesson 5: Learning More",
            notes: "This lesson teaches important safety skills for young learners. You will learn through stories and questions that help you remember what to do online. Ask a trusted adult if you have questions!",
            missionBriefing: "🎯 Mission: Safety Scout 5! Your mission is to learn about this topic and complete the challenges. Listen carefully and do your best!",
            difficulty: 2,
            questions: [
              {
              id: "q1",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q2",
              type: "sentence_builder",
              question: "Build the important rule:",
              sentenceParts: ["Always", "think", "before", "you", "act", "online"],
              correctSentence: "Always think before you act online",
              explanation: "This rule helps you make safe choices.",
            },{
              id: "q3",
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
            },{
              id: "q4",
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
            },{
              id: "q5",
              type: "mcq",
              question: "Question 5 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q6",
              type: "mcq",
              question: "Question 6 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q7",
              type: "mcq",
              question: "Question 7 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            },{
              id: "q8",
              type: "mcq",
              question: "Question 8 about this lesson's topic?",
              correct: "The correct choice",
              wrongs: ["Wrong choice A", "Wrong choice B", "Wrong choice C"],
              explanation: "This is the correct explanation for the answer.",
            }
            ],
          }
        ],
      }],
  },
  {

];
