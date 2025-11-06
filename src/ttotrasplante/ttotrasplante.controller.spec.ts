import { Test, TestingModule } from '@nestjs/testing';
import { TtotrasplanteController } from './ttotrasplante.controller';

describe('TtotrasplanteController', () => {
  let controller: TtotrasplanteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtotrasplanteController],
    }).compile();

    controller = module.get<TtotrasplanteController>(TtotrasplanteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
