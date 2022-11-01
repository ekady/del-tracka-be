import { Injectable } from '@nestjs/common';
import { PipelineStage } from 'mongoose';
import { ProjectsHelperService } from 'src/modules/projects/services';
import { TaskStageStatisticDto, TaskStatisticDto } from '../dto';
import { UserProjectRepository } from 'src/modules/user-project/repositories/user-project.repository';

@Injectable()
export class TasksStatisticService {
  constructor(
    private userProjectRepository: UserProjectRepository,
    private projectsHelperService: ProjectsHelperService,
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
    const project = await this.projectsHelperService.findProjectByShortId(
      projectId,
    );
    const userProject: PipelineStage.Match = {
      $match: { user: userId, project: project._id },
    };
    return this.getTasksStatisticByStatus(userProject);
  }

  async getTasksStatisticByStages(
    userId: string,
    projectId: string,
  ): Promise<TaskStageStatisticDto[]> {
    const project = await this.projectsHelperService.findProjectByShortId(
      projectId,
    );
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
          from: 'stages',
          localField: 'project',
          foreignField: 'project',
          as: 'stage',
          pipeline: [
            { $match: { isDeleted: { $ne: true } } },
            {
              $lookup: {
                from: 'tasks',
                localField: '_id',
                foreignField: 'stage',
                as: 'tasks',
                pipeline: [
                  { $match: { isDeleted: { $ne: true } } },
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
          from: 'stages',
          localField: 'project',
          foreignField: 'project',
          as: 'stage',
          pipeline: [
            { $match: { isDeleted: { $ne: true } } },
            {
              $lookup: {
                from: 'tasks',
                localField: '_id',
                foreignField: 'stage',
                as: 'tasks',
                pipeline: [
                  { $match: { isDeleted: { $ne: true } } },
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
}
