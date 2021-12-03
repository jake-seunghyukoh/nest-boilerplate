import { env } from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConstants = {
  secret: env.JWT_SECRET,
};
