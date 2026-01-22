import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '@config/configuration';
import { validationSchema } from '@config/validation';

/** This code is creating a configuration module using the `ConfigModule` from the `@nestjs/config`
package. The `forRoot` method is used to configure the module with the following options: */
/** The AppConfigModule class imports and exports the ConfigModule. */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./.env`,
      load: [configuration],
      validationSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
