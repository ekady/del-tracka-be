import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';
import { PermissionDocument } from '../entities/permission.entity';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

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
