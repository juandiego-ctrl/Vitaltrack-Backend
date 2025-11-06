import { Test, TestingModule } from '@nestjs/testing';
import { TtocxreconstructivaController } from './ttocxreconstructiva.controller';

describe('TtocxreconstructivaController', () => {
  let controller: TtocxreconstructivaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtocxreconstructivaController],
    }).compile();

    controller = module.get<TtocxreconstructivaController>(TtocxreconstructivaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
