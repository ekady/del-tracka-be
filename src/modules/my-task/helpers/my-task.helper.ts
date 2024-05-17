import { Types } from 'mongoose';

import { PermissionDatabaseName } from 'src/modules/permission/entities/permission.entity';
import { RoleDatabaseName } from 'src/modules/role/entities/role.entity';
import { UserProjectDatabaseName } from 'src/modules/user-project/entities/user-project.entity';
import { EProjectMenu } from 'src/shared/enums';
import { StageDatabaseName } from 'src/modules/stage/entities/stage.entity';
import { ProjectDatabaseName } from 'src/modules/project/schema/project.entity';
import { UserDatabaseName } from 'src/modules/user/entities/user.entity';
import { NAME_FIELD, USER_FIELD } from '../constants/my-task.constant';

export const helperLookupUserProject = (userId: string | Types.ObjectId) => {
  const lookupPermission = {
    from: PermissionDatabaseName,
    localField: '_id',
    foreignField: 'role',
    as: 'permissions',
    pipeline: [
      { $match: { menu: EProjectMenu.Task } },
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
      { $project: { ...NAME_FIELD, permissions: '$permissions' } },
    ],
  };
  return {
    from: UserProjectDatabaseName,
    localField: '_id',
    foreignField: 'project',
    as: 'userproject',
    pipeline: [
      { $match: { user: userId } },
      { $lookup: lookupRole },
      { $unwind: '$role' },
    ],
  };
};

export const helperLookupStage = (
  userId: string | Types.ObjectId,
  filter?: Record<string, string | number>,
) => {
  const lookupUserProject = helperLookupUserProject(userId);
  const lookupProject = {
    from: ProjectDatabaseName,
    localField: 'project',
    foreignField: '_id',
    as: 'project',
    pipeline: [
      { $match: { ...filter } },
      { $lookup: lookupUserProject },
      { $unwind: '$userproject' },
    ],
  };

  return {
    from: StageDatabaseName,
    localField: 'stage',
    foreignField: '_id',
    as: 'stage',
    pipeline: [{ $lookup: lookupProject }, { $unwind: '$project' }],
  };
};

export const helperUserAssigneeAndReporter = () => {
  const lookupReporter = {
    from: UserDatabaseName,
    localField: 'reporter',
    foreignField: '_id',
    as: 'reporter',
    pipeline: [{ $project: USER_FIELD }],
  };
  const lookupAssignee = {
    from: UserDatabaseName,
    localField: 'assignee',
    foreignField: '_id',
    as: 'assignee',
    pipeline: [{ $project: USER_FIELD }],
  };
  return { lookupAssignee, lookupReporter };
};
