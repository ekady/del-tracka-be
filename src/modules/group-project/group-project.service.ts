import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import {
  GroupProject,
  GroupProjectDocument,
} from 'src/database/schema/group-project/group-project.schema';
import { UserProjectService } from '../user-project/user-project.service';
import { CreateGroupProjectDto } from './dto/create-group-project.dto';
import { GroupProjectResponse } from './dto/group-project-response.dto';
import { UpdateGroupProjectDto } from './dto/update-group-project.dto';

@Injectable()
export class GroupProjectService {
  constructor(
    @InjectModel(GroupProject.name)
    private groupProjectSchema: Model<GroupProjectDocument>,
    private userProjectService: UserProjectService,
  ) {}

  async create(
    userId: string,
    createGroupProjectDto: CreateGroupProjectDto,
  ): Promise<StatusMessageDto> {
    const payload = {
      ...createGroupProjectDto,
      createdBy: userId,
      updatedBy: userId,
    };
    await this.groupProjectSchema.create(payload);
    return { message: 'Success' };
  }

  async findAll(): Promise<GroupProjectResponse[]> {
    return this.groupProjectSchema.find().populate([
      { path: 'createdBy', select: '_id firstName lastName' },
      { path: 'updatedBy', select: '_id firstName lastName' },
    ]);
  }

  async findOne(id: string): Promise<GroupProjectResponse> {
    const groupProject = await this.groupProjectSchema
      .findById(id)
      .populate([
        { path: 'createdBy', select: '_id firstName lastName' },
        { path: 'updatedBy', select: '_id firstName lastName' },
      ])
      .exec();
    if (!groupProject) throw new DocumentNotFoundException();

    return groupProject;
  }

  async update(
    userId: string,
    id: string,
    updateGroupProjectDto: UpdateGroupProjectDto,
  ): Promise<GroupProjectResponse> {
    const payload = { ...updateGroupProjectDto, updatedBy: userId };
    const groupProject = await this.groupProjectSchema
      .findByIdAndUpdate(id, payload, {
        new: true,
      })
      .populate([
        { path: 'createdBy', select: '_id firstName lastName' },
        { path: 'updatedBy', select: '_id firstName lastName' },
      ])
      .exec();
    if (!groupProject) throw new DocumentNotFoundException();

    return groupProject;
  }

  async remove(id: string): Promise<StatusMessageDto> {
    const groupProject = await this.groupProjectSchema.findById(id).exec();
    if (!groupProject) throw new DocumentNotFoundException();

    await groupProject.remove();
    return { message: 'Success' };
  }
}
