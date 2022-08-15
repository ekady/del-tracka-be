import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/common/decorators';
import { IdsDto, StatusMessageDto } from 'src/common/dto';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { JwtPayloadReq } from '../auth/decorators';
import { JwtPayload } from '../auth/dto';
import { RolePermission } from '../roles/decorator';
import { CommentsService } from './comments.service';
import { CommentResponse } from './dto';
import { CreateCommentRequestDto } from './dto/create-comment.dto';

@ApiTags('Tasks')
@Controller('projects/:projectId/stages/:stageId/tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiResProperty(StatusMessageDto, 201)
  @RolePermission(ProjectMenu.Comment, PermissionMenu.Create)
  create(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('taskId') taskId: string,
    @Body() createDto: CreateCommentRequestDto,
  ): Promise<StatusMessageDto> {
    const ids: IdsDto = { userId: user.id, projectId, stageId, taskId };
    return this.commentsService.create(ids, createDto);
  }

  @Get()
  @ApiResProperty([CommentResponse], 201)
  @RolePermission(ProjectMenu.Comment, PermissionMenu.Read)
  findAll(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('taskId') taskId: string,
  ): Promise<CommentResponse[]> {
    const ids: IdsDto = { userId: user.id, projectId, stageId, taskId };
    return this.commentsService.findAll(ids);
  }
}
