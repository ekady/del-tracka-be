import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';

@Schema({ timestamps: true, versionKey: false })
export class User implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({
    required: function () {
      return !this.isViaProvider;
    },
    select: false,
  })
  password: string;

  @Prop({
    required: function () {
      return !this.isViaProvider;
    },
    select: false,
    validate: {
      validator: function (el: string): boolean {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  })
  passwordConfirm: string;

  @Prop({ select: false })
  passwordChangedAt: Date;

  @Prop()
  picture: string;

  @Prop({ select: false })
  hashedRefreshToken: string;

  @Prop({ select: false })
  isViaProvider: boolean;

  @Prop({ select: false })
  passwordResetToken: string;

  @Prop({ select: false })
  passwordResetExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
