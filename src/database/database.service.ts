import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { softDeletePlugin } from './plugins';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private config: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.get<string>('DATABASE_LOCAL'),
      connectionFactory(connection: Connection) {
        connection.plugin(softDeletePlugin);
        return connection;
      },
    };
  }
}
