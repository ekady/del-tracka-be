import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { ProjectRoleName } from 'src/common/enums';
import {
  DocumentExistException,
  DocumentNotFoundException,
} from 'src/common/http-exceptions/exceptions';
import {
  UserProject,
  UserProjectDocument,
} from 'src/database/schema/user-project/user-project.schema';
import { CreateUserProjectDto, UpdateUserProjectDto } from './dto';

@Injectable()
export class UserProjectService {
  constructor(
    @InjectModel(UserProject.name)
    private userProjectSchema: Model<UserProjectDocument>,
  ) {}

  async findUserProject(
    queryOptions: FilterQuery<UserProjectDocument>,
    populateOptions?: PopulateOptions[],
  ): Promise<UserProjectDocument> {
    return this.userProjectSchema
      .findOne(queryOptions)
      .populate(populateOptions);
  }

  async findProjectsByUserId(userId: string): Promise<UserProjectDocument[]> {
    return this.userProjectSchema
      .find({ user: userId })
      .populate({
        path: 'project',
        populate: [
          { path: 'createdBy', select: '_id firstName lastName' },
          { path: 'updatedBy', select: '_id firstName lastName' },
        ],
      })
      .select('project')
      .exec();
  }

  async findUsersByProjectId(projectId: string) {
    const users = await this.userProjectSchema
      .find({ project: projectId })
      .select('_id user role')
      .populate([
        { path: 'createdBy', select: '_id firstName lastName' },
        { path: 'updatedBy', select: '_id firstName lastName' },
        { path: 'user', select: '_id firstName lastName' },
        { path: 'role', select: '_id name' },
      ])
      .exec();
    return users.map((user) => ({
      _id: user.user._id,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      role: user.role,
      addedBy: user.createdBy,
      updatedBy: user.updatedBy,
    }));
  }

  async findUserProjectsByRoleId(
    projectId: string,
    roleId: string,
  ): Promise<UserProjectDocument[]> {
    return this.userProjectSchema
      .find({ project: projectId, role: roleId })
      .populate(['user', 'role'])
      .exec();
  }

  async addUserProject(
    createUserProjectDto: CreateUserProjectDto,
    userCreatedId: string,
  ): Promise<UserProjectDocument> {
    const { userId, projectId, roleId } = createUserProjectDto;
    const userIdProjectId = { user: userId, project: projectId };
    const userProject = await this.userProjectSchema
      .findOne(userIdProjectId)
      .exec();
    if (userProject)
      throw new DocumentExistException('User already exist on this project');

    const payload = {
      ...userIdProjectId,
      role: roleId,
      createdBy: userCreatedId,
      updatedBy: userCreatedId,
    };
    return this.userProjectSchema.create(payload);
  }

  async updateUserProject(
    updateUserProjectDto: UpdateUserProjectDto,
    userUpdatedId: string,
  ): Promise<UserProjectDocument> {
    const { userId, projectId, roleId } = updateUserProjectDto;
    const userRole = await this.findUserProjectsByRoleId(projectId, roleId);
    const isOwnerLimit =
      userRole.length >= 2 && userRole[0].role.name === ProjectRoleName.OWNER;
    if (isOwnerLimit) {
      const errmsg = 'This project can only have two owners';
      throw new DocumentNotFoundException(errmsg);
    }
    const userIdProjectId = { user: userId, project: projectId };
    const payload = {
      ...userIdProjectId,
      role: roleId,
      updatedBy: userUpdatedId,
    };
    const userProject = await this.userProjectSchema
      .findOneAndUpdate(userIdProjectId, payload, { new: true })
      .exec();
    if (!userProject)
      throw new DocumentExistException('User not found on this project');
    return userProject;
  }

  async deleteUserProject(
    updateUserProjectDto: UpdateUserProjectDto,
  ): Promise<UserProjectDocument> {
    const { userId, projectId } = updateUserProjectDto;
    const userProject = await this.userProjectSchema
      .findOne({ user: userId, project: projectId })
      .select('_id role')
      .populate('role')
      .exec();
    if (!userProject)
      throw new DocumentNotFoundException('User not found on this project');

    const { name: roleName, _id: roleId } = userProject.role;
    const userRole = await this.findUserProjectsByRoleId(projectId, roleId);
    if (roleName === ProjectRoleName.OWNER && userRole.length < 2) {
      throw new DocumentNotFoundException(
        'This user is the only owner of this project',
      );
    }
    await userProject.remove();
    return userProject;
  }

  async deleteAllUserProjects(projectId: string): Promise<void> {
    const userProjects = await this.userProjectSchema
      .find({ project: projectId })
      .exec();
    const removeQuery = userProjects.map(async (userProject) =>
      userProject.remove(),
    );
    Promise.all(removeQuery);
  }
}
