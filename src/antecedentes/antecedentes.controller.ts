import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { AntecedentesService } from './antecedentes.service';
import { AntecedentesDto } from './antecedentes.dto';

@Controller('antecedentes')
export class AntecedentesController {
  constructor(private readonly antecedentesService: AntecedentesService) {}

  // 🟢 Crear nuevo antecedente
  @Post()
  async crear(@Body() dto: AntecedentesDto) {
    try {
      const resultado = await this.antecedentesService.crearAntecedente(dto);
      return { ok: true, data: resultado };
    } catch (error) {
      return { ok: false, mensaje: 'Error al crear antecedente', error: error.message };
    }
  }

  // 🟢 Obtener todos los antecedentes
  @Get()
  async obtenerTodos() {
    const antecedentes = await this.antecedentesService.buscarTodosAntecedentes();
    return { ok: true, total: antecedentes.length, data: antecedentes };
  }

  // 🟢 Obtener antecedente por su ID
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const antecedente = await this.antecedentesService.buscarAntecedente(id);
    return antecedente
      ? { ok: true, data: antecedente }
      : { ok: false, mensaje: 'Antecedente no encontrado' };
  }

  // 🟢 Obtener antecedentes de un paciente (evita el error del tipo)
  @Get('/paciente/:pacienteId')
  async obtenerPorPaciente(@Param('pacienteId') pacienteId: string) {
    const antecedentes = await this.antecedentesService.buscarPorPaciente(pacienteId);
    return antecedentes.length > 0
      ? { ok: true, total: antecedentes.length, data: antecedentes }
      : { ok: false, mensaje: 'No se encontraron antecedentes para este paciente' };
  }

  // 🟡 Actualizar antecedente existente
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: AntecedentesDto) {
    const actualizado = await this.antecedentesService.actualizarAntecedente(id, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'No se pudo actualizar o no existe' };
  }

  // 🔴 Eliminar antecedente
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.antecedentesService.eliminarAntecedente(id);
    return eliminado
      ? { ok: true, mensaje: 'Antecedente eliminado correctamente' }
      : { ok: false, mensaje: 'Antecedente no encontrado' };
  }
}
