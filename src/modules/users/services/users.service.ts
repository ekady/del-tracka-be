import { Injectable } from '@nestjs/common';

import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import { UserDocument } from 'src/modules/users/entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRespository: UsersRepository) {}

  async findOne(id: string, notFoundError?: string): Promise<UserDocument> {
    const user = await this.usersRespository.findOneById(id);
    if (!user) {
      const errorMessage = notFoundError || 'User not found';
      throw new DocumentNotFoundException(errorMessage);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.usersRespository.findOne({ email });
    if (!user) throw new DocumentNotFoundException('User not found');

    return user;
  }
}
