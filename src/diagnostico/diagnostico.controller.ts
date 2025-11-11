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
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  @Post()
  async crear(@Body() dto: diagnosticoDto) {
    try {
      const respuesta = await this.diagnosticoService.crearDiagnostico(dto);
      return { ok: true, data: respuesta };
    } catch (error) {
      return { ok: false, mensaje: 'Error al crear diagnóstico', error: error.message };
    }
  }

  @Get()
  async consultarTodos() {
    const diagnosticos = await this.diagnosticoService.buscarTodos();
    return { ok: true, total: diagnosticos.length, data: diagnosticos };
  }

  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    const diagnostico = await this.diagnosticoService.buscarDiagnostico(id);
    return diagnostico
      ? { ok: true, data: diagnostico }
      : { ok: false, mensaje: 'Diagnóstico no encontrado' };
  }

  // ✅ Corregido: pasa el string, no un objeto
  @Get('/paciente/:pacienteId')
  async consultarPorPaciente(@Param('pacienteId') pacienteId: string) {
    const diagnosticos = await this.diagnosticoService.buscarPorPaciente(pacienteId);
    return diagnosticos.length > 0
      ? { ok: true, total: diagnosticos.length, data: diagnosticos }
      : { ok: false, mensaje: 'No se encontraron diagnósticos para este paciente' };
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: diagnosticoDto) {
    const actualizado = await this.diagnosticoService.actualizarDiagnostico(id, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'El diagnóstico no existe o no se pudo actualizar' };
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.diagnosticoService.eliminarDiagnostico(id);
    return eliminado
      ? { ok: true, mensaje: 'Diagnóstico eliminado exitosamente' }
      : { ok: false, mensaje: 'El diagnóstico no existe' };
  }
}
