import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { ActivityName } from 'src/common/enums';
import { DocumentExistException } from 'src/common/http-exceptions/exceptions';
import { TaskDocument } from 'src/modules/tasks/schema/task.schema';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import { CreateActivityDto } from 'src/modules/activities/dto';
import { StagesHelperService } from 'src/modules/stages/services';
import { UserProjectResponseDto } from 'src/modules/user-project/dto';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { UpdateTaskDto, UpdateTaskRequestDto } from '../dto';
import { ITaskIds } from '../interfaces/taskIds.interface';
import { ITaskShortIds } from '../interfaces/taskShortIds.interface';
import { TasksRepository } from '../repositories/tasks.repository';

@Injectable()
export class TasksHelperService {
  constructor(
    private tasksRepository: TasksRepository,
    private stagesHelperService: StagesHelperService,
    private userProjectService: UserProjectService,
    private activitiesService: ActivitiesService,
  ) {}

  async checkTaskExist(
    ids: Pick<ITaskIds, 'projectId' | 'stageId'>,
    query: FilterQuery<TaskDocument>,
  ): Promise<void> {
    const { projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageById(
      stageId,
      projectId,
    );
    const task = await this.tasksRepository.findOne({
      ...query,
      stage: stage._id,
    });

    if (task) {
      throw new DocumentExistException('Task already exists.');
    }
  }

  async findTaskById(ids: ITaskIds, select?: string): Promise<TaskDocument> {
    const { taskId, projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageById(
      stageId,
      projectId,
    );
    const task = await this.tasksRepository.findOne({
      _id: new Types.ObjectId(taskId),
      stage: stage._id,
    });

    if (!task) throw new DocumentExistException('Task not found');
    return task;
  }

  async findTaskByShortId(ids: ITaskShortIds): Promise<TaskDocument> {
    const { taskId, projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageByShortId(
      stageId,
      projectId,
    );
    const task = await this.tasksRepository.findOne({
      shortId: taskId,
      stage: stage._id,
    });

    if (!task) throw new DocumentExistException('Task not found');
    return task;
  }

  async findUserForTask(
    userId: string,
    projectId: string,
    errorMessage?: string,
  ): Promise<UserProjectResponseDto> {
    if (!userId) return null;
    return this.userProjectService.findUserProject(
      userId,
      projectId,
      errorMessage,
    );
  }

  async createTaskActivity(payload: CreateActivityDto): Promise<void> {
    await this.activitiesService.create(payload);
  }

  async update(
    ids: ITaskShortIds & { userId: string },
    updateRequestDto: UpdateTaskRequestDto,
    type: ActivityName.UPDATE_TASK | ActivityName.UPDATE_TASK_STATUS,
  ): Promise<TaskDocument> {
    const { projectId, stageId, userId } = ids;
    const stage = await this.stagesHelperService.findStageByShortId(
      stageId,
      projectId,
    );
    const taskFound = await this.findTaskByShortId(ids);
    await this.checkTaskExist(
      { projectId: stage.project._id, stageId: stage._id },
      { title: updateRequestDto.title, _id: { $ne: taskFound._id } },
    );
    const { images, assignee, reporter, ...taskValues } = updateRequestDto;
    const userAssignee = await this.findUserForTask(
      assignee,
      stage.project._id,
      'Assignee not found',
    );
    const userReporter = await this.findUserForTask(
      reporter,
      stage.project._id,
      'Reporter not found',
    );
    const payload: UpdateTaskDto = {
      ...taskValues,
      updatedBy: userId,
      reporter: userReporter?.user._id ?? userId,
      assignee: userAssignee?.user._id,
      images: images?.map((image) => image.originalname),
    };
    const taskUpdate = await this.tasksRepository.updateOne(
      { _id: taskFound._id, stage: stage._id },
      payload,
    );

    await this.createTaskActivity({
      type,
      createdBy: taskUpdate.updatedBy._id,
      project: stage.project._id,
      stageBefore: stage.depopulate(),
      stageAfter: taskUpdate.stage.depopulate(),
      taskBefore: taskFound.depopulate(),
      taskAfter: taskUpdate.depopulate(),
    });
    return taskFound;
  }
}
