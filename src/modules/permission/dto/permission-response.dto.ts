import { ApiProperty } from '@nestjs/swagger';

export class RolePermissionResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  roleName: string;

  @ApiProperty()
  menu: string;

  @ApiProperty()
  create: boolean;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  update: boolean;

  @ApiProperty()
  delete: boolean;
}
