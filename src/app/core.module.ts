import { Global, Module } from '@nestjs/common';
import { PlayersModule } from './modules/players/players.module';

@Global()
@Module({
  imports: [
    PlayersModule
  ],
})
export class CoreModule { }
