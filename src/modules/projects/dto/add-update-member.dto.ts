import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { RoleName } from 'src/common/enums';
import { CreateUserProjectDto } from 'src/modules/user-project/dto/create-user-project.dto';

export class AddUpdateMemberDto extends OmitType(CreateUserProjectDto, [
  'projectId',
  'roleId',
]) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleName: RoleName;
}
