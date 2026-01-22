import { Global, Module } from '@nestjs/common';
import { PlayersModule } from './modules/players/players.module';
import { TeamsModule } from './modules/teams/teams.module';
import { TeamPlayersModule } from './modules/team-players/team-players.module';

@Global()
@Module({
  imports: [
    PlayersModule,
    TeamsModule,
    TeamPlayersModule
  ],
})
export class CoreModule { }
