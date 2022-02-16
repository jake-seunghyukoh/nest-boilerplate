import * as dotenv from 'dotenv';
import { env } from 'process';

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
  redis: {
    expirationTime: {
      jwt: {
        accessToken: 86400, // 1d
        refreshToken: 604800, // 7d
      },
    },
  },
};
