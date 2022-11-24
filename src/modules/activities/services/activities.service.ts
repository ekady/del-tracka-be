import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { ActivityProjection } from '../constants';
import { ActivityResponseDto } from '../dto';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { ActivitiesRepository } from '../repositories/activities.repository';

@Injectable()
export class ActivitiesService {
  constructor(private activitiesRepository: ActivitiesRepository) {}

  async create(
    createActivityDto: CreateActivityDto,
  ): Promise<StatusMessageDto> {
    const { project, createdBy, ...createDto } = createActivityDto;
    const payload = {
      createdBy: new Types.ObjectId(createdBy),
      project: new Types.ObjectId(project),
      ...createDto,
    };

    await this.activitiesRepository.create(payload);
    return {
      message: 'Success',
    };
  }

  async findActivitiesByProjectId(
    projectId: string,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<ActivityResponseDto[]> {
    const activities = await this.activitiesRepository.findAll(
      { project: new Types.ObjectId(projectId) },
      {
        populate: true,
        sort: { createdAt: -1 },
        limit: queries.limit,
        page: queries.page,
        projection: ActivityProjection,
        disablePagination: Boolean(queries.disablePagination),
      },
    );

    return activities.data.map((activity) => ({
      _id: activity._id,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      comment: activity.comment,
      createdBy: activity.createdBy,
      project: activity.project.name,
      stageAfter: activity.stageAfter,
      stageBefore: activity.stageBefore,
      taskAfter: activity.taskAfter,
      taskBefore: activity.taskBefore,
      type: activity.type,
    }));
  }

  async findStageActivities(
    projectId: string,
    stageId: string,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<ActivityResponseDto[]> {
    const objectProjectId = new Types.ObjectId(projectId);
    const objectStageId = new Types.ObjectId(stageId);
    const activities = await this.activitiesRepository.findAll(
      {
        project: objectProjectId,
        $or: [
          { 'stageAfter._id': objectStageId },
          { 'stageBefore._id': objectStageId },
        ],
      },
      {
        populate: true,
        sort: { createdAt: -1 },
        limit: queries.limit,
        page: queries.page,
        projection: ActivityProjection,
        disablePagination: Boolean(queries.disablePagination),
      },
    );
    return activities.data.map((activity) => ({
      _id: activity._id,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      comment: activity.comment,
      createdBy: activity.createdBy,
      project: activity.project.name,
      stageAfter: activity.stageAfter,
      stageBefore: activity.stageBefore,
      taskAfter: activity.taskAfter,
      taskBefore: activity.taskBefore,
      type: activity.type,
    }));
  }

  async findActivitiesTask(
    projectId: string,
    stageId: string,
    taskId: string,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<ActivityResponseDto[]> {
    const objectProjectId = new Types.ObjectId(projectId);
    const objectStageId = new Types.ObjectId(stageId);
    const objectTaskId = new Types.ObjectId(taskId);
    const activities = await this.activitiesRepository.findAll(
      {
        project: objectProjectId,
        $and: [
          {
            $or: [
              { 'stageAfter._id': objectStageId },
              { 'stageBefore._id': objectStageId },
            ],
          },
          {
            $or: [
              { 'taskAfter._id': objectTaskId },
              { 'taskBefore._id': objectTaskId },
            ],
          },
        ],
      },
      {
        populate: true,
        sort: { createdAt: -1 },
        limit: queries.limit,
        page: queries.page,
        projection: ActivityProjection,
        disablePagination: Boolean(queries.disablePagination),
      },
    );

    return activities.data.map((activity) => ({
      _id: activity._id,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      comment: activity.comment,
      createdBy: activity.createdBy,
      project: activity.project.name,
      stageAfter: activity.stageAfter,
      stageBefore: activity.stageBefore,
      taskAfter: activity.taskAfter,
      taskBefore: activity.taskBefore,
      type: activity.type,
    }));
  }
}
