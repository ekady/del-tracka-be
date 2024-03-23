import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseTimestampsAbstract } from 'src/common/database/abstracts/database-timestamps.abstract';

export const UserDatabaseName = 'users';

@Schema({ timestamps: true, versionKey: false, collection: UserDatabaseName })
export class UserEntity extends DatabaseTimestampsAbstract {
  _id: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ type: AwsS3Serialization, default: null })
  picture: AwsS3Serialization;

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

  @Prop({ select: false })
  hashedRefreshToken: string;

  @Prop({ select: false })
  isViaProvider: boolean;

  @Prop({ select: false })
  passwordResetToken: string;

  @Prop({ select: false })
  passwordResetExpires: Date;

  @Prop({ select: false })
  deviceId: string[];

  @Prop({ default: false })
  isDemo: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type TUserDocument = UserEntity & Document;

export const UserFeature: ModelDefinition = {
  name: UserEntity.name,
  schema: UserSchema,
};
