import { Test, TestingModule } from '@nestjs/testing';
import { TtocxreconstructivaController } from './ttocxreconstructiva.controller';
import { TtocxreconstructivaService } from './ttocxreconstructiva.service';

describe('ttocxreconstructivaController', () => {
  let controller: TtocxreconstructivaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtocxreconstructivaController],
      providers: [TtocxreconstructivaService],
    }).compile();

    controller = module.get<TtocxreconstructivaController>(TtocxreconstructivaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
