import { Test, TestingModule } from '@nestjs/testing';
import { AdministrativoService } from './administrativo.service';

describe('AdministrativoService', () => {
  let service: AdministrativoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdministrativoService],
    }).compile();

    service = module.get<AdministrativoService>(AdministrativoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
