import { Injectable } from '@nestjs/common';
import { DocumentExistException } from 'src/common/http-exceptions/exceptions';
import { TaskDocument } from 'src/modules/tasks/entities/task.entity';
import { StagesHelperService } from 'src/modules/stages/services';
import { ITaskIds } from '../interfaces/taskIds.interface';
import { ITaskShortIds } from '../interfaces/taskShortIds.interface';
import { TasksRepository } from '../repositories/tasks.repository';
import { Types } from 'mongoose';

@Injectable()
export class TasksHelperService {
  constructor(
    private tasksRepository: TasksRepository,
    private stagesHelperService: StagesHelperService,
  ) {}

  async findTaskById(ids: ITaskIds, select?: string): Promise<TaskDocument> {
    const { taskId, projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageById(
      stageId,
      projectId,
    );
    const task = await this.tasksRepository.findOne(
      {
        _id: new Types.ObjectId(taskId),
        stage: stage._id,
      },
      { populate: true },
    );

    if (!task) throw new DocumentExistException('Task not found');
    return task;
  }

  async findTaskByShortId(ids: ITaskShortIds): Promise<TaskDocument> {
    const { taskId, projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageByShortId(
      stageId,
      projectId,
    );
    const task = await this.tasksRepository.findOne(
      {
        shortId: taskId,
        stage: stage._id,
      },
      { populate: true },
    );

    if (!task) throw new DocumentExistException('Task not found');
    return task;
  }
}
