import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { RoleName } from 'src/shared/enums';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';
import { RoleDocument } from 'src/modules/roles/entities/role.entity';
import { UserProjectDocument } from 'src/modules/user-project/entities/user-project.entity';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(
    private rolesRepository: RolesRepository,
    private userProjectService: UserProjectService,
  ) {}

  async findOneRole(
    queryOptions: FilterQuery<RoleDocument>,
  ): Promise<RoleDocument> {
    const role = await this.rolesRepository.findOne(queryOptions);
    if (!role) throw new DocumentNotFoundException('Role not found');
    return role;
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
