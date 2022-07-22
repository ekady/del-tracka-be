import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserProject,
  UserProjectDocument,
} from 'src/database/schema/user-project/user-project.schema';
import { CreateUserProjectDto } from './dto/create-user-project.dto';

@Injectable()
export class UserProjectService {
  constructor(
    @InjectModel(UserProject.name)
    private userProjectSchema: Model<UserProjectDocument>,
  ) {}

  async create(createUserProjectDto: CreateUserProjectDto) {
    return this.userProjectSchema.create(createUserProjectDto);
  }
}
