import { Test, TestingModule } from '@nestjs/testing';
import { ZipsoportesController } from './zipsoportes.controller';

describe('ZipsoportesController', () => {
  let controller: ZipsoportesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZipsoportesController],
    }).compile();

    controller = module.get<ZipsoportesController>(ZipsoportesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
