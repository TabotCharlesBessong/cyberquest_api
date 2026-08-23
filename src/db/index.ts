import { Sequelize } from "sequelize";
import config from "../config/config";
import { initUser, User } from "./models/User";
import { initLecture, Lecture } from "./models/Lecture";
import { initLesson, Lesson } from "./models/Lesson";
import { initUnit, Unit } from "./models/Unit";
import { initQuestion, Question } from "./models/Question";
import { initConcept, Concept } from "./models/Concept";
import { initStandard, Standard } from "./models/Standard";
import { initLessonOption, LessonOption } from "./models/LessonOption";
import { initLessonChoice, LessonChoice } from "./models/LessonChoice";
import { initLessonConcept, LessonConcept } from "./models/LessonConcept";
import { initLessonStandard, LessonStandard } from "./models/LessonStandard";
import { initModuleProgress, ModuleProgress } from "./models/ModuleProgress";
import { initLessonProgress, LessonProgress } from "./models/LessonProgress";
import { initBadge, Badge } from "./models/Badge";
import { initUserBadge, associateUserBadge, UserBadge } from "./models/UserBadge";
import { initQuest, Quest } from "./models/Quest";
import { initUserQuest, associateUserQuest, UserQuest } from "./models/UserQuest";
import { initShopItem, ShopItem } from "./models/ShopItem";
import { initUserInventory, associateUserInventory, UserInventory } from "./models/UserInventory";
import { initDailyActivity, associateDailyActivity, DailyActivity } from "./models/DailyActivity";
import { initLeaderboardEntry, associateLeaderboardEntry, LeaderboardEntry } from "./models/LeaderboardEntry";
import { initLeague, associateLeague, League } from "./models/League";
import { initLeagueMembership, associateLeagueMembership, LeagueMembership } from "./models/LeagueMembership";
import { initClassroom, associateClassroom, Classroom } from "./models/Classroom";
import { initClassroomRound, associateClassroomRound, ClassroomRound } from "./models/ClassroomRound";
import { initClassroomParticipant, associateClassroomParticipant, ClassroomParticipant } from "./models/ClassroomParticipant";
import { initEvent, Event } from "./models/Event";
import { initParentalControl, associateParentalControl, ParentalControl } from "./models/ParentalControl";
import logger from "../utils/logger";

export const sequelize =
  config.database.url && config.primaryDb === "supabase"
    ? new Sequelize(config.database.url, {
        dialect: "postgres",
        logging:
          config.env === "development"
            ? (msg) => logger.debug(`[sequelize] ${msg}`, { component: "sequelize" })
            : false,
        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          underscored: false,
          freezeTableName: false,
        },
      })
    : new Sequelize(
        config.database.name || "cyberquest",
        config.database.user || "postgres",
        config.database.password || "postgres",
        {
          host: config.database.host || "localhost",
          port: config.database.port || 5432,
          dialect: "postgres",
          logging:
            config.env === "development"
              ? (msg) => logger.debug(`[sequelize] ${msg}`, { component: "sequelize" })
              : false,
          pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
          },
          define: {
            underscored: false,
            freezeTableName: false,
          },
        }
      );

initUser(sequelize);
initLecture(sequelize);
initLesson(sequelize);
initUnit(sequelize);
initQuestion(sequelize);
initConcept(sequelize);
initStandard(sequelize);
initLessonOption(sequelize);
initLessonChoice(sequelize);
initLessonConcept(sequelize);
initLessonStandard(sequelize);
initModuleProgress(sequelize);
initLessonProgress(sequelize);
initBadge(sequelize);
initUserBadge(sequelize);
initQuest(sequelize);
initUserQuest(sequelize);
initShopItem(sequelize);
initUserInventory(sequelize);
initDailyActivity(sequelize);
initLeaderboardEntry(sequelize);
initLeague(sequelize);
initLeagueMembership(sequelize);
initClassroom(sequelize);
initClassroomRound(sequelize);
initClassroomParticipant(sequelize);
initEvent(sequelize);
initParentalControl(sequelize);

// Lecture ↔ Lesson
Lecture.hasMany(Lesson, {
  foreignKey: "lectureId",
  as: "lessons",
  onDelete: "CASCADE",
});
Lesson.belongsTo(Lecture, { foreignKey: "lectureId", as: "lecture" });

// Lecture (Section) ↔ Unit
Lecture.hasMany(Unit, {
  foreignKey: "sectionId",
  as: "units",
  onDelete: "CASCADE",
});
Unit.belongsTo(Lecture, { foreignKey: "sectionId", as: "section" });

