import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/shared/dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { UpdateProfileDto } from 'src/modules/profile/dto/update-profile.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';

@Injectable()
export class ProfileService {
  constructor(
    private usersRepository: UsersRepository,
    private awsS3Service: AwsS3Service,
  ) {}

  async findProfile(id: string): Promise<ProfileResponseDto> {
    const user = await this.usersRepository.findOneById(id);
    return {
      _id: user._id,
      createdAt: user.createdAt,
      picture: user.picture,
      updatedAt: user.updatedAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      deletedAt: user.deletedAt,
    };
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const { picture, password, passwordConfirm, ...data } = updateProfileDto;

    const pictureFile = await this.awsS3Service.putItemInBucket(
      picture.buffer,
      {
        extension: picture.originalname.split('.').pop(),
        mimetype: picture.mimetype,
        fileSize: picture.size,
      },
      { path: '/private/profile' },
    );

    pictureFile.filename = picture?.originalname || pictureFile.filename;
    const userValues = { ...data, picture: pictureFile };

    const oldUser = await this.usersRepository.findOneById(id);
    if (oldUser.picture?.completedPath) {
      await this.awsS3Service.deleteItemInBucket(oldUser.picture.completedPath);
    }

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
      deletedAt: user.deletedAt,
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
