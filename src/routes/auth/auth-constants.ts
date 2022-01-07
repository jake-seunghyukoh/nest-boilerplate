import { env } from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

export const authConstants = {
  jwt: {
    secret: env.JWT_SECRET,
  },
};
