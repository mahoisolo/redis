import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module'; // Example feature module
import { User } from './user/entities/user.entity'; // Example entity
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type (postgres, mysql, etc.)
      host: 'localhost', // Database host
      port: 5432, // Database port
      username: 'postgres', // Database username
      password: 'mahder', // Database password
      database: 'redis', // Database name
      entities: [User], 
      synchronize: true,
    }),
    RedisModule,
    UserModule, 
  ],
})
export class AppModule {}
