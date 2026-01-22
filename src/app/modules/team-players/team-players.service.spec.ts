import { Test, TestingModule } from '@nestjs/testing';
import { TeamPlayersService } from './team-players.service';

describe('TeamPlayersService', () => {
  let service: TeamPlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamPlayersService],
    }).compile();

    service = module.get<TeamPlayersService>(TeamPlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
