import { Test, TestingModule } from '@nestjs/testing';
import { excelarchivoService} from './excelarchivo.service';

describe('ExcelarchivoService', () => {
  let service: excelarchivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [excelarchivoService],
    }).compile();

    service = module.get<excelarchivoService>(excelarchivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
