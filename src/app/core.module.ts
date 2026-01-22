import { Global, Module } from '@nestjs/common';
import { PlayersModule } from './modules/players/players.module';
import { TeamsModule } from './modules/teams/teams.module';

@Global()
@Module({
  imports: [
    PlayersModule,
    TeamsModule
  ],
})
export class CoreModule { }
