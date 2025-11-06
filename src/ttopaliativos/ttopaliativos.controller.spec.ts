import { Test, TestingModule } from '@nestjs/testing';
import { TtopaliativosController } from './ttopaliativos.controller';

describe('TtopaliativosController', () => {
  let controller: TtopaliativosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtopaliativosController],
    }).compile();

    controller = module.get<TtopaliativosController>(TtopaliativosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
