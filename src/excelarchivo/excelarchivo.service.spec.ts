import { Test, TestingModule } from '@nestjs/testing';
import { ExcelarchivoService} from './excelarchivo.service';

describe('ExcelarchivoService', () => {
  let service: ExcelarchivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelarchivoService],
    }).compile();

    service = module.get<ExcelarchivoService>(ExcelarchivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
