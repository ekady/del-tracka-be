import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupProjectService } from './group-project.service';
import { CreateGroupProjectDto } from './dto/create-group-project.dto';
import { UpdateGroupProjectDto } from './dto/update-group-project.dto';

@Controller('group-project')
export class GroupProjectController {
  constructor(private readonly groupProjectService: GroupProjectService) {}

  @Post()
  create(@Body() createGroupProjectDto: CreateGroupProjectDto) {
    return this.groupProjectService.create(createGroupProjectDto);
  }

  @Get()
  findAll() {
    return this.groupProjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupProjectService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupProjectDto: UpdateGroupProjectDto,
  ) {
    return this.groupProjectService.update(+id, updateGroupProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupProjectService.remove(+id);
  }
}
