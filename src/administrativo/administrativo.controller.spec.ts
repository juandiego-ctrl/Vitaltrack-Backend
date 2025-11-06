import { Test, TestingModule } from '@nestjs/testing';
import { AdministrativoController } from './administrativo.controller';

describe('AdministrativoController', () => {
  let controller: AdministrativoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministrativoController],
    }).compile();

    controller = module.get<AdministrativoController>(AdministrativoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
