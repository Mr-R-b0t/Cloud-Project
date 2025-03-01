import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const schema = Joi.object({ url: Joi.string().uri().required() });

export const databaseConfig = registerAs(
  'database',
  async (): Promise<{ url: string }> => {
    const config = { url: process.env[`TYPEORM_URI`] || 'postgres://ssaproject:ssapassword@postgres:5432/ssa'};
    return schema.validateAsync(config);
  },
);