// ttort.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TtortService } from './ttort.service';
import { ttortDto } from './ttort.dto';

@Controller('ttort')
export class TtortController {
  constructor(private readonly ttortService: TtortService) {}

  @Post()
  async crear(@Body() dto: ttortDto) {
    const respuesta = await this.ttortService.crearTtort(dto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    return await this.ttortService.buscarTtort(id);
  }

  @Get()
  async consultarTodos() {
    return await this.ttortService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.ttortService.eliminarTtort(id);
    return eliminar
      ? 'Registro de tratamiento de radioterapia eliminado exitosamente'
      : 'El registro de tratamiento de radioterapia no existe';
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttortDto) {
    const actualizado = await this.ttortService.actualizarTtort(id, dto);
    return actualizado
      ? { ok: true, actualizado }
      : { ok: false, mensaje: 'El registro no existe o no se pudo actualizar' };
  }
}
