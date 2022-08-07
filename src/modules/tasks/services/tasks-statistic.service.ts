import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Task, TaskDocument } from 'src/database/schema/task/task.schema';
import {
  UserProject,
  UserProjectDocument,
} from 'src/database/schema/user-project/user-project.schema';
import { TaskStageStatisticDto, TaskStatisticDto } from '../dto';

@Injectable()
export class TasksStatisticService {
  constructor(
    @InjectModel(Task.name) private taskSchema: Model<TaskDocument>,
    @InjectModel(UserProject.name)
    private userProjectSchema: Model<UserProjectDocument>,
  ) {}

  async getTasksStatisticAll(userId: string): Promise<TaskStatisticDto[]> {
    const userProject: PipelineStage.Match = { $match: { user: userId } };
    return this.getTasksStatisticByStatus(userProject);
  }

  async getTasksStatisticByUser(userId: string): Promise<TaskStatisticDto[]> {
    const userProject: PipelineStage.Match = { $match: { user: userId } };
    const task: PipelineStage.Match = {
      $match: { $or: [{ assignee: userId }, { reporter: userId }] },
    };
    return this.getTasksStatisticByStatus(userProject, task);
  }

  async getTasksStatisticByProjectId(
    userId: string,
    projectId: string,
  ): Promise<TaskStatisticDto[]> {
    const userProject: PipelineStage.Match = {
      $match: { user: userId, project: new Types.ObjectId(projectId) },
    };
    return this.getTasksStatisticByStatus(userProject);
  }

  async getTasksStatisticByStages(
    userId: string,
    projectId: string,
  ): Promise<TaskStageStatisticDto[]> {
    const match: PipelineStage.Match = {
      $match: { user: userId, project: new Types.ObjectId(projectId) },
    };
    const taskGroup: PipelineStage.Group = {
      $group: {
        _id: '$status',
        name: { $first: '$status' },
        count: { $sum: 1 },
      },
    };
    const taskArrayToObject = {
      $map: {
        input: '$tasks',
        as: 'el',
        in: { k: '$$el._id', v: '$$el.count' },
      },
    };
    return this.userProjectSchema.aggregate([
      match,
      {
        $lookup: {
          from: 'stages',
          localField: 'project',
          foreignField: 'project',
          as: 'stage',
          pipeline: [
            {
              $lookup: {
                from: 'tasks',
                localField: '_id',
                foreignField: 'stage',
                as: 'tasks',
                pipeline: [taskGroup, { $sort: { name: 1 } }],
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                tasks: { $arrayToObject: taskArrayToObject },
              },
            },
          ],
        },
      },
      { $unwind: '$stage' },
      { $project: { _id: 0, stage: '$stage' } },
      { $sort: { 'stage.createdAt': 1 } },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$stage'] } } },
    ]);
  }

  async getTasksStatisticByStatus(
    userProjectMatch: PipelineStage.Match,
    taskMatch?: PipelineStage.Match,
  ): Promise<TaskStatisticDto[]> {
    const match = {
      userProject: userProjectMatch,
      task: taskMatch || { $match: {} },
    };
    return this.userProjectSchema.aggregate([
      match.userProject,
      {
        $lookup: {
          from: 'stages',
          localField: 'project',
          foreignField: 'project',
          as: 'stage',
          pipeline: [
            {
              $lookup: {
                from: 'tasks',
                localField: '_id',
                foreignField: 'stage',
                as: 'tasks',
                pipeline: [match.task],
              },
            },
            { $unwind: '$tasks' },
          ],
        },
      },
      { $unwind: '$stage' },
      {
        $group: {
          _id: '$stage.tasks.status',
          name: { $first: '$stage.tasks.status' },
          count: { $sum: 1 },
        },
      },
      { $sort: { name: 1 } },
    ]);
  }
}
