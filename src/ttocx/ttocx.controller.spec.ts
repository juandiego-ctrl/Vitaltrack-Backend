import { Test, TestingModule } from '@nestjs/testing';
import { TtocxController } from './ttocx.controller';

describe('TtocxController', () => {
  let controller: TtocxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtocxController],
    }).compile();

    controller = module.get<TtocxController>(TtocxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
