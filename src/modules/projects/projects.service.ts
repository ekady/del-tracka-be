import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import {
  Project,
  ProjectDocument,
} from 'src/database/schema/project/project.schema';
import { CreateUserProjectDto } from '../user-project/dto/create-user-project.dto';
import { UserProjectService } from '../user-project/user-project.service';
import { UsersService } from '../users/users.service';
import {
  AddUpdateMemberDto,
  CreateProjectDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from './dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectSchema: Model<ProjectDocument>,
    private userProjectService: UserProjectService,
    private userService: UsersService,
  ) {}

  async create(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<StatusMessageDto> {
    const payload = {
      ...createProjectDto,
      createdBy: userId,
      updatedBy: userId,
    };
    const project = await this.projectSchema.create(payload);
    await this.userProjectService.addMemberProject({
      projectId: project._id,
      userId,
    });

    return { message: 'Success' };
  }

  async findAll(): Promise<ProjectResponseDto[]> {
    return this.projectSchema.find().populate([
      { path: 'createdBy', select: '_id firstName lastName' },
      { path: 'updatedBy', select: '_id firstName lastName' },
    ]);
  }

  async findOne(id: string): Promise<ProjectResponseDto> {
    const project = await this.projectSchema
      .findById(id)
      .populate([
        { path: 'createdBy', select: '_id firstName lastName' },
        { path: 'updatedBy', select: '_id firstName lastName' },
      ])
      .exec();
    if (!project) throw new DocumentNotFoundException();

    return project;
  }

  async update(
    userId: string,
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const payload = { ...updateProjectDto, updatedBy: userId };
    const project = await this.projectSchema
      .findByIdAndUpdate(id, payload, {
        new: true,
      })
      .populate([
        { path: 'createdBy', select: '_id firstName lastName' },
        { path: 'updatedBy', select: '_id firstName lastName' },
      ])
      .exec();
    if (!project) throw new DocumentNotFoundException();

    return project;
  }

  async remove(id: string): Promise<StatusMessageDto> {
    const project = await this.projectSchema.findById(id).exec();
    if (!project) throw new DocumentNotFoundException();

    await project.remove();
    return { message: 'Success' };
  }

  async addMember(
    id: string,
    addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const project = await this.projectSchema.findById(id).exec();
    if (!project) throw new DocumentNotFoundException('Project not found');

    const user = await this.userService.findOne(addUpdateMemberDto.userId);

    const createUserProjectDto: CreateUserProjectDto = {
      projectId: project._id,
      userId: user._id,
    };
    await this.userProjectService.addMemberProject(createUserProjectDto);

    return { message: 'Success' };
  }

  async getMember(id: string) {
    return this.userProjectService.getMemberProject(id);
  }

  async removeMember(
    id: string,
    addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    await this.userProjectService.deleteMemberProject({
      projectId: id,
      userId: addUpdateMemberDto.userId,
    });

    return { message: 'Success' };
  }
}
