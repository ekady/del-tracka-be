import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { RoleName } from 'src/common/enums';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import {
  Permission,
  PermissionDocument,
} from 'src/database/schema/permission/permission.schema';
import { RoleEntity, RoleDocument } from 'src/modules/roles/schema/role.schema';
import { UserProjectDocument } from 'src/database/schema/user-project/user-project.schema';
import { UserProjectService } from '../user-project/user-project.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleEntity.name)
    private rolesServiceSchema: Model<RoleDocument>,

    @InjectModel(Permission.name)
    private permissionSchema: Model<PermissionDocument>,

    private userProjectService: UserProjectService,
  ) {}

  async findOneRole(
    queryOptions: FilterQuery<RoleDocument>,
  ): Promise<RoleDocument> {
    const role = await this.rolesServiceSchema.findOne(queryOptions).exec();
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

  async findProjectOwners(projectId: string): Promise<UserProjectDocument[]> {
    const roleOwner = await this.findOneRole({ name: RoleName.OWNER });
    const userProject = await this.userProjectService.findUserProjectsByRoleId(
      projectId,
      roleOwner._id,
    );
    return userProject;
  }

  async findProjectOwner(projectId: string): Promise<string> {
    const userProject = await this.findProjectOwners(projectId);
    return userProject?.[0].user?._id ?? '';
  }
}
