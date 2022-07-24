import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtPayload } from '../auth/dto';
import { JwtPayloadReq } from '../auth/decorators';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { AddUpdateMemberDto, ProjectResponseDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id } = jwtPayload;
    return this.projectsService.create(id, createProjectDto);
  }

  @Get()
  @ApiResProperty([ProjectResponseDto], 200)
  findAll(): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiResProperty(ProjectResponseDto, 200)
  findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(id);
  }

  @Put(':id')
  @ApiResProperty(ProjectResponseDto, 200)
  update(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.update(userId, id, updateProjectDto);
  }

  @Delete(':id')
  @ApiResProperty(StatusMessageDto, 200)
  remove(@Param('id') id: string): Promise<StatusMessageDto> {
    return this.projectsService.remove(id);
  }

  @Post(':id/member')
  @ApiResProperty(StatusMessageDto, 201)
  getMember(
    @Param('id') id: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    return this.projectsService.addMember(id, addUpdateMemberDto);
  }

  @Get(':id/member')
  @ApiResProperty(StatusMessageDto, 200)
  addMember(@Param('id') id: string) {
    return this.projectsService.getMember(id);
  }

  @Delete(':id/member')
  @ApiResProperty(StatusMessageDto, 200)
  removeMember(
    @Param('id') id: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    return this.projectsService.removeMember(id, addUpdateMemberDto);
  }
}
