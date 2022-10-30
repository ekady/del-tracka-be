import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './controllers/profile.controller';
import { UserSchemaProvider } from './schema/user-schema.provider';
import { ProfileService } from './services/profile.service';
import { UsersService } from './services/users.service';

@Module({
  controllers: [ProfileController],
  providers: [UsersService, ProfileService],
  exports: [UsersService],
  imports: [MongooseModule.forFeatureAsync([UserSchemaProvider])],
})
export class UsersModule {}
