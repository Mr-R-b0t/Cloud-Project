import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const schema = Joi.object({
    secret: Joi.string().base64().required()
});

export const AuthConfig = registerAs(
    'auth',
    async (): Promise<{
        secret: string;
    }> => {
        const config = {
            secret: process.env[`JWT_SECRET_KEY_BASE64`] || 'VEpQQzZkZ0YhP0tCeUBoOUNBNWFQcG84IzZ6c1BRSGVxSlgmNGJiYmFDaW4/WEwjTkRiQUtZNGZKQjhoOGJHR2FnQ2lHR1BScVRoM2EmTUdMWXNhQ01CTGM/I0t6P05KRWIkc2doSERiQVNlJmtqZHI0SFhkSmRA',
        };
        return schema.validateAsync(config);
    },
);