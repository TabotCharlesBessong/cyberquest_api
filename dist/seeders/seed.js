"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_1 = require("../db");
const curriculumSeed_1 = require("./curriculumSeed");
const logger_1 = __importDefault(require("../utils/logger"));
const CONCEPT_DESCRIPTIONS = {
    internet_awareness: "Understanding the internet as a global network with both safe and unsafe areas",
    digital_footprint: "The permanent trail of data created by online activity",
    data_footprint: "The trail of personal information left behind through posts, comments, and shares",
    module_intro: "Introduction to the current module's theme and objectives",
    pii_basics: "Understanding what constitutes personally identifiable information",
    stranger_online: "Recognising risks associated with interacting with unknown people online",
    tell_adult: "Knowing when and how to seek help from a trusted adult",
    real_world_bridge: "Connecting online learning to offline safety habits",
    online_identity: "Understanding that your digital persona is still you",
    avatar_safety: "Using avatars responsibly without hiding behind them to harm others",
    stranger_test: "The 'Would I say this to a stranger in real life?' filter for online sharing",
    cyberbullying_definition: "Recognising that online cruelty is still bullying",
    cyberbullying_recognition: "Identifying signs of cyberbullying",
    cyberbullying_response: "Knowing the correct response steps when bullied online",
    bystander_intervention: "Understanding the role and power of bystanders in stopping bullying",
    platform_tools: "Using platform features like block, report, and screenshot",
    anonymity_risk: "Understanding that anonymity online does not make behaviour acceptable",
    empathy: "Developing empathy for targets while maintaining boundaries",
    reporting_flow: "Understanding how platform reporting systems work",
    phishing_hooks: "Recognising bait messages that trick people into clicking or sharing",
    suspicious_links: "Identifying and avoiding dangerous or unknown links",
    phishing_awareness: "Overall awareness of phishing tactics and prevention",
    url_analysis: "Reading and evaluating URLs for legitimacy",
    sender_spoofing: "Understanding that display names can be faked",
    urgency_tactics: "Recognising pressure tactics used in scams",
    password_strength: "Creating and maintaining strong passwords",
    password_basics: "Fundamental understanding of what passwords are and why they matter",
    password_entropy: "Understanding that length and randomness matter more than complexity alone",
    password_sharing: "Never sharing passwords with anyone, including friends and family",
    password_manager: "Using a password manager to store unique passwords securely",
    password_reuse: "The risk of using the same password across multiple accounts",
    two_factor_auth: "Adding a second layer of authentication for account security",
    data_breach_response: "What to do when a service you use has a data breach",
    social_engineering: "Recognising manipulation tactics used to extract credentials",
    private_info: "Understanding what personal information must be protected",
    oversharing: "Recognising and avoiding excessive personal disclosure online",
    photo_privacy: "Understanding how photos can reveal more information than intended",
    privacy_settings: "Using app and platform privacy controls effectively",
    stranger_danger: "Recognising and responding to dangerous requests from strangers",
    privacy_basics: "Fundamental understanding of digital privacy rights",
    location_safety: "Protecting physical location information from being exposed online",
    geotagging: "Understanding hidden location metadata in photos and how to disable it",
    app_permissions: "Evaluating and controlling what apps can access on your device",
    data_collection: "Questioning why apps and services collect personal data",
    grooming_awareness: "Recognising patterns of manipulation and grooming by strangers",
    manipulation_tactics: "Identifying emotional manipulation and pressure techniques online",
    trusted_adults: "Identifying which adults are appropriate to approach for help",
    graduation: "Completion of all modules and readiness for certification",
    badge_earned: "Achievement recognition for completing the programme",
    leaderboard: "Competitive ranking system for gamified progress",
    magic_door_rule: "Closing the door on strangers who ask for private information",
    digital_identity: "Understanding and shaping your online persona",
    pii_classification: "Classifying information by sensitivity and risk",
};
const STANDARD_DESCRIPTIONS = {
    "ISTE 1.2.a": "Students cultivate and manage their digital identity and reputation",
    "ISTE 1.2.b": "Students engage in positive, safe, legal, and ethical behaviour when using technology",
    "ISTE 1.3.d": "Students build knowledge by actively exploring real-world issues and problems",
};
const SEED_BADGES = [
    {
        key: "first_lesson",
        name: "First Steps",
        description: "Complete your first lesson",
        icon: "👣",
        rarity: "common",
        criteria: "complete_first_lesson",
        xpReward: 10,
        gemsReward: 5,
        isActive: true,
    },
    {
        key: "module_master",
        name: "Module Master",
        description: "Complete any module",
        icon: "🏆",
        rarity: "rare",
        criteria: "complete_one_module",
        xpReward: 50,
        gemsReward: 25,
        isActive: true,
    },
    {
        key: "streak_3",
        name: "On Fire",
        description: "Maintain a 3-day streak",
        icon: "🔥",
        rarity: "common",
        criteria: "streak_3_days",
        xpReward: 20,
        gemsReward: 10,
        isActive: true,
    },
    {
        key: "streak_7",
        name: "Unstoppable",
        description: "Maintain a 7-day streak",
        icon: "⚡",
        rarity: "rare",
        criteria: "streak_7_days",
        xpReward: 100,
        gemsReward: 50,
        isActive: true,
    },
    {
        key: "level_5",
        name: "Rising Star",
        description: "Reach level 5",
        icon: "⭐",
        rarity: "rare",
        criteria: "reach_level_5",
        xpReward: 50,
        gemsReward: 25,
        isActive: true,
    },
    {
        key: "xp_500",
        name: "XP Collector",
        description: "Earn 500 total XP",
        icon: "💎",
        rarity: "epic",
        criteria: "earn_500_xp",
        xpReward: 100,
        gemsReward: 50,
        isActive: true,
    },
    {
        key: "perfect_quiz",
        name: "Perfect Score",
        description: "Score 100% on a quiz",
        icon: "🎯",
        rarity: "rare",
        criteria: "perfect_quiz_score",
        xpReward: 30,
        gemsReward: 15,
        isActive: true,
    },
    {
        key: "explorer",
        name: "Explorer",
        description: "Complete the first module",
        icon: "🗺️",
        rarity: "common",
        criteria: "complete_first_module",
        xpReward: 25,
        gemsReward: 10,
        isActive: true,
    },
];
const SEED_QUESTS = [
    {
        key: "complete_1_lesson",
        type: "daily",
        title: "First Lesson",
        description: "Complete 1 lesson today",
        target: 1,
        xpReward: 15,
        gemsReward: 5,
        isActive: true,
    },
    {
        key: "complete_3_lessons",
        type: "daily",
        title: "Lesson Marathon",
        description: "Complete 3 lessons today",
        target: 3,
        xpReward: 45,
        gemsReward: 15,
        isActive: true,
    },
    {
        key: "win_2_quizzes",
        type: "daily",
        title: "Quiz Master",
        description: "Pass 2 quizzes today",
        target: 2,
        xpReward: 30,
        gemsReward: 10,
        isActive: true,
    },
    {
        key: "earn_50_xp",
        type: "daily",
        title: "XP Grinder",
        description: "Earn 50 XP today",
        target: 50,
        xpReward: 20,
        gemsReward: 8,
        isActive: true,
    },
];
const SEED_SHOP_ITEMS = [
    {
        key: "hero_cape",
        name: "Hero Cape",
        description: "A shiny cape for your avatar",
        type: "avatar",
        cost: 50,
        costType: "gems",
        effect: "🦸",
        icon: "🦸",
        rarity: "rare",
        isActive: true,
    },
    {
        key: "wizard_hat",
        name: "Wizard Hat",
        description: "A magical wizard hat",
        type: "avatar",
        cost: 75,
        costType: "gems",
        effect: "🧙",
        icon: "🧙",
        rarity: "epic",
        isActive: true,
    },
    {
        key: "glowing_wings",
        name: "Glowing Wings",
        description: "Sparkling fairy wings",
        type: "avatar",
        cost: 100,
        costType: "gems",
        effect: "🧚",
        icon: "🧚",
        rarity: "legendary",
        isActive: true,
    },
    {
        key: "rockstar_guitar",
        name: "Rockstar Guitar",
        description: "Shred on a cool guitar",
        type: "avatar",
        cost: 120,
        costType: "gems",
        effect: "🎸",
        icon: "🎸",
        rarity: "legendary",
        isActive: true,
    },
    {
        key: "heart_refill",
        name: "Heart Refill",
        description: "Restore 5 hearts",
        type: "consumable",
        cost: 20,
        costType: "gems",
        effect: '{"hearts": 5}',
        icon: "❤️",
        rarity: "common",
        isActive: true,
    },
    {
        key: "xp_boost",
        name: "XP Boost",
        description: "Double XP for next lesson",
        type: "powerup",
        cost: 30,
        costType: "gems",
        effect: '{"xpMultiplier": 2}',
        icon: "🚀",
        rarity: "rare",
        isActive: true,
    },
];
async function seed() {
    try {
        await db_1.sequelize.authenticate();
        logger_1.default.info("Connected to database for seeding", { component: "seed" });
        const conceptCache = new Map();
        const standardCache = new Map();
        for (const section of curriculumSeed_1.CURRICULUM.sections) {
            const [createdSection] = await db_1.Lecture.findOrCreate({
                where: { slug: section.id },
                defaults: {
                    slug: section.id,
                    title: section.title,
                    subtitle: section.description,
                    icon: section.icon,
                    color: section.color,
                    badge: "⭐",
                    badgeName: "Module",
                    order: section.order,
                    ageGroup: section.ageGroup,
                },
            });
            await createdSection.update({
                title: section.title,
                subtitle: section.description,
                icon: section.icon,
                color: section.color,
                order: section.order,
                ageGroup: section.ageGroup,
            });
            for (const unit of section.units) {
                const [createdUnit] = await db_1.Unit.findOrCreate({
                    where: { slug: unit.id },
                    defaults: {
                        sectionId: createdSection.id,
                        slug: unit.id,
                        title: unit.title,
                        description: unit.description,
                        icon: unit.icon,
                        order: unit.order,
                        ageGroup: unit.ageGroup,
                    },
                });
                await createdUnit.update({
                    title: unit.title,
                    description: unit.description,
                    icon: unit.icon,
                    order: unit.order,
                    ageGroup: unit.ageGroup,
                });
                for (const lesson of unit.lessons) {
                    const [createdLesson] = await db_1.Lesson.findOrCreate({
                        where: { stepId: lesson.id },
                        defaults: {
                            unitId: createdUnit.id,
                            lectureId: createdSection.id,
                            stepId: lesson.id,
                            type: "quiz",
                            title: lesson.title,
                            notes: lesson.notes,
                            order: lesson.order,
                            ageGroup: lesson.ageGroup,
                            difficulty: lesson.difficulty,
                        },
                    });
                    await createdLesson.update({
                        title: lesson.title,
                        notes: lesson.notes,
                        missionBriefing: lesson.missionBriefing,
                        order: lesson.order,
                        ageGroup: lesson.ageGroup,
                        difficulty: lesson.difficulty,
                    });
                    for (const q of lesson.questions) {
                        const [question] = await db_1.Question.findOrCreate({
                            where: { slug: q.id },
                            defaults: {
                                lessonId: createdLesson.id,
                                slug: q.id,
                                type: q.type,
                                question: q.question,
                                options: q.options ?? [],
                                correctIndex: q.correctIndex ?? null,
                                pairs: q.pairs,
                                sentenceParts: q.sentenceParts,
                                correctSentence: q.correctSentence,
                                investigationSteps: q.investigationSteps,
                                correctOrder: q.correctOrder,
                                explanation: q.explanation,
                                difficulty: q.difficulty,
                                xpReward: q.xpReward,
                            },
                        });
                        await question.update({
                            type: q.type,
                            question: q.question,
                            options: q.options ?? [],
                            correctIndex: q.correctIndex ?? null,
                            pairs: q.pairs,
                            sentenceParts: q.sentenceParts,
                            correctSentence: q.correctSentence,
                            investigationSteps: q.investigationSteps,
                            correctOrder: q.correctOrder,
                            explanation: q.explanation,
                            difficulty: q.difficulty,
                            xpReward: q.xpReward,
                        });
                    }
                }
                logger_1.default.info("Seeded unit", {
                    component: "seed",
                    unitTitle: unit.title,
                    lessonCount: unit.lessons.length,
                });
            }
            logger_1.default.info("Seeded section", {
                component: "seed",
                sectionTitle: section.title,
                unitCount: section.units.length,
            });
        }
        for (const badge of SEED_BADGES) {
            await db_1.Badge.findOrCreate({
                where: { key: badge.key },
                defaults: badge,
            });
        }
        for (const quest of SEED_QUESTS) {
            await db_1.Quest.findOrCreate({
                where: { key: quest.key },
                defaults: quest,
            });
        }
        for (const item of SEED_SHOP_ITEMS) {
            await db_1.ShopItem.findOrCreate({
                where: { key: item.key },
                defaults: item,
            });
        }
        const [demoUser] = await db_1.User.findOrCreate({
            where: { email: "demo@cyberquest.app" },
            defaults: {
                name: "Demo User",
                email: "demo@cyberquest.app",
                password: "demo123",
                age: 10,
                ageGroup: "B",
                avatar: "🦊",
                xp: 0,
                level: 1,
                streak: 0,
                hearts: 5,
                gems: 100,
                onboarded: true,
                isVerified: true,
            },
        });
        logger_1.default.info("Seed completed successfully", { component: "seed" });
    }
    catch (err) {
        logger_1.default.error("Seed failed", {
            component: "seed",
            error: err instanceof Error ? err.message : "Unknown error",
        });
        process.exit(1);
    }
    finally {
        await db_1.sequelize.close();
    }
}
void seed();
//# sourceMappingURL=seed.js.map