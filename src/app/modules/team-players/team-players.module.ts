import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamPlayersService } from './team-players.service';
import { TeamPlayersController } from './team-players.controller';

import { TeamsModule } from '../teams/teams.module';
import { PlayersModule } from '../players/players.module';
import { TeamPlayer, TeamPlayerSchema } from './entities/team-player.entity';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: TeamPlayer.name, schema: TeamPlayerSchema }]),
    TeamsModule,
    PlayersModule,
  ],
  controllers: [TeamPlayersController],
  providers: [TeamPlayersService],
  exports: [TeamPlayersService], // Export service for use in matches module
})
export class TeamPlayersModule {}
