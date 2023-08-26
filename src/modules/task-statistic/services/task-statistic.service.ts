import { Injectable } from '@nestjs/common';
import { PipelineStage } from 'mongoose';
import { ProjectHelperService } from 'src/modules/project/services';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import {
  TaskProjectCountDto,
  TaskStageStatisticDto,
  TaskStatisticDto,
  TaskStatusStatisticDto,
} from '../dto';
import { UserProjectRepository } from 'src/modules/user-project/repositories/user-project.repository';
import { StageDatabaseName } from 'src/modules/stage/entities/stage.entity';
import { TaskDatabaseName } from 'src/modules/task/entities/task.entity';
import { STATS_INITIAL_RESPONSE } from 'src/modules/task/constants/stats-initial-response.constant';
import { TaskStatus } from 'src/shared/enums';

@Injectable()
export class TaskStatisticService {
  constructor(
    private userProjectRepository: UserProjectRepository,
    private projectHelperService: ProjectHelperService,
    private userProjectService: UserProjectService,
  ) {}

  async getTasksStatisticByStatus(
    userProjectMatch: PipelineStage.Match,
    taskMatch?: PipelineStage.Match,
  ): Promise<TaskStatisticDto[]> {
    const match = {
      userProject: userProjectMatch,
      task: taskMatch || { $match: {} },
    };
    return this.userProjectRepository.aggregate([
      match.userProject,
      {
        $lookup: {
          from: StageDatabaseName,
          localField: 'project',
          foreignField: 'project',
          as: 'stage',
          pipeline: [
            { $match: { deletedAt: { $eq: null } } },
            {
              $lookup: {
                from: TaskDatabaseName,
                localField: '_id',
                foreignField: 'stage',
                as: 'tasks',
                pipeline: [
                  { $match: { deletedAt: { $eq: null } } },
                  match.task,
                ],
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

  async getTasksStatisticAll(userId: string): Promise<TaskStatusStatisticDto> {
    const userProject: PipelineStage.Match = { $match: { user: userId } };
    const response = { ...STATS_INITIAL_RESPONSE };
    const stats = await this.getTasksStatisticByStatus(userProject);
    stats.forEach((stat) => {
      response[stat.name as TaskStatus] = stat.count;
    });

    return response;
  }

  async getTasksStatisticByUser(
    userId: string,
  ): Promise<TaskStatusStatisticDto> {
    const userProject: PipelineStage.Match = { $match: { user: userId } };
    const response = { ...STATS_INITIAL_RESPONSE };
    const task: PipelineStage.Match = {
      $match: { $or: [{ assignee: userId }, { reporter: userId }] },
    };
    const stats = await this.getTasksStatisticByStatus(userProject, task);
    stats.forEach((stat) => {
      response[stat.name as TaskStatus] = stat.count;
    });

    return response;
  }

  async getTotalProjectAndTask(userId: string): Promise<TaskProjectCountDto> {
    const userProject: PipelineStage.Match = { $match: { user: userId } };
    const task = await this.getTasksStatisticByStatus(userProject);
    const project = await this.userProjectService.findUserProject(userId);

    return {
      totalProject: project.length,
      totalTask: task.reduce((total, task) => total + task.count, 0),
    };
  }

  async getTasksStatisticByProjectShortId(
    userId: string,
    projectShortId: string,
  ): Promise<TaskStatisticDto[]> {
    const project =
      await this.projectHelperService.findProjectByShortId(projectShortId);
    const userProject: PipelineStage.Match = {
      $match: { user: userId, project: project._id },
    };
    return this.getTasksStatisticByStatus(userProject);
  }

  async getTasksStatisticByStages(
    userId: string,
    projectShortId: string,
  ): Promise<TaskStageStatisticDto[]> {
    const project =
      await this.projectHelperService.findProjectByShortId(projectShortId);
    const match: PipelineStage.Match = {
      $match: { user: userId, project: project._id },
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
    return this.userProjectRepository.aggregate([
      match,
      {
        $lookup: {
          from: StageDatabaseName,
          localField: 'project',
          foreignField: 'project',
          as: 'stage',
          pipeline: [
            { $match: { deletedAt: { $eq: null } } },
            {
              $lookup: {
                from: TaskDatabaseName,
                localField: '_id',
                foreignField: 'stage',
                as: 'tasks',
                pipeline: [
                  { $match: { deletedAt: { $eq: null } } },
                  taskGroup,
                  { $sort: { name: 1 } },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                shortId: 1,
                description: 1,
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
}
