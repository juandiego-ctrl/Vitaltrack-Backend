// medicamentos.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';

@Controller('medicamentos')
export class MedicamentosController {
  constructor(private readonly service: MedicamentosService) {}

  @Post()
  async crear(@Body() body: any) {
    return this.service.crear(body);
  }
}
