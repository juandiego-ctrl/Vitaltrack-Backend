// ttoqt.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TtoqtService } from './ttoqt.service';
import { ttoqtDto } from './ttoqt.dto';

@Controller('ttoqt')
export class TtoqtController {
  constructor(private readonly ttoqtService: TtoqtService) {}

  @Post()
  async crear(@Body() dto: ttoqtDto) {
    const respuesta = await this.ttoqtService.crearTtoqt(dto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    return await this.ttoqtService.buscarTtoqt(id);
  }

  @Get()
  async consultarTodos() {
    return await this.ttoqtService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.ttoqtService.eliminarTtoqt(id);
    return eliminar
      ? 'Registro de tratamiento de quimioterapia eliminado exitosamente'
      : 'El registro de tratamiento de quimioterapia no existe';
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttoqtDto) {
    const actualizado = await this.ttoqtService.actualizarTtoqt(id, dto);
    return actualizado
      ? { ok: true, actualizado }
      : { ok: false, mensaje: 'El registro no existe o no se pudo actualizar' };
  }
}
