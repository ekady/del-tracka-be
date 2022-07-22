import {
  Controller,
  Get,
  Body,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtPayloadReq } from '../auth/decorators';
import { JwtPayload } from '../auth/dto';
import { ApiResProperty } from 'src/common/decorators';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { StatusMessageDto } from 'src/common/dto';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiResProperty(ProfileResponseDto, 200)
  getProfile(
    @JwtPayloadReq() jwtPayloadDto: JwtPayload,
  ): Promise<ProfileResponseDto> {
    return this.profileService.findProfile(jwtPayloadDto.id);
  }

  @Put()
  @ApiConsumes('multipart/form-data')
  @ApiResProperty(ProfileResponseDto, 200)
  @UseInterceptors(FileInterceptor('picture'))
  update(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @UploadedFile() picture: Express.Multer.File,
    @Body() body: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const fields = { ...body, picture } as UpdateProfileDto;
    return this.profileService.updateProfile(jwtPayload.id, fields);
  }

  @Delete()
  @ApiResProperty(StatusMessageDto, 200)
  remove(@JwtPayloadReq() jwtPayload: JwtPayload): Promise<StatusMessageDto> {
    return this.profileService.deleteProfile(jwtPayload.id);
  }
}
