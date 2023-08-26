import { PickType } from '@nestjs/swagger';
import { CreateUserProjectDto } from 'src/modules/user-project/dto/create-user-project.dto';

export class RemoveMemberRequest extends PickType(CreateUserProjectDto, [
  'userId',
]) {}
