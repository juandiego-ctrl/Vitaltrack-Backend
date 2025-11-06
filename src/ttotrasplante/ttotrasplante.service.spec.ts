import { Test, TestingModule } from '@nestjs/testing';
import { TtotrasplanteService } from './ttotrasplante.service';

describe('TtotrasplanteService', () => {
  let service: TtotrasplanteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtotrasplanteService],
    }).compile();

    service = module.get<TtotrasplanteService>(TtotrasplanteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
