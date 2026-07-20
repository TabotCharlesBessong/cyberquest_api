import "dotenv/config";
import {
  sequelize,
  Lecture,
  Lesson,
  Concept,
  Standard,
  LessonOption,
  LessonChoice,
  LessonConcept,
  LessonStandard,
} from "../db";
import { SEED_LECTURES } from "./curriculumData";

const CONCEPT_DESCRIPTIONS: Record<string, string> = {
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

const STANDARD_DESCRIPTIONS: Record<string, string> = {
  "ISTE 1.2.a": "Students cultivate and manage their digital identity and reputation",
  "ISTE 1.2.b": "Students engage in positive, safe, legal, and ethical behaviour when using technology",
  "ISTE 1.3.d": "Students build knowledge by actively exploring real-world issues and problems",
};

async function seed(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("[seed] Connected to PostgreSQL");

    await sequelize.sync({ alter: true });
    console.log("[seed] Models synchronized");

    // Reset existing data
    await LessonOption.destroy({ where: {}, truncate: true, cascade: true });
    await LessonChoice.destroy({ where: {}, truncate: true, cascade: true });
    await LessonConcept.destroy({ where: {}, truncate: true, cascade: true });
    await LessonStandard.destroy({ where: {}, truncate: true, cascade: true });
    await Concept.destroy({ where: {}, truncate: true, cascade: true });
    await Standard.destroy({ where: {}, truncate: true, cascade: true });
    await Lesson.destroy({ where: {}, truncate: true, cascade: true });
    await Lecture.destroy({ where: {}, truncate: true, cascade: true });

    const conceptCache = new Map<string, string>();
    const standardCache = new Map<string, string>();

    for (const lecture of SEED_LECTURES) {
      const createdLecture = await Lecture.create({
        slug: lecture.slug,
        title: lecture.title,
        subtitle: lecture.subtitle,
        icon: lecture.icon,
        color: lecture.color,
        badge: lecture.badge,
        badgeName: lecture.badgeName,
        order: lecture.order,
      });

      const createdLessons = await Lesson.bulkCreate(
        lecture.lessons.map((lesson, index) => {
          const data: Record<string, unknown> = {
            lectureId: createdLecture.id,
            stepId: lesson.stepId,
            type: lesson.type,
            title: lesson.title,
            order: index + 1,
          };
          if (lesson.text !== undefined) data.text = lesson.text;
          if (lesson.question !== undefined) data.question = lesson.question;
          if (lesson.answer !== undefined) data.answer = lesson.answer;
          if (lesson.explanation !== undefined) data.explanation = lesson.explanation;
          if (lesson.icon !== undefined) data.icon = lesson.icon;
          if (lesson.mascot !== undefined) data.mascot = lesson.mascot;
          if (lesson.speech !== undefined) data.speech = lesson.speech;
          if (lesson.ageGroup !== undefined) data.ageGroup = lesson.ageGroup;
          if (lesson.depthLevel !== undefined) data.depthLevel = lesson.depthLevel;
          if (lesson.learningObjectives !== undefined) data.learningObjectives = lesson.learningObjectives;
          if (lesson.successCriteria !== undefined) data.successCriteria = lesson.successCriteria;
          if (lesson.activityType !== undefined) data.activityType = lesson.activityType;
          if (lesson.materials !== undefined) data.materials = lesson.materials;
          return data as any;
        })
      );

      // Populate normalized tables
      for (let i = 0; i < lecture.lessons.length; i++) {
        const lesson = lecture.lessons[i];
        const lessonId = createdLessons[i].id;

        // Options
        if (lesson.options) {
          const optionRecords = lesson.options.map((text, pos) => ({
            lessonId,
            position: pos,
            text,
          }));
          await LessonOption.bulkCreate(optionRecords as any);
        }

        // Choices
        if (lesson.choices) {
          const choiceRecords = lesson.choices.map((c, pos) => ({
            lessonId,
            position: pos,
            text: c.text,
            feedback: c.feedback,
            consequence: c.consequence,
            xpDelta: c.xpDelta ?? null,
          }));
          await LessonChoice.bulkCreate(choiceRecords as any);
        }

        // Concepts
        if (lesson.conceptKeys) {
          for (const code of lesson.conceptKeys) {
            let conceptId = conceptCache.get(code);
            if (!conceptId) {
              const description = CONCEPT_DESCRIPTIONS[code] || null;
              const concept = await Concept.findOrCreate({
                where: { code },
                defaults: { code, description },
              });
              conceptId = concept[0].id;
              conceptCache.set(code, conceptId);
            }
            await LessonConcept.findOrCreate({
              where: { lessonId, conceptId: conceptId as string },
            });
          }
        }

        // Standards
        if (lesson.connexusStandards) {
          for (const code of lesson.connexusStandards) {
            let standardId = standardCache.get(code);
            if (!standardId) {
              const description = STANDARD_DESCRIPTIONS[code] || null;
              const standard = await Standard.findOrCreate({
                where: { code },
                defaults: { code, description },
              });
              standardId = standard[0].id;
              standardCache.set(code, standardId);
            }
            await LessonStandard.findOrCreate({
              where: { lessonId, standardId: standardId as string },
            });
          }
        }
      }

      console.log(`[seed] Seeded lecture: ${lecture.title}`);
    }

    console.log("[seed] Done 🎉");
  } catch (err) {
    console.error("[seed] Failed:", err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

void seed();
