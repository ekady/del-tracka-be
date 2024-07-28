import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { RolePermission } from 'src/modules/role/decorator';
import { ITaskShortIds } from 'src/modules/task/interfaces/taskShortIds.interface';
import { ApiResProperty } from 'src/shared/decorators';
import { QueryPagination } from 'src/shared/decorators/query-pagination.decorator';
import { StatusMessageDto } from 'src/shared/dto';
import { EPermissionMenu, EProjectMenu } from 'src/shared/enums';
import {
  IPaginationOptions,
  IPaginationResponse,
} from 'src/shared/interfaces/pagination.interface';

import { CommentResponse } from '../dto';
import { CreateCommentRequestDto } from '../dto/create-comment.dto';
import { CommentService } from '../services/comment.service';

@ApiTags('Task Comment')
@Controller(
  'project/:projectShortId/stage/:stageShortId/task/:taskShortId/comment',
)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiResProperty(StatusMessageDto, 201)
  @RolePermission(EProjectMenu.Comment, EPermissionMenu.Create)
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
    return this.commentService.create(ids, user.id, createDto);
  }

  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiResProperty([CommentResponse], 201)
  @RolePermission(EProjectMenu.Comment, EPermissionMenu.Read)
  @QueryPagination()
  findAll(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('taskShortId') taskShortId: string,
    @Query() queries: Record<string, string> & IPaginationOptions,
  ): Promise<IPaginationResponse<CommentResponse[]>> {
    const ids: ITaskShortIds = {
      projectShortId,
      stageShortId,
      taskShortId,
    };
    return this.commentService.findAll(ids, queries);
  }
}
