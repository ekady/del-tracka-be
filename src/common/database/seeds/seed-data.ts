import { connect, model } from 'mongoose';
import * as dotenv from 'dotenv';
import {
  PermissionDocument,
  PermissionSchema,
  PermissionDatabaseName,
} from 'src/modules/permission/entities/permission.entity';
import {
  RoleDocument,
  RoleSchema,
  RoleDatabaseName,
} from 'src/modules/role/entities/role.entity';
import { RolePermissionsConstant } from './data/role-permission.contant';
import {
  ProjectDocument,
  ProjectSchema,
  ProjectDatabaseName,
} from 'src/modules/project/schema/project.entity';
import {
  UserProjectEntity,
  UserProjectDocument,
  UserProjectSchema,
} from 'src/modules/user-project/entities/user-project.entity';
import {
  StageDocument,
  StageSchema,
  StageDatabaseName,
} from 'src/modules/stage/entities/stage.entity';
import {
  TaskDocument,
  TaskSchema,
  TaskDatabaseName,
} from 'src/modules/task/entities/task.entity';
import {
  CommentDocument,
  CommentSchema,
  CommentDatabaseName,
} from 'src/modules/comment/entities/comment.entity';

const RoleModel = model<RoleDocument>(RoleDatabaseName, RoleSchema);
const PermissionModel = model<PermissionDocument>(
  PermissionDatabaseName,
  PermissionSchema,
);
const ProjectModel = model<ProjectDocument>(ProjectDatabaseName, ProjectSchema);
const UserProjectModel = model<UserProjectDocument>(
  UserProjectEntity.name,
  UserProjectSchema,
);
const StageModel = model<StageDocument>(StageDatabaseName, StageSchema);
const TaskModel = model<TaskDocument>(TaskDatabaseName, TaskSchema);
const CommentModel = model<CommentDocument>(CommentDatabaseName, CommentSchema);

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE_LOCAL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

connect(DB)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((_) => {
    console.log('DB connection failed!');
    process.exit(1);
  });

const addRolePermissions = async (): Promise<void> => {
  const roleAsync = RolePermissionsConstant.map(async (rolePermission) => {
    const { menuPermissions, name, priority } = rolePermission;
    const role = await RoleModel.create({
      name,
      isDefault: true,
      priority,
    });
    const permission = menuPermissions.map(async (menuPermission) => {
      const p = new PermissionModel(menuPermission);
      p.role = role._id;
      return p.save();
    });
    return Promise.all(permission);
  });
  await Promise.all(roleAsync);
};

const importData = async (): Promise<void> => {
  try {
    await addRolePermissions();

    console.log('Import data success');
  } catch (_) {
    console.log('Import data fail');
  }

  process.exit();
};

const deleteData = async (): Promise<void> => {
  try {
    await RoleModel.deleteMany({}).exec();
    await PermissionModel.deleteMany({}).exec();
    await ProjectModel.deleteMany({}).exec();
    await UserProjectModel.deleteMany({}).exec();
    await StageModel.deleteMany({}).exec();
    await TaskModel.deleteMany({}).exec();
    await CommentModel.deleteMany({}).exec();

    console.log('Delete data success');
  } catch (_) {
    console.log('Delete data fail');
  }

  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
