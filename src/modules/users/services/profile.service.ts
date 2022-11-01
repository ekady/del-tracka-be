import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { UserEntity, UserDocument } from 'src/modules/users/schema/user.schema';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class ProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async findProfile(id: string): Promise<ProfileResponseDto> {
    return this.usersRepository.findOneById(id);
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const { picture, password, passwordConfirm, ...data } = updateProfileDto;
    const userValues = { ...data, picture: picture?.originalname };

    let user = await this.usersRepository.updateOneById(id, userValues);
    if (password || passwordConfirm) {
      user.password = password;
      user.passwordConfirm = passwordConfirm;
      user = await user.save();
    }

    return {
      _id: user._id,
      createdAt: user.createdAt,
      picture: user.picture,
      updatedAt: user.updatedAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async deleteProfile(id: string): Promise<StatusMessageDto> {
    await this.usersRepository.softDeleteOneById(id);
    return { message: 'Success' };
  }
}
