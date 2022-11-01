import { MongooseModuleOptions } from '@nestjs/mongoose';

export interface DatabaseOptionsService {
  createMongooseOptions(): MongooseModuleOptions;
}
