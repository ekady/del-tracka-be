import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { MyTaskResponseDto } from 'src/modules/my-task/dto/my-task-response.dto';
import { TaskRepository } from 'src/modules/task/repositories/task.repository';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import {
  helperLookupStage,
  helperUserAssigneeAndReporter,
} from '../helpers/my-task.helper';

@Injectable()
export class MyTaskService {
  constructor(private taskRepository: TaskRepository) {}

  async findMyTask(
    userId: string,
    queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<MyTaskResponseDto[]>> {
    const user = new Types.ObjectId(userId);

    if (queries.sortBy) {
      const [field, order] = queries.sortBy.split('|');
      queries.sort = { [field]: Number(order) };
      delete queries.sortBy;
    } else queries.sort = undefined;

    // Filter by Priority and Status
    const filter: {
      status?: { $in: string[] };
      priority?: { $in: string[] };
    } = {};
    if (queries.priority) {
      filter.priority = Array.isArray(queries.priority)
        ? { $in: queries.priority }
        : { $in: queries.priority.split(',') };
    }
    if (queries.status) {
      filter.status = Array.isArray(queries.status)
        ? { $in: queries.status }
        : { $in: queries.status.split(',') };
    }

    // Filter Project Name
    const filterProjectName = queries?.project
      ? { shortId: queries.project }
      : {};

    // Clean up query search
    if (queries.search) queries.search = queries.search.replace('#', '');

    const { lookupAssignee, lookupReporter } = helperUserAssigneeAndReporter();
    const lookupStage = helperLookupStage(user, filterProjectName);

    return this.taskRepository.findAllAggregate(
      [
        {
          $match: {
            $or: [{ assignee: user }, { reporter: user }],
            ...filter,
          },
        },
        { $lookup: lookupStage },
        { $unwind: '$stage' },
        { $lookup: lookupReporter },
        { $lookup: lookupAssignee },
        {
          $project: {
            _id: 1,
            shortId: 1,
            title: 1,
            feature: 1,
            description: 1,
            priority: 1,
            status: 1,
            assignee: { $arrayElemAt: ['$assignee', 0] },
            reporter: { $arrayElemAt: ['$reporter', 0] },
            stage: { _id: 1, name: 1, shortId: 1 },
            project: {
              _id: '$stage.project._id',
              name: '$stage.project.name',
              shortId: '$stage.project.shortId',
            },
            role: {
              _id: '$stage.project.userproject.role._id',
              name: '$stage.project.userproject.role.name',
            },
            permissions: '$stage.project.userproject.role.permissions',
            updatedAt: 1,
            result: 1,
          },
        },
      ],
      { ...queries, searchField: ['shortId', 'title', 'feature'] },
    );
  }
}
