"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const lectureRoutes_1 = __importDefault(require("./routes/lectureRoutes"));
const curriculumRoutes_1 = __importDefault(require("./routes/curriculumRoutes"));
const adminCurriculumRoutes_1 = __importDefault(require("./routes/adminCurriculumRoutes"));
const adminUnitRoutes_1 = __importDefault(require("./routes/adminUnitRoutes"));
const adminLessonRoutes_1 = __importDefault(require("./routes/adminLessonRoutes"));
const adminQuestionRoutes_1 = __importDefault(require("./routes/adminQuestionRoutes"));
const adminImportExportRoutes_1 = __importDefault(require("./routes/adminImportExportRoutes"));
const adminStatsRoutes_1 = __importDefault(require("./routes/adminStatsRoutes"));
const adminUserRoutes_1 = __importDefault(require("./routes/adminUserRoutes"));
const adminParentalRoutes_1 = __importDefault(require("./routes/adminParentalRoutes"));
const progressRoutes_1 = __importDefault(require("./routes/progressRoutes"));
const gamificationRoutes_1 = __importDefault(require("./routes/gamificationRoutes"));
const shopRoutes_1 = __importDefault(require("./routes/shopRoutes"));
const leaderboardRoutes_1 = __importDefault(require("./routes/leaderboardRoutes"));
const leagueRoutes_1 = __importDefault(require("./routes/leagueRoutes"));
const classroomRoutes_1 = __importDefault(require("./routes/classroomRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
const swagger_1 = require("./config/swagger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:4000",
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:19006",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:4000",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:19006",
    "http://127.0.0.1:5173",
];
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(requestLogger_1.requestLogger);
    app.get("/health", (_req, res) => {
        res.status(200).json({ success: true, message: "CyberQuest API is up" });
    });
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs));
    app.use("/api/auth", authRoutes_1.default);
    app.use("/api/lectures", lectureRoutes_1.default);
    app.use("/api/curriculum", curriculumRoutes_1.default);
    app.use("/api/admin/curriculum", adminCurriculumRoutes_1.default);
    app.use("/api/admin/units", adminUnitRoutes_1.default);
    app.use("/api/admin/lessons", adminLessonRoutes_1.default);
    app.use("/api/admin/questions", adminQuestionRoutes_1.default);
    app.use("/api/admin/import-export", adminImportExportRoutes_1.default);
    app.use("/api/admin/stats", adminStatsRoutes_1.default);
    app.use("/api/admin/users", adminUserRoutes_1.default);
    app.use("/api/admin/parental-controls", adminParentalRoutes_1.default);
    app.use("/api/progress", progressRoutes_1.default);
    app.use("/api/gamification", gamificationRoutes_1.default);
    app.use("/api/shop", shopRoutes_1.default);
    app.use("/api/leaderboard", leaderboardRoutes_1.default);
    app.use("/api/leagues", leagueRoutes_1.default);
    app.use("/api/classroom", classroomRoutes_1.default);
    app.use("/api/events", eventRoutes_1.default);
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map