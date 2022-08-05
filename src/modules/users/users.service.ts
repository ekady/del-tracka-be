import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import { User, UserDocument } from 'src/database/schema/user/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async findOne(id: string, notFoundError?: string): Promise<UserDocument> {
    const user = await this.userSchema.findById(id).exec();
    if (!user) {
      const errorMessage = notFoundError || 'User not found';
      throw new DocumentNotFoundException(errorMessage);
    }
    return user;
  }
}
