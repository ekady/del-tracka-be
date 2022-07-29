import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ProjectRoleName } from 'src/common/enums';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import {
  Permission,
  PermissionDocument,
} from 'src/database/schema/permission/permission.schema';
import {
  ProjectRole,
  ProjectRoleDocument,
} from 'src/database/schema/project-role/project-role.schema';
import { UserProjectService } from '../user-project/user-project.service';

@Injectable()
export class ProjectRolesService {
  constructor(
    @InjectModel(ProjectRole.name)
    private projectRoleSchema: Model<ProjectRoleDocument>,

    @InjectModel(Permission.name)
    private permissionSchema: Model<PermissionDocument>,

    private userProjectService: UserProjectService,
  ) {}

  async findOneRole(
    queryOptions: FilterQuery<ProjectRoleDocument>,
  ): Promise<ProjectRoleDocument> {
    const role = await this.projectRoleSchema.findOne(queryOptions).exec();
    if (!role) throw new DocumentNotFoundException('Role not found');
    return role;
  }

  async findOnePermission(
    queryOptions: FilterQuery<PermissionDocument>,
  ): Promise<PermissionDocument> {
    const permision = await this.permissionSchema.findOne(queryOptions).exec();
    if (!permision) throw new DocumentNotFoundException('Permission not found');
    return permision;
  }

  async findProjectOwner(projectId: string): Promise<string> {
    const roleOwner = await this.findOneRole({ name: ProjectRoleName.OWNER });
    const userProject = await this.userProjectService.findOne(
      { project: projectId, role: roleOwner._id },
      [{ path: 'user', select: '_id' }],
    );
    return userProject?.user?._id ?? '';
  }
}
