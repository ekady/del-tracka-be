import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { MyTaskResponseDto } from '../dto';
import { TasksRepository } from '../repositories/tasks.repository';

@Injectable()
export class MyTasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async findMyTasks(userId: string): Promise<MyTaskResponseDto[]> {
    const user = new Types.ObjectId(userId);
    const userField = {
      _id: 1,
      firstName: 1,
      lastName: 1,
      picture: 1,
      email: 1,
    };
    const nameField = { _id: 1, name: 1 };
    const lookupReporter = {
      from: 'userentities',
      localField: 'reporter',
      foreignField: '_id',
      as: 'reporter',
      pipeline: [{ $project: userField }],
    };
    const lookupAssignee = {
      from: 'userentities',
      localField: 'assignee',
      foreignField: '_id',
      as: 'assignee',
      pipeline: [{ $project: userField }],
    };
    const lookupRole = {
      from: 'roleentities',
      localField: 'role',
      foreignField: '_id',
      as: 'role',
      pipeline: [{ $project: nameField }],
    };
    const lookupUserProject = {
      from: 'userprojectentities',
      localField: '_id',
      foreignField: 'project',
      as: 'userproject',
      pipeline: [
        { $match: { user } },
        { $lookup: lookupRole },
        { $unwind: '$role' },
      ],
    };
    const lookupProject = {
      from: 'projectentities',
      localField: 'project',
      foreignField: '_id',
      as: 'project',
      pipeline: [{ $lookup: lookupUserProject }, { $unwind: '$userproject' }],
    };
    const lookupStage = {
      from: 'stageentities',
      localField: 'stage',
      foreignField: '_id',
      as: 'stage',
      pipeline: [{ $lookup: lookupProject }, { $unwind: '$project' }],
    };
    return this.tasksRepository.aggregate([
      { $match: { $or: [{ assignee: user }, { reporter: user }] } },
      { $lookup: lookupStage },
      { $unwind: '$stage' },
      { $lookup: lookupReporter },
      { $lookup: lookupAssignee },
      {
        $project: {
          _id: 1,
          title: 1,
          feature: 1,
          description: 1,
          priority: 1,
          status: 1,
          assignee: { $arrayElemAt: ['$assignee', 0] },
          reporter: { $arrayElemAt: ['$reporter', 0] },
          stage: { _id: 1, name: 1 },
          project: { _id: '$stage.project._id', name: '$stage.project.name' },
          role: '$stage.project.userproject.role',
        },
      },
    ]);
  }
}
