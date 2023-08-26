import { Injectable } from '@nestjs/common';
import { DocumentExistException } from 'src/shared/http-exceptions/exceptions';
import { TaskDocument } from 'src/modules/task/entities/task.entity';
import { StageHelperService } from 'src/modules/stage/services';
import { ITaskIds } from '../interfaces/taskIds.interface';
import { ITaskShortIds } from '../interfaces/taskShortIds.interface';
import { TaskRepository } from '../repositories/task.repository';
import { Types } from 'mongoose';

@Injectable()
export class TaskHelperService {
  constructor(
    private taskRepository: TaskRepository,
    private stageHelperService: StageHelperService,
  ) {}

  async findTaskById(
    ids: ITaskIds,
    select?: Record<string, number>,
  ): Promise<TaskDocument> {
    const { taskId, projectId, stageId } = ids;
    const stage = await this.stageHelperService.findStageById(
      stageId,
      projectId,
    );
    const task = await this.taskRepository.findOne(
      {
        _id: new Types.ObjectId(taskId),
        stage: stage._id,
      },
      { populate: true, select },
    );

    if (!task) throw new DocumentExistException('Task not found');
    return task;
  }

  async findTaskByShortId(ids: ITaskShortIds): Promise<TaskDocument> {
    const { taskShortId, projectShortId, stageShortId } = ids;
    const stage = await this.stageHelperService.findStageByShortId(
      stageShortId,
      projectShortId,
    );
    const task = await this.taskRepository.findOne(
      {
        shortId: taskShortId,
        stage: stage._id,
      },
      { populate: true },
    );

    if (!task) throw new DocumentExistException('Task not found');
    return task;
  }
}
