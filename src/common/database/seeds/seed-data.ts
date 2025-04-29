import { EJSON } from 'bson';
import * as dotenv from 'dotenv';
import { connect, model } from 'mongoose';

import {
  ActivityDatabaseName,
  ActivitySchema,
} from 'src/modules/activity/entities/activity.entity';
import {
  CommentSchema,
  CommentDatabaseName,
} from 'src/modules/comment/entities/comment.entity';
import {
  NotificationDatabaseName,
  NotificationSchema,
} from 'src/modules/notification/entities/notification.entity';
import {
  PermissionSchema,
  PermissionDatabaseName,
} from 'src/modules/permission/entities/permission.entity';
import {
  ProjectSchema,
  ProjectDatabaseName,
} from 'src/modules/project/schema/project.entity';
import {
  RoleSchema,
  RoleDatabaseName,
} from 'src/modules/role/entities/role.entity';
import {
  StageSchema,
  StageDatabaseName,
} from 'src/modules/stage/entities/stage.entity';
import {
  TaskSchema,
  TaskDatabaseName,
} from 'src/modules/task/entities/task.entity';
import {
  UserDatabaseName,
  TUserDocument,
  UserSchema,
} from 'src/modules/user/entities/user.entity';
import {
  UserProjectEntity,
  UserProjectSchema,
} from 'src/modules/user-project/entities/user-project.entity';

import { ActivityDemoSeed } from './data/activity-demo-seed.constant';
import { CommentDemoSeed } from './data/comment-demo-seed.constant';
import { NotificationDemoSeed } from './data/notification-demo-seed.constant';
import { PermissionSeed } from './data/permission-seed.constant';
import { ProjectDemoSeed } from './data/project-demo-seed.constant';
import { RoleSeed } from './data/role-seed.constant';
import { StageDemoSeed } from './data/stage-demo-seed.constant';
import { TaskDemoSeed } from './data/task-demo-seed.constant';
import { UserDemoConstant } from './data/user-demo-seed.constant';
import { UserProjectDemoSeed } from './data/user-project-demo-seed.constant';

const RoleModel = model(RoleDatabaseName, RoleSchema);
const PermissionModel = model(PermissionDatabaseName, PermissionSchema);
const ProjectModel = model(ProjectDatabaseName, ProjectSchema);
const UserProjectModel = model(UserProjectEntity.name, UserProjectSchema);
const UserModel = model(UserDatabaseName, UserSchema);
const StageModel = model(StageDatabaseName, StageSchema);
const TaskModel = model(TaskDatabaseName, TaskSchema);
const CommentModel = model(CommentDatabaseName, CommentSchema);
const NotificationModel = model(NotificationDatabaseName, NotificationSchema);
const ActivityModel = model(ActivityDatabaseName, ActivitySchema);

const activityDropIndex = async () => {
  try {
    await ActivityModel.collection.dropIndexes();
  } catch (error) {
    console.log(error);
  }
};

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE_LOCAL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const connectDb = async () => {
  try {
    await connect(DB);
    console.log('Connected to database');
  } catch (_) {
    console.log('Error connecting to database');
    process.exit(1);
  }
};

const addDemoData = async (): Promise<void> => {
  await RoleModel.insertMany(EJSON.deserialize(RoleSeed));
  await PermissionModel.insertMany(EJSON.deserialize(PermissionSeed));
  const password = process.env.USER_DEMO_PASSWORD;
  const userSeed = EJSON.deserialize(UserDemoConstant);
  userSeed.forEach?.((user: TUserDocument) => {
    user.password = password;
    user.passwordConfirm = password;
  });
  await UserModel.insertMany(userSeed);
  await ProjectModel.insertMany(EJSON.deserialize(ProjectDemoSeed));
  await UserProjectModel.insertMany(EJSON.deserialize(UserProjectDemoSeed));
  await StageModel.insertMany(EJSON.deserialize(StageDemoSeed));
  await TaskModel.insertMany(EJSON.deserialize(TaskDemoSeed));
  await CommentModel.insertMany(EJSON.deserialize(CommentDemoSeed));
  await activityDropIndex();
  await ActivityModel.insertMany(EJSON.deserialize(ActivityDemoSeed));
  await NotificationModel.insertMany(EJSON.deserialize(NotificationDemoSeed));
  await activityDropIndex();
};

const importData = async (): Promise<void> => {
  try {
    await connectDb();
    await addDemoData();

    console.log('Import data success');
  } catch (_) {
    console.log({ _ });
    console.log('Import data fail');
  }

  process.exit();
};

const deleteData = async (): Promise<void> => {
  try {
    await connectDb();
    await RoleModel.deleteMany({}).exec();
    await UserModel.deleteMany({}).exec();
    await PermissionModel.deleteMany({}).exec();
    await ProjectModel.deleteMany({}).exec();
    await UserProjectModel.deleteMany({}).exec();
    await StageModel.deleteMany({}).exec();
    await TaskModel.deleteMany({}).exec();
    await CommentModel.deleteMany({}).exec();
    await NotificationModel.deleteMany({}).exec();
    await ActivityModel.deleteMany({}).exec();
    await activityDropIndex();

    console.log('Delete data success');
  } catch (_) {
    console.log({ _ });
    console.log('Delete data fail');
  }

  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
