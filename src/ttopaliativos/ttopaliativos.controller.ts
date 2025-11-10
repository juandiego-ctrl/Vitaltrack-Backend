// ttopaliativos.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TtopaliativosService } from './ttopaliativos.service';
import { ttopaliativosDto } from './ttopaliativos.dto';

@Controller('ttopaliativos')
export class TtopaliativosController {
  constructor(private readonly ttopaliativosService: TtopaliativosService) {}

  @Post()
  async crear(@Body() dto: ttopaliativosDto) {
    return await this.ttopaliativosService.crearTtopaliativos(dto);
  }

  @Get()
  async consultarTodos() {
    return await this.ttopaliativosService.buscarTodos();
  }

  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    return await this.ttopaliativosService.buscarPorId(id);
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    return await this.ttopaliativosService.eliminar(id);
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttopaliativosDto) {
    return await this.ttopaliativosService.actualizar(id, dto);
  }
}
