import { env } from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

export const authConstants = {
  jwt: {
    secret: env.JWT_SECRET,
    secrets: {
      accessToken: env.JWT_SECRETS_ACCESS_TOKEN,
      refreshToken: env.JWT_SECRETS_REFRESH_TOKEN,
    },
    expirationTime: {
      accessToken: '1d',
      refreshToken: '7d',
    },
  },
  mailer: {
    verifyEmail: {
      subject: 'Email Verification',
      template: 'verify-password',
    },
  },
};
