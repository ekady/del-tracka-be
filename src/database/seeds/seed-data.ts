import { connect, model, plugin } from 'mongoose';
import * as dotenv from 'dotenv';
import {
  PermissionEntity,
  PermissionDocument,
  PermissionSchema,
} from '../../modules/permissions/schema/permission.schema';
import {
  RoleEntity,
  RoleDocument,
  RoleSchema,
} from 'src/modules/roles/schema/role.schema';
import { RolePermissionsConstant } from './data/role-permission.contant';
import {
  ProjectEntity,
  ProjectDocument,
  ProjectSchema,
} from 'src/modules/projects/schema/project.schema';
import {
  UserProjectEntity,
  UserProjectDocument,
  UserProjectSchema,
} from 'src/modules/user-project/schema/user-project.schema';
import {
  StageEntity,
  StageDocument,
  StageSchema,
} from 'src/modules/stages/schema/stage.schema';
import {
  TaskEntity,
  TaskDocument,
  TaskSchema,
} from 'src/modules/tasks/schema/task.schema';
import {
  CommentEntity,
  CommentDocument,
  CommentSchema,
} from 'src/modules/comments/schema/comment.schema';

const RoleModel = model<RoleDocument>(RoleEntity.name, RoleSchema);
const PermissionModel = model<PermissionDocument>(
  PermissionEntity.name,
  PermissionSchema,
);
const ProjectModel = model<ProjectDocument>(ProjectEntity.name, ProjectSchema);
const UserProjectModel = model<UserProjectDocument>(
  UserProjectEntity.name,
  UserProjectSchema,
);
const StageModel = model<StageDocument>(StageEntity.name, StageSchema);
const TaskModel = model<TaskDocument>(TaskEntity.name, TaskSchema);
const CommentModel = model<CommentDocument>(CommentEntity.name, CommentSchema);

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
