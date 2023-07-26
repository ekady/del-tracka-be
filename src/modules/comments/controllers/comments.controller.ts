import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/shared/decorators';
import { StatusMessageDto } from 'src/shared/dto';
import { PermissionMenu, ProjectMenu } from 'src/shared/enums';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { RolePermission } from 'src/modules/roles/decorator';
import { ITaskShortIds } from 'src/modules/tasks/interfaces/taskShortIds.interface';
import { CommentsService } from '../services/comments.service';
import { CommentResponse } from '../dto';
import { CreateCommentRequestDto } from '../dto/create-comment.dto';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { Throttle } from '@nestjs/throttler';

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
  @Throttle(60, 60)
  @ApiResProperty([CommentResponse], 201)
  @RolePermission(ProjectMenu.Comment, PermissionMenu.Read)
  findAll(
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('taskId') taskId: string,
    @Query() queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<CommentResponse[]>> {
    const ids: ITaskShortIds = {
      projectId,
      stageId,
      taskId,
    };
    return this.commentsService.findAll(ids, queries);
  }
}
