// ttotrasplante.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TtotrasplanteService } from './ttotrasplante.service';
import { ttotrasplanteDto } from './ttotrasplante.dto';

@Controller('ttotrasplante')
export class TtotrasplanteController {
  constructor(private readonly ttotrasplanteService: TtotrasplanteService) {}

  @Post()
  async crear(@Body() dto: ttotrasplanteDto) {
    const respuesta = await this.ttotrasplanteService.crearTtotrasplante(dto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    return await this.ttotrasplanteService.buscarTtotrasplante(id);
  }

  @Get()
  async consultarTodos() {
    return await this.ttotrasplanteService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.ttotrasplanteService.eliminarTtotrasplante(id);
    return eliminar
      ? 'Registro de trasplante eliminado exitosamente'
      : 'El registro de trasplante no existe';
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttotrasplanteDto) {
    const actualizado = await this.ttotrasplanteService.actualizarTtotrasplante(id, dto);
    return actualizado
      ? { ok: true, actualizado }
      : { ok: false, mensaje: 'El registro no existe o no se pudo actualizar' };
  }
}
