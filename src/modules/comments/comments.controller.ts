import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { JwtPayloadReq } from '../auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { RolePermission } from '../roles/decorator';
import { ITaskShortIds } from '../tasks/interfaces/taskShortIds.interface';
import { CommentsService } from './comments.service';
import { CommentResponse } from './dto';
import { CreateCommentRequestDto } from './dto/create-comment.dto';

@ApiTags('Tasks')
@Controller(
  'projects/:projectShortId/stages/:stageShortId/tasks/:taskShortId/comments',
)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiResProperty(StatusMessageDto, 201)
  @RolePermission(ProjectMenu.Comment, PermissionMenu.Create)
  create(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('taskShortId') taskShortId: string,
    @Body() createDto: CreateCommentRequestDto,
  ): Promise<StatusMessageDto> {
    const ids: ITaskShortIds = {
      projectShortId,
      stageShortId,
      taskShortId,
    };
    return this.commentsService.create(ids, user.id, createDto);
  }

  @Get()
  @ApiResProperty([CommentResponse], 201)
  @RolePermission(ProjectMenu.Comment, PermissionMenu.Read)
  findAll(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('taskShortId') taskShortId: string,
  ): Promise<CommentResponse[]> {
    const ids: ITaskShortIds = {
      projectShortId,
      stageShortId,
      taskShortId,
    };
    return this.commentsService.findAll(ids);
  }
}
