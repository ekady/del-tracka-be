import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { RolePermission } from 'src/modules/roles/decorator';
import { ITaskShortIds } from 'src/modules/tasks/interfaces/taskShortIds.interface';
import { CommentsService } from '../services/comments.service';
import { CommentResponse } from '../dto';
import { CreateCommentRequestDto } from '../dto/create-comment.dto';

@ApiTags('Tasks')
@Controller('projects/:projectId/stages/:stageId/tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiResProperty(StatusMessageDto, 201)
  @RolePermission(ProjectMenu.Comment, PermissionMenu.Create)
  create(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('taskId') taskId: string,
    @Body() createDto: CreateCommentRequestDto,
  ): Promise<StatusMessageDto> {
    const ids: ITaskShortIds = {
      projectId,
      stageId,
      taskId,
    };
    return this.commentsService.create(ids, user.id, createDto);
  }

  @Get()
  @ApiResProperty([CommentResponse], 201)
  @RolePermission(ProjectMenu.Comment, PermissionMenu.Read)
  findAll(
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('taskId') taskId: string,
  ): Promise<CommentResponse[]> {
    const ids: ITaskShortIds = {
      projectId,
      stageId,
      taskId,
    };
    return this.commentsService.findAll(ids);
  }
}
