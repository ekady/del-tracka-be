import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { UserEntity, UserDocument } from 'src/modules/users/schema/user.schema';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(UserEntity.name) private userSchema: Model<UserDocument>,
  ) {}

  async findProfile(id: string): Promise<ProfileResponseDto> {
    return this.userSchema.findById(id);
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const { picture, password, passwordConfirm, ...data } = updateProfileDto;
    const userValues = { ...data, picture: picture?.originalname };

    let user = await this.userSchema
      .findByIdAndUpdate(id, userValues, { new: true })
      .exec();
    if (password || passwordConfirm) {
      user.password = password;
      user.passwordConfirm = passwordConfirm;
      user = await user.save();
    }

    return user;
  }

  async deleteProfile(id: string): Promise<StatusMessageDto> {
    const user = await this.userSchema.findById(id).exec();
    await user.remove();
    return { message: 'Success' };
  }
}
