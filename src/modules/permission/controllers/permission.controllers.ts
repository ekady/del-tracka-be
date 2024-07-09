import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiResProperty } from 'src/shared/decorators';

import { RolePermissionResponseDto } from '../dto/permission-response.dto';
import { PermissionService } from '../services/permission.service';

@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  @ApiResProperty(RolePermissionResponseDto, 200)
  findAll(): Promise<Record<string, RolePermissionResponseDto[]>> {
    return this.permissionService.findPermissions();
  }
}
