import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { TtocxService } from './ttocx.service';
import { ttocxDto } from './ttocx.dto';

@Controller('ttocx')
export class TtocxController {
  constructor(
    private readonly ttocxService: TtocxService,
  ) {}

  @Post()
  async crear(@Body() dto: ttocxDto) {
    const respuesta = await this.ttocxService.crearTtocx(dto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    return await this.ttocxService.buscarPorId(id);
  }

  @Get()
  async consultarTodos() {
    return await this.ttocxService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.ttocxService.eliminar(id);
    return eliminado
      ? { ok: true, mensaje: 'Registro eliminado exitosamente' }
      : { ok: false, mensaje: 'El registro no existe' };
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttocxDto) {
    const actualizado = await this.ttocxService.actualizar(id, dto);
    return actualizado
      ? { ok: true, actualizado }
      : { ok: false, mensaje: 'No se pudo actualizar' };
  }

}
