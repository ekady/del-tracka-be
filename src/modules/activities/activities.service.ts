import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import {
  ActivityEntity,
  ActivityDocument,
} from 'src/modules/activities/schema/activity.schema';
import { ActivityProjection } from './constants';
import { ActivityResponseDto } from './dto';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(ActivityEntity.name)
    private activitySchema: Model<ActivityDocument>,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
  ): Promise<StatusMessageDto> {
    const { project, createdBy, ...createDto } = createActivityDto;
    const payload = {
      createdBy: new Types.ObjectId(createdBy),
      project: new Types.ObjectId(project),
      ...createDto,
    };
    await this.activitySchema.create(payload);
    return {
      message: 'Success',
    };
  }

  async findActivitiesByProjectId(
    projectId: string,
  ): Promise<ActivityResponseDto[]> {
    return this.activitySchema
      .find(
        { project: new Types.ObjectId(projectId) },
        { ...ActivityProjection },
      )
      .sort({ createdAt: -1 })
      .populate([
        { path: 'createdBy', select: '_id firstName lastName' },
        { path: 'project', select: '_id name description shortId' },
      ]);
  }

  async findActivitiesStage(
    projectId: string,
    stageId: string,
  ): Promise<ActivityResponseDto[]> {
    const objectProjectId = new Types.ObjectId(projectId);
    const objectStageId = new Types.ObjectId(stageId);
    return this.activitySchema
      .find(
        {
          project: objectProjectId,
          $or: [
            { 'stageAfter._id': objectStageId },
            { 'stageBefore._id': objectStageId },
          ],
        },
        { ...ActivityProjection },
      )
      .sort({ createdAt: -1 })
      .populate([
        { path: 'createdBy', select: '_id firstName lastName' },
        { path: 'project', select: '_id name description shortId' },
      ]);
  }

  async findActivitiesTask(
    projectId: string,
    stageId: string,
    taskId: string,
  ): Promise<ActivityResponseDto[]> {
    const objectProjectId = new Types.ObjectId(projectId);
    const objectStageId = new Types.ObjectId(stageId);
    const objectTaskId = new Types.ObjectId(taskId);
    return this.activitySchema
      .find(
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
        { ...ActivityProjection },
      )
      .sort({ createdAt: -1 })
      .populate([
        { path: 'createdBy', select: '_id firstName lastName' },
        { path: 'project', select: '_id name description shortId' },
      ]);
  }
}
