import { AsyncModelFactory } from '@nestjs/mongoose';
import { HashHelper } from 'src/helpers';
import { User, UserDocument, UserSchema } from './user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const UserSchemaProvider: AsyncModelFactory = {
  name: User.name,
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

      if (!this.picture) {
        this.picture = `${config.get('GRAVATAR_URL')}/${HashHelper.hashCrypto(
          this.email,
        )}?s=300&d=identicon`;
      }
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
