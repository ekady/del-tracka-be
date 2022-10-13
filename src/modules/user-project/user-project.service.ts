import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { RoleName } from 'src/common/enums';
import {
  DocumentExistException,
  DocumentNotFoundException,
} from 'src/common/http-exceptions/exceptions';
import { ProjectDocument } from 'src/database/schema/project/project.schema';
import { RoleDocument } from 'src/database/schema/role/role.schema';
import {
  UserProject,
  UserProjectDocument,
} from 'src/database/schema/user-project/user-project.schema';
import {
  CreateUserProjectDto,
  UpdateUserProjectDto,
  ProjectUserResponseDto,
  UserProjectResponseDto,
} from './dto';

@Injectable()
export class UserProjectService {
  constructor(
    @InjectModel(UserProject.name)
    private userProjectSchema: Model<UserProjectDocument>,
  ) {}

  async findUserProjects(
    userId: string,
    queryProject?: FilterQuery<ProjectDocument>,
    queryRole?: FilterQuery<RoleDocument>,
  ): Promise<UserProjectResponseDto[]> {
    const objectUserId = new Types.ObjectId(userId);
    const matchProject = queryProject ?? {};
    const matchRole = queryRole ?? {};
    const nameField = { _id: 1, name: 1 };
    const userFields = {
      _id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      picture: 1,
    };
    return this.userProjectSchema.aggregate([
      { $match: { user: objectUserId } },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project',
          pipeline: [
            { $match: matchProject },
            { $project: { ...nameField, description: 1, shortId: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
          pipeline: [{ $match: matchRole }, { $project: nameField }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: userFields }],
        },
      },
      {
        $lookup: {
          from: 'stages',
          localField: 'project._id',
          foreignField: 'project',
          as: 'stages',
          pipeline: [
            { $project: { ...nameField, description: 1, shortId: 1 } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          user: { $arrayElemAt: ['$user', 0] },
          project: { $arrayElemAt: ['$project', 0] },
          role: { $arrayElemAt: ['$role', 0] },
          stages: '$stages',
        },
      },
      {
        $match: {
          user: { $ne: undefined },
          project: { $ne: undefined },
          role: { $ne: undefined },
        },
      },
    ]);
  }

  async findUserProject(
    userId: string,
    shortId: string,
    errorMessage?: string,
  ): Promise<UserProjectResponseDto> {
    const [userProject] = await this.findUserProjects(userId, {
      shortId,
    });
    if (!userProject || !userProject.project) {
      const errmsg = errorMessage || 'Project not found';
      throw new DocumentNotFoundException(errmsg);
    }
    return userProject;
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
      .sort({ createdAt: -1 })
      .select('project')
      .exec();
  }

  async findUsersByProjectId(
    projectId: string,
  ): Promise<ProjectUserResponseDto[]> {
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
      createdBy: user.createdBy,
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
      userRole.length >= 2 && userRole[0].role.name === RoleName.OWNER;
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
    if (roleName === RoleName.OWNER && userRole.length < 2) {
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
