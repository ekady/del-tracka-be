import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GroupProject,
  GroupProjectDocument,
} from 'src/database/schema/group-project/group-project.schema';
import { UserProjectService } from '../user-project/user-project.service';
import { CreateGroupProjectDto } from './dto/create-group-project.dto';
import { UpdateGroupProjectDto } from './dto/update-group-project.dto';

@Injectable()
export class GroupProjectService {
  constructor(
    @InjectModel(GroupProject.name)
    private groupProjectSchema: Model<GroupProjectDocument>,
    private userProjectService: UserProjectService,
  ) {}

  async create(createGroupProjectDto: CreateGroupProjectDto) {
    console.log(createGroupProjectDto);
    return 'This action adds a new groupProject';
  }

  findAll() {
    return `This action returns all groupProject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupProject`;
  }

  update(id: number, updateGroupProjectDto: UpdateGroupProjectDto) {
    return `This action updates a #${id} groupProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupProject`;
  }
}
