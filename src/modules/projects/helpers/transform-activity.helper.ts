import { ActivityResponseDto } from 'src/modules/activities/dto';

export const TransformActivityMessage: Record<
  string,
  (data: ActivityResponseDto) => string
> = {
  CREATE_STAGE: (data) =>
    '{name} created a new sprint, {sprint}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace('{sprint}', data.stageAfter.name),
  UPDATE_STAGE: (data) =>
    '{name} has updated a sprint, {sprint}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace('{sprint}', data.stageAfter.name),
  DELETE_STAGE: (data) =>
    '{name} has deleted a sprint, {sprint}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace('{sprint}', data.stageAfter.name),
  CREATE_TASK: (data) =>
    '{name} has created a new task {task}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace('{task}', data.taskAfter.title),
  UPDATE_TASK: (data) =>
    '{name} has updated task {task}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace('{task}', data.taskAfter.title),
  UPDATE_TASK_STATUS: (data) =>
    '{name} has updated status task {task} from {status1} to {status2}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace('{task}', data.taskAfter.title)
      .replace('{status1}', data.taskBefore.status)
      .replace('{status2}', data.taskAfter.status),
  DELETE_TASK: (data) =>
    '{name} has deleted task {task}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace('{task}', data.taskAfter.title),
  CREATE_COMMENT: (data) =>
    '{name} has commented on task {task}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace('{task}', data.taskAfter.title),
};
