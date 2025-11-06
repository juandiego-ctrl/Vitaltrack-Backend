import { Test, TestingModule } from '@nestjs/testing';
import { TtoqtController } from './ttoqt.controller';

describe('TtoqtController', () => {
  let controller: TtoqtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtoqtController],
    }).compile();

    controller = module.get<TtoqtController>(TtoqtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
