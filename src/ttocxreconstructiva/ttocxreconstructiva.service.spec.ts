import { Test, TestingModule } from '@nestjs/testing';
import { TtocxreconstructivaService } from './ttocxreconstructiva.service';

describe('TtocxreconstructivaService', () => {
  let service: TtocxreconstructivaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtocxreconstructivaService],
    }).compile();

    service = module.get<TtocxreconstructivaService>(TtocxreconstructivaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
