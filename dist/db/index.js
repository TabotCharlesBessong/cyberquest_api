"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentalControl = exports.Event = exports.ClassroomParticipant = exports.ClassroomRound = exports.Classroom = exports.LeagueMembership = exports.League = exports.LeaderboardEntry = exports.DailyActivity = exports.UserInventory = exports.ShopItem = exports.UserQuest = exports.Quest = exports.UserBadge = exports.Badge = exports.LessonProgress = exports.ModuleProgress = exports.LessonStandard = exports.LessonConcept = exports.LessonChoice = exports.LessonOption = exports.Standard = exports.Concept = exports.Question = exports.Unit = exports.Lesson = exports.Lecture = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const User_1 = require("./models/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Lecture_1 = require("./models/Lecture");
Object.defineProperty(exports, "Lecture", { enumerable: true, get: function () { return Lecture_1.Lecture; } });
const Lesson_1 = require("./models/Lesson");
Object.defineProperty(exports, "Lesson", { enumerable: true, get: function () { return Lesson_1.Lesson; } });
const Unit_1 = require("./models/Unit");
Object.defineProperty(exports, "Unit", { enumerable: true, get: function () { return Unit_1.Unit; } });
const Question_1 = require("./models/Question");
Object.defineProperty(exports, "Question", { enumerable: true, get: function () { return Question_1.Question; } });
const Concept_1 = require("./models/Concept");
Object.defineProperty(exports, "Concept", { enumerable: true, get: function () { return Concept_1.Concept; } });
const Standard_1 = require("./models/Standard");
Object.defineProperty(exports, "Standard", { enumerable: true, get: function () { return Standard_1.Standard; } });
const LessonOption_1 = require("./models/LessonOption");
Object.defineProperty(exports, "LessonOption", { enumerable: true, get: function () { return LessonOption_1.LessonOption; } });
const LessonChoice_1 = require("./models/LessonChoice");
Object.defineProperty(exports, "LessonChoice", { enumerable: true, get: function () { return LessonChoice_1.LessonChoice; } });
const LessonConcept_1 = require("./models/LessonConcept");
Object.defineProperty(exports, "LessonConcept", { enumerable: true, get: function () { return LessonConcept_1.LessonConcept; } });
const LessonStandard_1 = require("./models/LessonStandard");
Object.defineProperty(exports, "LessonStandard", { enumerable: true, get: function () { return LessonStandard_1.LessonStandard; } });
const ModuleProgress_1 = require("./models/ModuleProgress");
Object.defineProperty(exports, "ModuleProgress", { enumerable: true, get: function () { return ModuleProgress_1.ModuleProgress; } });
const LessonProgress_1 = require("./models/LessonProgress");
Object.defineProperty(exports, "LessonProgress", { enumerable: true, get: function () { return LessonProgress_1.LessonProgress; } });
const Badge_1 = require("./models/Badge");
Object.defineProperty(exports, "Badge", { enumerable: true, get: function () { return Badge_1.Badge; } });
const UserBadge_1 = require("./models/UserBadge");
Object.defineProperty(exports, "UserBadge", { enumerable: true, get: function () { return UserBadge_1.UserBadge; } });
const Quest_1 = require("./models/Quest");
Object.defineProperty(exports, "Quest", { enumerable: true, get: function () { return Quest_1.Quest; } });
const UserQuest_1 = require("./models/UserQuest");
Object.defineProperty(exports, "UserQuest", { enumerable: true, get: function () { return UserQuest_1.UserQuest; } });
const ShopItem_1 = require("./models/ShopItem");
Object.defineProperty(exports, "ShopItem", { enumerable: true, get: function () { return ShopItem_1.ShopItem; } });
const UserInventory_1 = require("./models/UserInventory");
Object.defineProperty(exports, "UserInventory", { enumerable: true, get: function () { return UserInventory_1.UserInventory; } });
const DailyActivity_1 = require("./models/DailyActivity");
Object.defineProperty(exports, "DailyActivity", { enumerable: true, get: function () { return DailyActivity_1.DailyActivity; } });
const LeaderboardEntry_1 = require("./models/LeaderboardEntry");
Object.defineProperty(exports, "LeaderboardEntry", { enumerable: true, get: function () { return LeaderboardEntry_1.LeaderboardEntry; } });
const League_1 = require("./models/League");
Object.defineProperty(exports, "League", { enumerable: true, get: function () { return League_1.League; } });
const LeagueMembership_1 = require("./models/LeagueMembership");
Object.defineProperty(exports, "LeagueMembership", { enumerable: true, get: function () { return LeagueMembership_1.LeagueMembership; } });
const Classroom_1 = require("./models/Classroom");
Object.defineProperty(exports, "Classroom", { enumerable: true, get: function () { return Classroom_1.Classroom; } });
const ClassroomRound_1 = require("./models/ClassroomRound");
Object.defineProperty(exports, "ClassroomRound", { enumerable: true, get: function () { return ClassroomRound_1.ClassroomRound; } });
const ClassroomParticipant_1 = require("./models/ClassroomParticipant");
Object.defineProperty(exports, "ClassroomParticipant", { enumerable: true, get: function () { return ClassroomParticipant_1.ClassroomParticipant; } });
const Event_1 = require("./models/Event");
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return Event_1.Event; } });
const ParentalControl_1 = require("./models/ParentalControl");
Object.defineProperty(exports, "ParentalControl", { enumerable: true, get: function () { return ParentalControl_1.ParentalControl; } });
const logger_1 = __importDefault(require("../utils/logger"));
exports.sequelize = new sequelize_1.Sequelize(config_1.default.database.name, config_1.default.database.user, config_1.default.database.password, {
    host: config_1.default.database.host,
    port: config_1.default.database.port,
    dialect: "postgres",
    logging: config_1.default.env === "development"
        ? (msg) => logger_1.default.debug(`[sequelize] ${msg}`, { component: "sequelize" })
        : false,
    define: {
        underscored: false,
        freezeTableName: false,
    },
});
(0, User_1.initUser)(exports.sequelize);
(0, Lecture_1.initLecture)(exports.sequelize);
(0, Lesson_1.initLesson)(exports.sequelize);
(0, Unit_1.initUnit)(exports.sequelize);
(0, Question_1.initQuestion)(exports.sequelize);
(0, Concept_1.initConcept)(exports.sequelize);
(0, Standard_1.initStandard)(exports.sequelize);
(0, LessonOption_1.initLessonOption)(exports.sequelize);
(0, LessonChoice_1.initLessonChoice)(exports.sequelize);
(0, LessonConcept_1.initLessonConcept)(exports.sequelize);
(0, LessonStandard_1.initLessonStandard)(exports.sequelize);
(0, ModuleProgress_1.initModuleProgress)(exports.sequelize);
(0, LessonProgress_1.initLessonProgress)(exports.sequelize);
(0, Badge_1.initBadge)(exports.sequelize);
(0, UserBadge_1.initUserBadge)(exports.sequelize);
(0, Quest_1.initQuest)(exports.sequelize);
(0, UserQuest_1.initUserQuest)(exports.sequelize);
(0, ShopItem_1.initShopItem)(exports.sequelize);
(0, UserInventory_1.initUserInventory)(exports.sequelize);
(0, DailyActivity_1.initDailyActivity)(exports.sequelize);
(0, LeaderboardEntry_1.initLeaderboardEntry)(exports.sequelize);
(0, League_1.initLeague)(exports.sequelize);
(0, LeagueMembership_1.initLeagueMembership)(exports.sequelize);
(0, Classroom_1.initClassroom)(exports.sequelize);
(0, ClassroomRound_1.initClassroomRound)(exports.sequelize);
(0, ClassroomParticipant_1.initClassroomParticipant)(exports.sequelize);
(0, Event_1.initEvent)(exports.sequelize);
(0, ParentalControl_1.initParentalControl)(exports.sequelize);
// Lecture ↔ Lesson
Lecture_1.Lecture.hasMany(Lesson_1.Lesson, {
    foreignKey: "lectureId",
    as: "lessons",
    onDelete: "CASCADE",
});
Lesson_1.Lesson.belongsTo(Lecture_1.Lecture, { foreignKey: "lectureId", as: "lecture" });
// Lecture (Section) ↔ Unit
Lecture_1.Lecture.hasMany(Unit_1.Unit, {
    foreignKey: "sectionId",
    as: "units",
    onDelete: "CASCADE",
});
Unit_1.Unit.belongsTo(Lecture_1.Lecture, { foreignKey: "sectionId", as: "section" });
// Unit ↔ Lesson
Unit_1.Unit.hasMany(Lesson_1.Lesson, {
    foreignKey: "unitId",
    as: "lessons",
    onDelete: "CASCADE",
});
Lesson_1.Lesson.belongsTo(Unit_1.Unit, { foreignKey: "unitId", as: "unit" });
// Lesson ↔ Question
Lesson_1.Lesson.hasMany(Question_1.Question, {
    foreignKey: "lessonId",
    as: "questions",
    onDelete: "CASCADE",
});
Question_1.Question.belongsTo(Lesson_1.Lesson, { foreignKey: "lessonId", as: "lesson" });
// Lesson ↔ LessonOption
Lesson_1.Lesson.hasMany(LessonOption_1.LessonOption, {
    foreignKey: "lessonId",
    as: "options",
    onDelete: "CASCADE",
});
LessonOption_1.LessonOption.belongsTo(Lesson_1.Lesson, { foreignKey: "lessonId", as: "lesson" });
// Lesson ↔ LessonChoice
Lesson_1.Lesson.hasMany(LessonChoice_1.LessonChoice, {
    foreignKey: "lessonId",
    as: "choices",
    onDelete: "CASCADE",
});
LessonChoice_1.LessonChoice.belongsTo(Lesson_1.Lesson, { foreignKey: "lessonId", as: "lesson" });
// Lesson ↔ Concept (many-to-many via lesson_concepts)
Lesson_1.Lesson.belongsToMany(Concept_1.Concept, {
    through: LessonConcept_1.LessonConcept,
    foreignKey: "lessonId",
    otherKey: "conceptId",
    as: "concepts",
});
Concept_1.Concept.belongsToMany(Lesson_1.Lesson, {
    through: LessonConcept_1.LessonConcept,
    foreignKey: "conceptId",
    otherKey: "lessonId",
    as: "lessons",
});
// Lesson ↔ Standard (many-to-many via lesson_standards)
Lesson_1.Lesson.belongsToMany(Standard_1.Standard, {
    through: LessonStandard_1.LessonStandard,
    foreignKey: "lessonId",
    otherKey: "standardId",
    as: "standards",
});
Standard_1.Standard.belongsToMany(Lesson_1.Lesson, {
    through: LessonStandard_1.LessonStandard,
    foreignKey: "standardId",
    otherKey: "lessonId",
    as: "lessons",
});
// User ↔ ModuleProgress
User_1.User.hasMany(ModuleProgress_1.ModuleProgress, {
    foreignKey: "userId",
    as: "moduleProgress",
    onDelete: "CASCADE",
});
ModuleProgress_1.ModuleProgress.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
// Lecture ↔ ModuleProgress
Lecture_1.Lecture.hasMany(ModuleProgress_1.ModuleProgress, {
    foreignKey: "lectureId",
    as: "moduleProgress",
    onDelete: "CASCADE",
});
ModuleProgress_1.ModuleProgress.belongsTo(Lecture_1.Lecture, { foreignKey: "lectureId", as: "lecture" });
// User ↔ LessonProgress
User_1.User.hasMany(LessonProgress_1.LessonProgress, {
    foreignKey: "userId",
    as: "lessonProgress",
    onDelete: "CASCADE",
});
LessonProgress_1.LessonProgress.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
// Lesson ↔ LessonProgress
Lesson_1.Lesson.hasMany(LessonProgress_1.LessonProgress, {
    foreignKey: "lessonId",
    as: "lessonProgress",
    onDelete: "CASCADE",
});
LessonProgress_1.LessonProgress.belongsTo(Lesson_1.Lesson, { foreignKey: "lessonId", as: "lesson" });
// User ↔ UserBadge ↔ Badge
(0, UserBadge_1.associateUserBadge)();
// User ↔ UserQuest ↔ Quest
(0, UserQuest_1.associateUserQuest)();
// User ↔ UserInventory ↔ ShopItem
(0, UserInventory_1.associateUserInventory)();
// User ↔ DailyActivity
(0, DailyActivity_1.associateDailyActivity)();
// Parental controls
(0, ParentalControl_1.associateParentalControl)();
// Leaderboard
LeaderboardEntry_1.LeaderboardEntry.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
User_1.User.hasMany(LeaderboardEntry_1.LeaderboardEntry, { foreignKey: "userId", as: "leaderboardEntries" });
// Leagues
League_1.League.hasMany(LeagueMembership_1.LeagueMembership, {
    foreignKey: "leagueId",
    as: "memberships",
    onDelete: "CASCADE",
});
LeagueMembership_1.LeagueMembership.belongsTo(League_1.League, { foreignKey: "leagueId", as: "league" });
LeagueMembership_1.LeagueMembership.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
User_1.User.hasMany(LeagueMembership_1.LeagueMembership, { foreignKey: "userId", as: "leagueMemberships" });
// Classrooms
Classroom_1.Classroom.belongsTo(User_1.User, { foreignKey: "teacherId", as: "teacher" });
User_1.User.hasMany(Classroom_1.Classroom, { foreignKey: "teacherId", as: "classrooms" });
Classroom_1.Classroom.hasMany(ClassroomRound_1.ClassroomRound, {
    foreignKey: "classroomId",
    as: "rounds",
    onDelete: "CASCADE",
});
ClassroomRound_1.ClassroomRound.belongsTo(Classroom_1.Classroom, { foreignKey: "classroomId", as: "classroom" });
ClassroomRound_1.ClassroomRound.hasMany(ClassroomParticipant_1.ClassroomParticipant, {
    foreignKey: "roundId",
    as: "participants",
    onDelete: "CASCADE",
});
ClassroomParticipant_1.ClassroomParticipant.belongsTo(ClassroomRound_1.ClassroomRound, { foreignKey: "roundId", as: "round" });
ClassroomParticipant_1.ClassroomParticipant.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
//# sourceMappingURL=index.js.map