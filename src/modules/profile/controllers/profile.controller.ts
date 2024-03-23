import {
  Controller,
  Get,
  Body,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UpdateProfileDto } from 'src/modules/profile/dto/update-profile.dto';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { ApiResProperty } from 'src/shared/decorators';
import { StatusMessageDto } from 'src/shared/dto';
import { ProfileService } from '../services/profile.service';
import { ProfileResponseDto } from '../dto/profile-response.dto';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiResProperty(ProfileResponseDto, 200)
  getProfile(
    @JwtPayloadReq() jwtPayloadDto: IJwtPayload,
  ): Promise<ProfileResponseDto> {
    return this.profileService.findProfile(jwtPayloadDto.id);
  }

  @Put()
  @ApiConsumes('multipart/form-data')
  @ApiResProperty(ProfileResponseDto, 200)
  @UseInterceptors(FileInterceptor('picture'))
  update(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @UploadedFile() picture: Express.Multer.File,
    @Body() body: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const fields = { ...body, picture } as UpdateProfileDto;
    return this.profileService.updateProfile(jwtPayload.id, fields);
  }

  @Delete()
  @ApiResProperty(StatusMessageDto, 200)
  remove(@JwtPayloadReq() jwtPayload: IJwtPayload): Promise<StatusMessageDto> {
    return this.profileService.deleteProfile(jwtPayload.id);
  }
}
