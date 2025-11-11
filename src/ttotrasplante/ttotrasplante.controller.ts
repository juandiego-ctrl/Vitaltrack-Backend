import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TtotrasplanteService } from './ttotrasplante.service';
import { ttotrasplanteDto } from './ttotrasplante.dto';

@Controller('ttotrasplante')
export class TtotrasplanteController {
  constructor(private readonly ttotrasplanteService: TtotrasplanteService) {}

  // Crear un nuevo registro
  @Post()
  async crear(@Body() dto: ttotrasplanteDto) {
    const respuesta = await this.ttotrasplanteService.crearTtotrasplante(dto);
    return { ok: true, data: respuesta };
  }

  // Obtener todos los registros
  @Get()
  async consultarTodos() {
    return this.ttotrasplanteService.buscarTodos();
  }

  // Obtener un registro por ID
  @Get(':id')
  async consultarPorId(@Param('id') id: string) {
    const trasplante = await this.ttotrasplanteService.buscarTtotrasplante(id);
    return trasplante
      ? { ok: true, data: trasplante }
      : { ok: false, mensaje: 'No encontrado' };
  }

  // Eliminar un registro
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.ttotrasplanteService.eliminarTtotrasplante(id);
    return eliminado
      ? { ok: true, mensaje: 'Eliminado correctamente' }
      : { ok: false, mensaje: 'No encontrado' };
  }

  // Actualizar un registro
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ttotrasplanteDto) {
    const actualizado = await this.ttotrasplanteService.actualizarTtotrasplante(id, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'No se pudo actualizar o no existe' };
  }

  // 🔍 Consultar trasplantes por paciente
  @Get('paciente/:pacienteId')
  async buscarPorPaciente(@Param('pacienteId') pacienteId: string) {
    const resultado = await this.ttotrasplanteService.buscarPorPaciente({ pacienteId });
    return { ok: true, data: resultado };
  }
}
