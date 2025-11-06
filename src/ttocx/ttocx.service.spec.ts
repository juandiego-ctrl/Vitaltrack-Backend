import { Test, TestingModule } from '@nestjs/testing';
import { TtocxService } from './ttocx.service';

describe('TtocxService', () => {
  let service: TtocxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtocxService],
    }).compile();

    service = module.get<TtocxService>(TtocxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
