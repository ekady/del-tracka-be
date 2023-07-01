import { AsyncModelFactory } from '@nestjs/mongoose';
import { HashHelper } from 'src/shared/helpers';
import { UserEntity, UserDocument, UserSchema } from './user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const UserSchemaProvider: AsyncModelFactory = {
  name: UserEntity.name,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const schema = UserSchema;

    schema.pre<UserDocument>('save', async function () {
      // If data is modified or create new data using provider, do nothing
      if (!this.isModified('password') || (this.isNew && this.isViaProvider))
        return;

      // Hash password and remove passwordConfirm and set passwordChangedAt
      this.password = await HashHelper.encrypt(this.password);
      this.passwordConfirm = undefined;
      this.passwordChangedAt = new Date(Date.now());
    });

    schema.post<UserDocument>('save', { document: true }, function () {
      // Remove password and passwordChangedAt
      this.password = undefined;
      this.passwordChangedAt = undefined;
    });

    schema.post<UserDocument>(
      /^findOne/,
      { document: true, query: true },
      function (doc) {
        if (doc && !doc.picture) {
          doc.picture = `${config.get('GRAVATAR_URL')}/${HashHelper.hashCrypto(
            doc.email,
          )}?s=300&d=identicon`;
        }
      },
    );

    return schema;
  },
};
