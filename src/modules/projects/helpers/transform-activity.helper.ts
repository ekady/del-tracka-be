import { STATUS, StatusType } from 'src/shared/enums';
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
      .replace(
        '{task}',
        `${data.taskAfter.title} (#${data.taskAfter.shortId})`,
      ),
  UPDATE_TASK: (data) =>
    '{name} has updated task {task}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace(
        '{task}',
        `${data.taskAfter.title} (#${data.taskAfter.shortId})`,
      ),
  UPDATE_TASK_STATUS: (data) => {
    return '{name} has updated status task {task} from {status1} to {status2}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace('{task}', `${data.taskAfter.title} (#${data.taskAfter.shortId})`)
      .replace('{status1}', STATUS[data.taskBefore.status as StatusType].name)
      .replace('{status2}', STATUS[data.taskAfter.status as StatusType].name);
  },
  DELETE_TASK: (data) =>
    '{name} has deleted task {task}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace(
        '{task}',
        `${data.taskAfter.title} (#${data.taskAfter.shortId})`,
      ),
  CREATE_COMMENT: (data) =>
    '{name} has commented on task {task}'
      .replace(
        '{name}',
        `${data.createdBy.firstName} ${data.createdBy.lastName}`,
      )
      .replace(
        '{task}',
        `${data.taskAfter.title} (#${data.taskAfter.shortId})`,
      ),
};
