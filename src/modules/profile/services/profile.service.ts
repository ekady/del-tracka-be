import { BadRequestException, Injectable } from '@nestjs/common';

import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { UpdateProfileDto } from 'src/modules/profile/dto/update-profile.dto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { StatusMessageDto } from 'src/shared/dto';

import { ProfileResponseDto } from '../dto/profile-response.dto';

@Injectable()
export class ProfileService {
  constructor(
    private userRepository: UserRepository,
    private awsS3Service: AwsS3Service,
  ) {}

  async findProfile(id: string): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findOneById(id);
    return {
      _id: user._id,
      createdAt: user.createdAt,
      picture: user.picture,
      updatedAt: user.updatedAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      deletedAt: user.deletedAt,
      isDemo: user.isDemo,
    };
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const { picture, password, passwordConfirm, ...data } = updateProfileDto;
    let pictureFile: AwsS3Serialization;

    if (picture?.buffer) {
      pictureFile = await this.awsS3Service.putItemInBucket(
        picture.buffer,
        {
          extension: picture.originalname.split('.').pop(),
          mimetype: picture.mimetype,
          fileSize: picture.size,
        },
        { path: '/private/profile' },
      );
      pictureFile.filename = picture?.originalname || pictureFile.filename;
    }

    const userValues = { ...data, picture: pictureFile };

    const oldUser = await this.userRepository.findOneById(id);
    if (oldUser.picture?.completedPath) {
      await this.awsS3Service.deleteItemInBucket(oldUser.picture.completedPath);
    }

    let user = await this.userRepository.updateOneById(id, userValues);
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
      deletedAt: user.deletedAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async deleteProfile(id: string): Promise<StatusMessageDto> {
    const user = await this.userRepository.findOneById(id);
    if (user.isDemo)
      throw new BadRequestException('Cannot remove demo account');
    await this.userRepository.softDeleteOneById(id);
    return { message: 'Success' };
  }
}
