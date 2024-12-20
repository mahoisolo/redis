import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; // Updated import
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory', // Optional cache store (you can customize)
      isGlobal: true, // Makes the cache available globally in your app
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
