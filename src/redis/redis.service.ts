import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost', // Redis server host (default: localhost)
      port: 6379, // Redis server port (default: 6379)
    });
  }

  // Get a value from Redis by key
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  // Set a value in Redis with an optional TTL (time-to-live)
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl); // EX sets the expiration time in seconds
    } else {
      await this.redisClient.set(key, value);
    }
  }

  // Delete a value from Redis by key
  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
