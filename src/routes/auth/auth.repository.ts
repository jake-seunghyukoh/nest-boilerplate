import * as Redis from 'ioredis';

import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

import { authConstants } from './authConstants';

@Injectable()
export default class AuthRepository {
  constructor(redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  private readonly redisClient: Redis.Redis;

  public async addRefreshToken(email: string, token: string): Promise<void> {
    await this.redisClient.set(
      email,
      token,
      'EX',
      authConstants.redis.expirationTime.jwt.refreshToken,
    );
  }

  public getToken(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  public removeToken(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  public removeAllTokens(): Promise<string> {
    return this.redisClient.flushall();
  }
}
