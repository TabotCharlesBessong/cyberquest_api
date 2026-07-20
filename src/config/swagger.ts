import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CyberQuest API",
      version: "1.0.0",
      description: "Backend API for CyberQuest - kids cybersecurity education app",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            age: { type: "integer" },
            ageGroup: { type: "string", enum: ["A", "B"] },
            avatar: { type: "string" },
            xp: { type: "integer" },
            level: { type: "integer" },
            streak: { type: "integer" },
            hearts: { type: "integer" },
            gems: { type: "integer" },
            isVerified: { type: "boolean" },
            onboarded: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Lesson: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            stepId: { type: "string" },
            type: { type: "string", enum: ["story", "quiz", "mini-game", "challenge"] },
            title: { type: "string" },
            text: { type: "string" },
            question: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            answer: { type: "integer" },
            explanation: { type: "string" },
            icon: { type: "string" },
            mascot: { type: "string" },
            speech: { type: "string" },
            ageGroup: { type: "string", enum: ["A", "B", "ALL"] },
            stepCategory: { type: "string", enum: ["intro", "core", "review", "bridge", "capstone"] },
            depthLevel: { type: "integer" },
            learningObjectives: { type: "array", items: { type: "string" } },
            successCriteria: { type: "array", items: { type: "string" } },
            connexusStandards: { type: "array", items: { type: "string" } },
            activityType: { type: "string" },
            choices: { type: "array", items: { type: "object" } },
            order: { type: "integer" },
          },
        },
        Lecture: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            slug: { type: "string" },
            title: { type: "string" },
            subtitle: { type: "string" },
            icon: { type: "string" },
            color: { type: "string" },
            badge: { type: "string" },
            badgeName: { type: "string" },
            order: { type: "integer" },
            lessons: { type: "array", items: { $ref: "#/components/schemas/Lesson" } },
          },
        },
        ModuleProgress: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            lectureId: { type: "string", format: "uuid" },
            status: { type: "string", enum: ["not_started", "in_progress", "completed"] },
            score: { type: "integer" },
            stars: { type: "integer", minimum: 0, maximum: 3 },
            xpEarned: { type: "integer" },
            completedAt: { type: "string", format: "date-time" },
          },
        },
        LessonProgress: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            lessonId: { type: "string", format: "uuid" },
            attempts: { type: "integer" },
            correct: { type: "integer" },
            bestScore: { type: "integer" },
            completed: { type: "boolean" },
            lastResult: { type: "string", enum: ["pass", "fail", null] },
          },
        },
        ProgressResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            modules: { type: "array", items: { $ref: "#/components/schemas/ModuleProgress" } },
            lessons: { type: "array", items: { $ref: "#/components/schemas/LessonProgress" } },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const specs = swaggerJsdoc(options);
