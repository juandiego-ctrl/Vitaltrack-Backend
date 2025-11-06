import { Test, TestingModule } from '@nestjs/testing';
import { ExcelarchivoController } from './excelarchivo.controller';

describe('ExcelarchivoController', () => {
  let controller: ExcelarchivoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelarchivoController],
    }).compile();

    controller = module.get<ExcelarchivoController>(ExcelarchivoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
