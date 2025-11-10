import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { diagnosticoDto } from './diagnostico.dto';

@Controller('diagnostico')
export class diagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  @Post()
  async crearDiagnostico(@Body() dto: diagnosticoDto) {
    const respuesta = await this.diagnosticoService.crearDiagnostico(dto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarDiagnostico(@Param('id') id: string) {
    return await this.diagnosticoService.buscarDiagnostico(id);
  }

  @Get()
  async consultarTodos() {
    return await this.diagnosticoService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.diagnosticoService.eliminarDiagnostico(id);
    return eliminar
      ? { ok: true, mensaje: 'Diagnóstico eliminado exitosamente' }
      : { ok: false, mensaje: 'El diagnóstico no existe' };
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: diagnosticoDto) {
    const actualizado = await this.diagnosticoService.actualizarDiagnostico(id, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'El diagnóstico no existe o no se pudo actualizar' };
  }
}
