import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../core/shared.module';
import { CoreModule } from './core.module';
import { AppConfigModule } from '../config/app.config.module';

/** This is a TypeScript module that imports various modules and sets up a MongoDB connection using
configuration values obtained from a ConfigService. */
@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('db.uri') 
        return {
          uri,
          retryWrites: true,
          w: 'majority',
        };
      },
      inject: [ConfigService],
    }),
    CoreModule,
    SharedModule,
  ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, 
          limit: 10, 
        },
      ],
    }),
  ],
})
export class AppModule {}
