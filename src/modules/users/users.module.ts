import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './controllers/profile.controller';
import { UsersRepository } from './repositories/users.repository';
import { UserSchemaProvider } from './schema/user-schema.provider';
import { ProfileService } from './services/profile.service';
import { UsersService } from './services/users.service';

@Module({
  controllers: [ProfileController],
  providers: [UsersRepository, UsersService, ProfileService],
  exports: [UsersRepository, UsersService],
  imports: [MongooseModule.forFeatureAsync([UserSchemaProvider])],
})
export class UsersModule {}
