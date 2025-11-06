import { Test, TestingModule } from '@nestjs/testing';
import { TtopaliativosService } from './ttopaliativos.service';

describe('TtopaliativosService', () => {
  let service: TtopaliativosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtopaliativosService],
    }).compile();

    service = module.get<TtopaliativosService>(TtopaliativosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
