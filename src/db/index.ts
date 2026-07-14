import { Sequelize } from "sequelize";
import config from "../config/config";
import { initUser, User } from "./models/User";
import { initLecture, Lecture } from "./models/Lecture";
import { initLesson, Lesson } from "./models/Lesson";

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

// Relationships
Lecture.hasMany(Lesson, {
  foreignKey: "lectureId",
  as: "lessons",
  onDelete: "CASCADE",
});
Lesson.belongsTo(Lecture, { foreignKey: "lectureId", as: "lecture" });

export { User, Lecture, Lesson };
