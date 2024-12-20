import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from '../redis/redis.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService, // Inject RedisService for caching
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);

    // Optionally clear cache after creating a new user
    await this.redisService.del('users'); // Invalidate the cache for all users
    return newUser;
  }

  @Get()
  async findAll() {
    const cacheKey = 'users';
    const cachedUsers = await this.redisService.get(cacheKey);

    if (cachedUsers) {
      return JSON.parse(cachedUsers); // Return cached users
    }

    const users = await this.userService.findAll();
    await this.redisService.set(cacheKey, JSON.stringify(users), 3600); // Cache users for 1 hour
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cacheKey = `user_${id}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser); // Return cached user
    }

    const user = await this.userService.findOne(+id);
    await this.redisService.set(cacheKey, JSON.stringify(user), 3600); // Cache user for 1 hour
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(+id, updateUserDto);

    // Update cache after user update
    const cacheKey = `user_${id}`;
    await this.redisService.set(cacheKey, JSON.stringify(updatedUser), 3600); // Update cache

    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUser = await this.userService.remove(+id);

    // Remove the cached user after deletion
    const cacheKey = `user_${id}`;
    await this.redisService.del(cacheKey); // Invalidate cache for this user

    return deletedUser;
  }
}
