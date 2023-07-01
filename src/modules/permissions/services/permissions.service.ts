import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';
import { PermissionDocument } from '../entities/permission.entity';
import { PermissionsRepository } from '../repositories/permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private permissionRepository: PermissionsRepository) {}

  async findAll(
    queryOptions: FilterQuery<PermissionDocument>,
  ): Promise<PermissionDocument[]> {
    const permision = await this.permissionRepository.findAll(queryOptions, {
      disablePagination: true,
      limit: undefined,
      page: undefined,
    });
    if (!permision) throw new DocumentNotFoundException('Permission not found');
    return permision.data;
  }

  async findOne(
    queryOptions: FilterQuery<PermissionDocument>,
  ): Promise<PermissionDocument> {
    const permision = await this.permissionRepository.findOne(queryOptions);
    if (!permision) throw new DocumentNotFoundException('Permission not found');
    return permision;
  }
}
