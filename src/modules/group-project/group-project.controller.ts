import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { GroupProjectService } from './group-project.service';
import { CreateGroupProjectDto } from './dto/create-group-project.dto';
import { UpdateGroupProjectDto } from './dto/update-group-project.dto';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtPayloadReq } from '../auth/decorators';
import { JwtPayload } from '../auth/dto';
import { GroupProjectResponse } from './dto/group-project-response.dto';

@ApiTags('Group-Project')
@Controller('group-project')
export class GroupProjectController {
  constructor(private readonly groupProjectService: GroupProjectService) {}

  @Post()
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Body() createDto: CreateGroupProjectDto,
  ): Promise<StatusMessageDto> {
    return this.groupProjectService.create(jwtPayload.id, createDto);
  }

  @Get()
  @ApiResProperty([GroupProjectResponse], 201)
  findAll(): Promise<GroupProjectResponse[]> {
    return this.groupProjectService.findAll();
  }

  @Get(':id')
  @ApiResProperty(GroupProjectResponse, 201)
  findOne(@Param('id') id: string): Promise<GroupProjectResponse> {
    return this.groupProjectService.findOne(id);
  }

  @Put(':id')
  @ApiResProperty(GroupProjectResponse, 201)
  update(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Param('id') id: string,
    @Body() updateGroupProjectDto: UpdateGroupProjectDto,
  ): Promise<GroupProjectResponse> {
    const userId = jwtPayload.id;
    return this.groupProjectService.update(userId, id, updateGroupProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupProjectService.remove(id);
  }
}
