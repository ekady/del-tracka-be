import { Injectable } from '@nestjs/common';

import { TUserDocument } from 'src/modules/user/entities/user.entity';
import { StatusMessageDto } from 'src/shared/dto';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';

import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRespository: UserRepository) {}

  async findOne(id: string, notFoundError?: string): Promise<TUserDocument> {
    const user = await this.userRespository.findOneById(id);
    if (!user) {
      const errorMessage = notFoundError || 'User not found';
      throw new DocumentNotFoundException(errorMessage);
    }
    return user;
  }

  async findByEmail(email: string): Promise<TUserDocument> {
    const user = await this.userRespository.findOne({ email });
    if (!user) throw new DocumentNotFoundException('User not found');

    return user;
  }

  async registerDevice(
    deviceId: string,
    userId: string,
  ): Promise<StatusMessageDto> {
    const user = await this.userRespository.updateOneById(userId, {
      deviceId,
    });
    if (!user) throw new DocumentNotFoundException('User not found');

    return { message: 'Success' };
  }

  async removeDevice(userId: string) {
    const user = await this.userRespository.updateOneById(userId, {
      deviceId: null,
    });
    if (!user) throw new DocumentNotFoundException('User not found');

    return { message: 'Success' };
  }
}
