import { Test, TestingModule } from '@nestjs/testing';
import { TtoqtService } from './ttoqt.service';

describe('TtoqtService', () => {
  let service: TtoqtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtoqtService],
    }).compile();

    service = module.get<TtoqtService>(TtoqtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
