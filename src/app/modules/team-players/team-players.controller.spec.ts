import { Test, TestingModule } from '@nestjs/testing';
import { TeamPlayersController } from './team-players.controller';
import { TeamPlayersService } from './team-players.service';

describe('TeamPlayersController', () => {
  let controller: TeamPlayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamPlayersController],
      providers: [TeamPlayersService],
    }).compile();

    controller = module.get<TeamPlayersController>(TeamPlayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
