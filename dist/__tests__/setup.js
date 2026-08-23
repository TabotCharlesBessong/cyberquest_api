"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
beforeAll(async () => {
    await db_1.sequelize.authenticate();
});
afterAll(async () => {
    await db_1.sequelize.close();
});
//# sourceMappingURL=setup.js.map