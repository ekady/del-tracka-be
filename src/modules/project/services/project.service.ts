import { Injectable, StreamableFile } from '@nestjs/common';
import { IContent, IJsonSheet } from 'json-as-xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { StatusMessageDto } from 'src/shared/dto';
import { RoleName } from 'src/shared/enums';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';
import { ActivityResponseDto } from 'src/modules/activity/dto';
import { RoleService } from 'src/modules/role/services/role.service';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import {
  CreateProjectDto,
  ProjectResponseDto,
  ProjectResponseWithStagesDto,
  UpdateProjectDto,
} from '../dto';
import { ProjectHelperService } from './project-helper.service';
import { ProjectRepository } from '../repositories/project.repository';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { PermissionService } from 'src/modules/permission/services/permission.service';
import { TransformActivityMessage } from '../helpers/transform-activity.helper';
import { generateExcel } from '../helpers/generate-excel.helper';

@Injectable()
export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository,
    private projectHelperService: ProjectHelperService,
    private userProjectService: UserProjectService,
    private roleService: RoleService,
    private activityService: ActivityService,
    private permissionService: PermissionService,
  ) {}

  async create(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<StatusMessageDto> {
    const payload = {
      ...createProjectDto,
      createdBy: userId,
      updatedBy: userId,
    };
    const role = await this.roleService.findOneRole({
      name: RoleName.OWNER,
    });
    const project = await this.projectRepository.create(payload);

    await this.userProjectService.addUserProject(
      { projectId: project._id, userId, roleId: role._id },
      userId,
    );
    return { message: 'Success' };
  }

  async findAll(userId: string): Promise<ProjectResponseWithStagesDto[]> {
    const userProject = await this.userProjectService.findUserProject(userId);
    return userProject.map((userProject) => ({
      _id: userProject.project._id,
      name: userProject.project.name,
      description: userProject.project.description,
      shortId: userProject.project.shortId,
      role: userProject.role.name,
      stages: userProject.stages,
      rolePermissions: userProject.role.permissions.map((permission) => ({
        menu: permission.menu,
        read: permission.read,
        create: permission.create,
        update: permission.update,
        delete: permission.delete,
      })),
    }));
  }

  async findOne(shortId: string, userId: string): Promise<ProjectResponseDto> {
    const userProject = await this.userProjectService.findUserProjects(
      userId,
      shortId,
    );
    const rolePermissions = await this.permissionService.findAll({
      role: userProject.role._id,
    });
    return {
      _id: userProject.project._id,
      createdAt: userProject.project.createdAt,
      updatedAt: userProject.project.updatedAt,
      name: userProject.project.name,
      description: userProject.project.description,
      shortId: userProject.project.shortId,
      role: userProject.role.name,
      stages: userProject.stages,
      rolePermissions: rolePermissions.map((permission) => ({
        menu: permission.menu,
        create: permission.create,
        read: permission.read,
        update: permission.update,
        delete: permission.delete,
      })),
    };
  }

  async update(
    userId: string,
    shortId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<StatusMessageDto> {
    const payload = { ...updateProjectDto, updatedBy: userId };
    const project = await this.projectRepository.updateOne(
      { shortId },
      payload,
    );

    if (!project) throw new DocumentNotFoundException('Project not found');

    return { message: 'Success' };
  }

  async remove(shortId: string): Promise<StatusMessageDto> {
    const project = await this.projectRepository.softDeleteOne({ shortId });
    await this.userProjectService.deleteAllUserProject(project._id);
    return { message: 'Success' };
  }

  async findActivity(
    shortId: string,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<ActivityResponseDto[]>> {
    const project =
      await this.projectHelperService.findProjectByShortId(shortId);
    return this.activityService.findActivityByProjectId(project._id, queries);
  }

  async getActivityPdf(
    shortId: string,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<StreamableFile> {
    const activities = await this.findActivity(shortId, queries);

    const header = ['Date', 'Project Name', 'Sprint', 'Activitiy'];
    const content = [];

    activities.data.forEach((activity) => {
      const date = new Date(activity.createdAt).toLocaleString();
      const project = activity.project;
      const sprint =
        activity.stageAfter?.name || activity.stageBefore?.name || '-';
      const act = TransformActivityMessage[activity.type](activity);
      content.push([date, project, sprint, act]);
    });

    const pdfContent = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [header, ...content],
          },
        },
      ],
    };

    const pdf = pdfMake.createPdf(
      pdfContent,
      undefined,
      undefined,
      pdfFonts.pdfMake.vfs,
    );

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      pdf.getBuffer((buffer) => resolve(buffer));
    });

    return new StreamableFile(pdfBuffer);
  }

  async getActivityExcel(
    shortId: string,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<StreamableFile> {
    const activities = await this.findActivity(shortId, queries);

    const content: IContent[] = activities.data.map((activity) => ({
      sprint: activity.stageAfter?.name || activity.stageBefore?.name || '-',
      activity: TransformActivityMessage[activity.type](activity),
      project: activity.project,
      createdAt: new Date(activity.createdAt).toLocaleString(),
    }));

    const columns: IJsonSheet[] = [
      {
        sheet: 'Activity',
        columns: [
          { label: 'Date', value: 'createdAt' },
          { label: 'Project Name', value: 'project' },
          { label: 'Sprint', value: 'sprint' },
          { label: 'Activity', value: 'activity' },
        ],
        content,
      },
    ];

    const excel = generateExcel(columns);

    return new StreamableFile(excel);
  }
}
