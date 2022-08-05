import { connect, model, plugin } from 'mongoose';
import * as dotenv from 'dotenv';
import {
  Permission,
  PermissionDocument,
  PermissionSchema,
} from '../schema/permission/permission.schema';
import { Role, RoleDocument, RoleSchema } from '../schema/role/role.schema';
import { RolePermissionsConstant } from './data/role-permission.contant';
import { softDeletePlugin } from '../plugins';
import {
  Project,
  ProjectDocument,
  ProjectSchema,
} from '../schema/project/project.schema';
import {
  UserProject,
  UserProjectDocument,
  UserProjectSchema,
} from '../schema/user-project/user-project.schema';
import {
  Stage,
  StageDocument,
  StageSchema,
} from '../schema/stage/stage.schema';
import { Task, TaskDocument, TaskSchema } from '../schema/task/task.schema';
import {
  Comment,
  CommentDocument,
  CommentSchema,
} from '../schema/comment/comment.schema';

plugin(softDeletePlugin);

const RoleModel = model<RoleDocument>(Role.name, RoleSchema);
const PermissionModel = model<PermissionDocument>(
  Permission.name,
  PermissionSchema,
);
const ProjectModel = model<ProjectDocument>(Project.name, ProjectSchema);
const UserProjectModel = model<UserProjectDocument>(
  UserProject.name,
  UserProjectSchema,
);
const StageModel = model<StageDocument>(Stage.name, StageSchema);
const TaskModel = model<TaskDocument>(Task.name, TaskSchema);
const CommentModel = model<CommentDocument>(Comment.name, CommentSchema);

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