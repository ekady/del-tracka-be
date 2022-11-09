import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { RoleName } from 'src/common/enums';
import { DocumentExistException } from 'src/common/http-exceptions/exceptions';
import { ProjectDocument } from 'src/modules/projects/schema/project.schema';
import { RoleDocument } from 'src/modules/roles/schema/role.schema';
import { UserProjectDocument } from 'src/modules/user-project/schema/user-project.schema';
import {
  CreateUserProjectDto,
  UpdateUserProjectDto,
  ProjectUserResponseDto,
  UserProjectResponseDto,
} from '../dto';
import { UserProjectBulkRepository } from '../repositories/user-project.bulk.repository';
import { UserProjectRepository } from '../repositories/user-project.repository';

@Injectable()
export class UserProjectService {
  constructor(
    private userProjectRepository: UserProjectRepository,
    private userProjectBulkRepository: UserProjectBulkRepository,
  ) {}

  async findUserProjects(
    userId: string,
    queryProject?: FilterQuery<ProjectDocument>,
    queryRole?: FilterQuery<RoleDocument>,
  ): Promise<UserProjectResponseDto[]> {
    const objectUserId = new Types.ObjectId(userId);
    const matchProject = queryProject ?? {};
    const matchRole = queryRole ?? {};
    const nameField = { _id: 1, name: 1, createdAt: 1, updatedAt: 1 };
    const userFields = {
      _id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      picture: 1,
    };
    return this.userProjectRepository.aggregate<UserProjectResponseDto>([
      { $match: { user: objectUserId } },
      {
        $lookup: {
          from: 'projectentities',
          localField: 'project',
          foreignField: '_id',
          as: 'project',
          pipeline: [
            { $match: { deletedAt: { $exists: false }, ...matchProject } },
            { $project: { ...nameField, description: 1, shortId: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'roleentities',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
          pipeline: [{ $match: matchRole }, { $project: nameField }],
        },
      },
      {
        $lookup: {
          from: 'userentities',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            { $match: { deletedAt: { $exists: false } } },
            { $project: userFields },
          ],
        },
      },
      {
        $lookup: {
          from: 'stageentities',
          localField: 'project._id',
          foreignField: 'project',
          as: 'stages',
          pipeline: [
            { $match: { deletedAt: { $exists: false } } },
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
      throw new BadRequestException(errmsg);
    }
    return userProject;
  }

  async findUserProjectByName(
    userId: string,
    projectName: string,
  ): Promise<UserProjectResponseDto> {
    const [userProject] = await this.findUserProjects(userId, {
      name: projectName,
    });
    return userProject;
  }

  async findProjectsByUserId(userId: string): Promise<UserProjectDocument[]> {
    return this.userProjectRepository.findAll({ user: userId });
  }

  async findUsersByProjectId(
    projectId: string,
  ): Promise<ProjectUserResponseDto[]> {
    const users = await this.userProjectRepository.findAll(
      { project: projectId },
      { populate: true, limit: undefined, skip: undefined },
    );
    return users.map((user) => ({
      _id: user.user._id,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      role: user.role,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      picture: user.user.picture,
      email: user.user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async findUserProjectsByRoleId(
    projectId: string,
    roleId: string,
  ): Promise<UserProjectDocument[]> {
    return this.userProjectRepository.findAll({
      project: projectId,
      role: roleId,
    });
  }

  async addUserProject(
    createUserProjectDto: CreateUserProjectDto,
    userCreatedId: string,
  ): Promise<UserProjectDocument> {
    const { userId, projectId, roleId } = createUserProjectDto;
    const userIdProjectId = { user: userId, project: projectId };
    const userProject = await this.userProjectRepository.findOne(
      userIdProjectId,
    );
    if (userProject)
      throw new DocumentExistException('User already exist on this project');

    const payload = {
      ...userIdProjectId,
      role: roleId,
      createdBy: userCreatedId,
      updatedBy: userCreatedId,
    };
    return this.userProjectRepository.create(payload);
  }

  async updateUserProject(
    updateUserProjectDto: UpdateUserProjectDto,
    userUpdatedId: string,
  ): Promise<UserProjectDocument> {
    const { userId, projectId, roleId } = updateUserProjectDto;
    const userOwner = await this.findUserProjects(
      userId,
      { _id: projectId },
      { name: RoleName.OWNER },
    );
    const owners = await this.findUserProjectsByRoleId(
      projectId,
      userOwner[0]?.role._id,
    );

    const isOwnerMinLimit =
      userOwner.length && owners.length < 2 && roleId !== owners[0].role._id;
    if (isOwnerMinLimit) {
      const errmsg = 'This project must have at least one OWNER';
      throw new BadRequestException(errmsg);
    }

    const userIdProjectId = { user: userId, project: projectId };
    const payload = {
      ...userIdProjectId,
      role: roleId,
      updatedBy: userUpdatedId,
    };
    const userProject = await this.userProjectRepository.updateOne(
      userIdProjectId,
      payload,
    );
    if (!userProject)
      throw new BadRequestException('User not found on this project');
    return userProject;
  }

  async deleteUserProject(
    updateUserProjectDto: UpdateUserProjectDto,
  ): Promise<UserProjectDocument> {
    const { userId, projectId } = updateUserProjectDto;
    const userProject = await this.userProjectRepository.findOne({
      user: userId,
      project: projectId,
    });

    if (!userProject)
      throw new BadRequestException('User not found on this project');

    const { name: roleName, _id: roleId } = userProject.role;
    const userRole = await this.findUserProjectsByRoleId(projectId, roleId);
    if (roleName === RoleName.OWNER && userRole.length < 2) {
      throw new BadRequestException(
        'This user is the only owner of this project',
      );
    }
    await this.userProjectRepository.softDeleteOne({
      user: userId,
      project: projectId,
    });
    return userProject;
  }

  async deleteAllUserProjects(projectId: string): Promise<void> {
    const userProjects = await this.userProjectRepository.findAll({
      project: projectId,
    });
    const ids: string[] = userProjects.map((userProject) => userProject._id);
    await this.userProjectBulkRepository.softDeleteManyById(ids);
  }
}