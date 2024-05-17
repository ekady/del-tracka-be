import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { StatusMessageDto } from 'src/shared/dto';
import {
  IPaginationOptions,
  IPaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { ActivityProjection } from '../constants';
import { ActivityResponseDto } from '../dto';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { ActivityRepository } from '../repositories/activity.repository';

@Injectable()
export class ActivityService {
  constructor(private activityRepository: ActivityRepository) {}

  async create(
    createActivityDto: CreateActivityDto,
  ): Promise<StatusMessageDto> {
    const { project, createdBy, ...createDto } = createActivityDto;
    const payload = {
      createdBy: new Types.ObjectId(createdBy),
      project: new Types.ObjectId(project),
      ...createDto,
    };

    await this.activityRepository.create(payload);
    return {
      message: 'Success',
    };
  }

  async findActivityByProjectId(
    projectId: string,
    queries?: Record<string, string> & IPaginationOptions,
  ): Promise<IPaginationResponse<ActivityResponseDto[]>> {
    const activities = await this.activityRepository.findAll(
      {
        project: new Types.ObjectId(projectId),
        createdAt: {
          $gte: queries.startDate || 0,
          $lte: queries.endDate || new Date().toISOString(),
        },
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

    return {
      data: activities.data.map((activity) => ({
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
      })),
      pagination: activities.pagination,
    };
  }

  async findStageActivity(
    projectId: string,
    stageId: string,
    queries?: Record<string, string> & IPaginationOptions,
  ): Promise<IPaginationResponse<ActivityResponseDto[]>> {
    const objectProjectId = new Types.ObjectId(projectId);
    const objectStageId = new Types.ObjectId(stageId);
    const activities = await this.activityRepository.findAll(
      {
        project: objectProjectId,
        createdAt: {
          $gte: queries.startDate || 0,
          $lte: queries.endDate || new Date().toISOString(),
        },
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
    return {
      data: activities.data.map((activity) => ({
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
      })),
      pagination: activities.pagination,
    };
  }

  async findActivityTask(
    projectId: string,
    stageId: string,
    taskId: string,
    queries?: Record<string, string> & IPaginationOptions,
  ): Promise<IPaginationResponse<ActivityResponseDto[]>> {
    const objectProjectId = new Types.ObjectId(projectId);
    const objectStageId = new Types.ObjectId(stageId);
    const objectTaskId = new Types.ObjectId(taskId);
    const activities = await this.activityRepository.findAll(
      {
        project: objectProjectId,
        createdAt: {
          $gte: queries.startDate || 0,
          $lte: queries.endDate || new Date().toISOString(),
        },
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

    return {
      data: activities.data.map((activity) => ({
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
      })),
      pagination: activities.pagination,
    };
  }
}
