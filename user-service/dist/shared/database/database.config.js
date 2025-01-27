"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const config_1 = require("@nestjs/config");
const Joi = require("joi");
const schema = Joi.object({ url: Joi.string().uri().required() });
exports.databaseConfig = (0, config_1.registerAs)('database', async () => {
    const config = { url: process.env[`TYPEORM_URI`] };
    return schema.validateAsync(config);
});
//# sourceMappingURL=database.config.js.map