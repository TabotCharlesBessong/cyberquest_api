import { Sequelize } from "sequelize";
import config from "../config/config";
import { initUser, User } from "./models/User";
import { initLecture, Lecture } from "./models/Lecture";
import { initLesson, Lesson } from "./models/Lesson";
import { initConcept, Concept } from "./models/Concept";
import { initStandard, Standard } from "./models/Standard";
import { initLessonOption, LessonOption } from "./models/LessonOption";
import { initLessonChoice, LessonChoice } from "./models/LessonChoice";
import { initLessonConcept, LessonConcept } from "./models/LessonConcept";
import { initLessonStandard, LessonStandard } from "./models/LessonStandard";
import { initModuleProgress, ModuleProgress } from "./models/ModuleProgress";
import { initLessonProgress, LessonProgress } from "./models/LessonProgress";

export const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: "postgres",
    logging:
      config.env === "development"
        ? (msg) => console.log(`[sequelize] ${msg}`)
        : false,
    define: {
      underscored: false,
      freezeTableName: false,
    },
  }
);

initUser(sequelize);
initLecture(sequelize);
initLesson(sequelize);
initConcept(sequelize);
initStandard(sequelize);
initLessonOption(sequelize);
initLessonChoice(sequelize);
initLessonConcept(sequelize);
initLessonStandard(sequelize);
initModuleProgress(sequelize);
initLessonProgress(sequelize);

// Lecture ↔ Lesson
Lecture.hasMany(Lesson, {
  foreignKey: "lectureId",
  as: "lessons",
  onDelete: "CASCADE",
});
Lesson.belongsTo(Lecture, { foreignKey: "lectureId", as: "lecture" });

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

export { User, Lecture, Lesson, Concept, Standard, LessonOption, LessonChoice, LessonConcept, LessonStandard, ModuleProgress, LessonProgress };
