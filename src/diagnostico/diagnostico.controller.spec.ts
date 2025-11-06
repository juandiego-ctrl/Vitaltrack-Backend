import { Test, TestingModule } from '@nestjs/testing';
import { diagnosticoController } from './diagnostico.controller';
import { diagnosticoService } from './diagnostico.service';

describe('DiagnosticoController', () => {
  let controller: diagnosticoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [diagnosticoController],
      providers: [diagnosticoService], // Se agrega el servicio ya que el controlador lo necesita
    }).compile();

    controller = module.get<diagnosticoController>(diagnosticoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

