import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProjectDatabaseName } from 'src/modules/projects/schema/project.entity';
import { RoleDatabaseName } from 'src/modules/roles/entities/role.entity';
import { StageDatabaseName } from 'src/modules/stages/entities/stage.entity';
import { UserProjectDatabaseName } from 'src/modules/user-project/entities/user-project.entity';
import { UserDatabaseName } from 'src/modules/users/entities/user.entity';
import { MyTaskResponseDto } from 'src/modules/my-task/dto/my-task-response.dto';
import { TasksRepository } from 'src/modules/tasks/repositories/tasks.repository';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { PermissionDatabaseName } from 'src/modules/permissions/entities/permission.entity';
import { ProjectMenu } from 'src/shared/enums';

@Injectable()
export class MyTaskService {
  constructor(private tasksRepository: TasksRepository) {}

  async findMyTask(
    userId: string,
    queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<MyTaskResponseDto[]>> {
    const user = new Types.ObjectId(userId);

    if (queries.sortBy) {
      const [field, order] = queries.sortBy.split('|');
      queries.sort = { [field]: Number(order) };
      delete queries.sortBy;
    } else queries.sort = undefined;

    // Filter by Priority and Status
    const filter: { status?: string; priority?: string } = {};
    if (queries.priority) filter.priority = queries.priority;
    if (queries.status) filter.status = queries.status;

    // Filter Project Name
    const filterProjectName = queries?.project
      ? { shortId: queries.project }
      : {};

    // Clean up query search
    if (queries.search) queries.search = queries.search.replace('#', '');

    const userField = {
      _id: 1,
      firstName: 1,
      lastName: 1,
      picture: 1,
      email: 1,
    };
    const nameField = { _id: 1, name: 1 };
    const lookupReporter = {
      from: UserDatabaseName,
      localField: 'reporter',
      foreignField: '_id',
      as: 'reporter',
      pipeline: [{ $project: userField }],
    };
    const lookupAssignee = {
      from: UserDatabaseName,
      localField: 'assignee',
      foreignField: '_id',
      as: 'assignee',
      pipeline: [{ $project: userField }],
    };
    const lookupPermission = {
      from: PermissionDatabaseName,
      localField: '_id',
      foreignField: 'role',
      as: 'permissions',
      pipeline: [
        { $match: { menu: ProjectMenu.Task } },
        { $project: { menu: 1, create: 1, update: 1, delete: 1, read: 1 } },
      ],
    };
    const lookupRole = {
      from: RoleDatabaseName,
      localField: 'role',
      foreignField: '_id',
      as: 'role',
      pipeline: [
        { $lookup: lookupPermission },
        { $unwind: '$permissions' },
        { $project: { ...nameField, permissions: '$permissions' } },
      ],
    };
    const lookupUserProject = {
      from: UserProjectDatabaseName,
      localField: '_id',
      foreignField: 'project',
      as: 'userproject',
      pipeline: [
        { $match: { user } },
        { $lookup: lookupRole },
        { $unwind: '$role' },
      ],
    };
    const lookupProject = {
      from: ProjectDatabaseName,
      localField: 'project',
      foreignField: '_id',
      as: 'project',
      pipeline: [
        { $match: { ...filterProjectName } },
        { $lookup: lookupUserProject },
        { $unwind: '$userproject' },
      ],
    };
    const lookupStage = {
      from: StageDatabaseName,
      localField: 'stage',
      foreignField: '_id',
      as: 'stage',
      pipeline: [{ $lookup: lookupProject }, { $unwind: '$project' }],
    };

    return this.tasksRepository.findAllAggregate(
      [
        {
          $match: {
            $or: [{ assignee: user }, { reporter: user }],
            ...filter,
          },
        },
        { $lookup: lookupStage },
        { $unwind: '$stage' },
        { $lookup: lookupReporter },
        { $lookup: lookupAssignee },
        {
          $project: {
            _id: 1,
            shortId: 1,
            title: 1,
            feature: 1,
            description: 1,
            priority: 1,
            status: 1,
            assignee: { $arrayElemAt: ['$assignee', 0] },
            reporter: { $arrayElemAt: ['$reporter', 0] },
            stage: { _id: 1, name: 1, shortId: 1 },
            project: {
              _id: '$stage.project._id',
              name: '$stage.project.name',
              shortId: '$stage.project.shortId',
            },
            role: {
              _id: '$stage.project.userproject.role._id',
              name: '$stage.project.userproject.role.name',
            },
            permissions: '$stage.project.userproject.role.permissions',
            updatedAt: 1,
            result: 1,
          },
        },
      ],
      { ...queries, searchField: ['shortId', 'title', 'feature'] },
    );
  }
}
