import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DocumentExistException,
  DocumentNotFoundException,
} from 'src/common/http-exceptions/exceptions';
import {
  UserProject,
  UserProjectDocument,
} from 'src/database/schema/user-project/user-project.schema';
import { CreateUserProjectDto } from './dto/create-user-project.dto';
import { UpdateUserProjectDto } from './dto/update-user-project.dto';

@Injectable()
export class UserProjectService {
  constructor(
    @InjectModel(UserProject.name)
    private userProjectSchema: Model<UserProjectDocument>,
  ) {}

  async addMemberProject(
    createUserProjectDto: CreateUserProjectDto,
  ): Promise<UserProjectDocument> {
    const userProject = await this.userProjectSchema
      .findOne(createUserProjectDto)
      .exec();
    if (userProject)
      throw new DocumentExistException('User already exist on this project');
    return this.userProjectSchema.create(createUserProjectDto);
  }

  async getMemberProject(id: string) {
    const projectId = new Types.ObjectId(id);
    const users = await this.userProjectSchema
      .find({ projectId })
      .select('userId')
      .populate({ path: 'userId', select: '_id firstName lastName' })
      .exec();
    return users.map((user) => user.userId);
  }

  async updateMemberProject(
    updateUserProjectDto: UpdateUserProjectDto,
  ): Promise<UserProjectDocument> {
    // TODO: update user roles
    return this.userProjectSchema.create(updateUserProjectDto);
  }

  async deleteMemberProject(
    updateUserProjectDto: UpdateUserProjectDto,
  ): Promise<UserProjectDocument> {
    const userIdProjectId = {
      userId: new Types.ObjectId(updateUserProjectDto.userId),
      projectId: new Types.ObjectId(updateUserProjectDto.projectId),
    };
    const userProject = await this.userProjectSchema
      .findOne(userIdProjectId)
      .exec();
    if (!userProject)
      throw new DocumentNotFoundException('User not found on this project');

    await userProject.remove();
    return userProject;
  }
}