// Unit ↔ Lesson
Unit.hasMany(Lesson, {
  foreignKey: "unitId",
  as: "lessons",
  onDelete: "CASCADE",
});
Lesson.belongsTo(Unit, { foreignKey: "unitId", as: "unit" });

// Lesson ↔ Question
Lesson.hasMany(Question, {
  foreignKey: "lessonId",
  as: "questions",
  onDelete: "CASCADE",
});
Question.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

// Lesson ↔ LessonOption
Lesson.hasMany(LessonOption, {
  foreignKey: "lessonId",
  as: "options",
  onDelete: "CASCADE",
});
LessonOption.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

// Lesson ↔ LessonChoice
Lesson.hasMany(LessonChoice, {
  foreignKey: "lessonId",
  as: "choices",
  onDelete: "CASCADE",
});
LessonChoice.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

// Lesson ↔ Concept (many-to-many via lesson_concepts)
Lesson.belongsToMany(Concept, {
  through: LessonConcept,
  foreignKey: "lessonId",
  otherKey: "conceptId",
  as: "concepts",
});
Concept.belongsToMany(Lesson, {
  through: LessonConcept,
  foreignKey: "conceptId",
  otherKey: "lessonId",
  as: "lessons",
});

// Lesson ↔ Standard (many-to-many via lesson_standards)
Lesson.belongsToMany(Standard, {
  through: LessonStandard,
  foreignKey: "lessonId",
  otherKey: "standardId",
  as: "standards",
});
Standard.belongsToMany(Lesson, {
  through: LessonStandard,
  foreignKey: "standardId",
  otherKey: "lessonId",
  as: "lessons",
});

// User ↔ ModuleProgress
User.hasMany(ModuleProgress, {
  foreignKey: "userId",
  as: "moduleProgress",
  onDelete: "CASCADE",
});
ModuleProgress.belongsTo(User, { foreignKey: "userId", as: "user" });

// Lecture ↔ ModuleProgress
Lecture.hasMany(ModuleProgress, {
  foreignKey: "lectureId",
  as: "moduleProgress",
  onDelete: "CASCADE",
});
ModuleProgress.belongsTo(Lecture, { foreignKey: "lectureId", as: "lecture" });

// User ↔ LessonProgress
User.hasMany(LessonProgress, {
  foreignKey: "userId",
  as: "lessonProgress",
  onDelete: "CASCADE",
});
LessonProgress.belongsTo(User, { foreignKey: "userId", as: "user" });

// Lesson ↔ LessonProgress
Lesson.hasMany(LessonProgress, {
  foreignKey: "lessonId",
  as: "lessonProgress",
  onDelete: "CASCADE",
});
LessonProgress.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

// User ↔ UserBadge ↔ Badge
associateUserBadge();

// User ↔ UserQuest ↔ Quest
associateUserQuest();

// User ↔ UserInventory ↔ ShopItem
associateUserInventory();

// User ↔ DailyActivity
associateDailyActivity();

// Parental controls
associateParentalControl();

// Leaderboard
LeaderboardEntry.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(LeaderboardEntry, { foreignKey: "userId", as: "leaderboardEntries" });

// Leagues
League.hasMany(LeagueMembership, {
  foreignKey: "leagueId",
  as: "memberships",
  onDelete: "CASCADE",
});
LeagueMembership.belongsTo(League, { foreignKey: "leagueId", as: "league" });
LeagueMembership.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(LeagueMembership, { foreignKey: "userId", as: "leagueMemberships" });

// Classrooms
Classroom.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });
User.hasMany(Classroom, { foreignKey: "teacherId", as: "classrooms" });
Classroom.hasMany(ClassroomRound, {
  foreignKey: "classroomId",
  as: "rounds",
  onDelete: "CASCADE",
});
ClassroomRound.belongsTo(Classroom, { foreignKey: "classroomId", as: "classroom" });
ClassroomRound.hasMany(ClassroomParticipant, {
  foreignKey: "roundId",
  as: "participants",
  onDelete: "CASCADE",
});
ClassroomParticipant.belongsTo(ClassroomRound, { foreignKey: "roundId", as: "round" });
ClassroomParticipant.belongsTo(User, { foreignKey: "userId", as: "user" });

export {
  User,
  Lecture,
  Lesson,
  Unit,
  Question,
  Concept,
  Standard,
  LessonOption,
  LessonChoice,
  LessonConcept,
  LessonStandard,
  ModuleProgress,
  LessonProgress,
  Badge,
  UserBadge,
  Quest,
  UserQuest,
  ShopItem,
  UserInventory,
  DailyActivity,
  LeaderboardEntry,
  League,
  LeagueMembership,
  Classroom,
  ClassroomRound,
  ClassroomParticipant,
  Event,
  ParentalControl,
};

