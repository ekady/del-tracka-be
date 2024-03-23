import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';

import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';
import { TPermissionDocument } from '../entities/permission.entity';
import { PermissionRepository } from '../repositories/permission.repository';
import { RolePermissionResponseDto } from '../dto/permission-response.dto';

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  async findAll(
    queryOptions: FilterQuery<TPermissionDocument>,
  ): Promise<TPermissionDocument[]> {
    const permision = await this.permissionRepository.findAll(queryOptions, {
      disablePagination: true,
      limit: undefined,
      page: undefined,
      populate: true,
    });
    if (!permision) throw new DocumentNotFoundException('Permission not found');
    return permision.data;
  }

  async findPermissions(): Promise<
    Record<string, RolePermissionResponseDto[]>
  > {
    const permissions = await this.findAll({});
    return permissions.reduce((acc, rolePermission) => {
      acc[rolePermission.role.name] = {
        ...acc[rolePermission.role.name],
        [rolePermission.menu]: {
          menu: rolePermission.menu,
          create: rolePermission.create,
          read: rolePermission.read,
          update: rolePermission.update,
          delete: rolePermission.delete,
        },
      };
      return acc;
    }, {});
  }

  async findOne(
    queryOptions: FilterQuery<TPermissionDocument>,
  ): Promise<TPermissionDocument> {
    const permision = await this.permissionRepository.findOne(queryOptions);
    if (!permision) throw new DocumentNotFoundException('Permission not found');
    return permision;
  }
}
