import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TtortService } from './ttort.service';
import { ttortDto } from './ttort.dto';

@Controller('ttort')
export class TtortController {
  constructor(private readonly ttortService: TtortService) {}

  // 🟢 Crear nuevo registro
  @Post()
  async crear(@Body() dto: ttortDto) {
    const respuesta = await this.ttortService.crearTtort(dto);
    return { ok: true, respuesta };
  }

  // 🟢 Obtener todos
  @Get()
  async consultarTodos() {
    const registros = await this.ttortService.buscarTodos();
    return { ok: true, total: registros.length, data: registros };
  }

  // 🟢 Obtener por ID
  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    const registro = await this.ttortService.buscarTtort(id);
    return registro
      ? { ok: true, data: registro }
      : { ok: false, mensaje: 'Registro no encontrado' };
  }

  // 🟢 Obtener tratamientos por paciente
  @Get('/paciente/:pacienteId')
  async consultarPorPaciente(@Param('pacienteId') pacienteId: string) {
    const registros = await this.ttortService.buscarPorPaciente(pacienteId);
    return registros.length > 0
      ? { ok: true, total: registros.length, data: registros }
      : { ok: false, mensaje: 'No hay registros de radioterapia para este paciente' };
  }

  // 🟡 Actualizar registro
  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttortDto) {
    const actualizado = await this.ttortService.actualizarTtort(id, dto);
    return actualizado
      ? { ok: true, actualizado }
      : { ok: false, mensaje: 'El registro no existe o no se pudo actualizar' };
  }

  // 🔴 Eliminar registro
  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.ttortService.eliminarTtort(id);
    return eliminado
      ? { ok: true, mensaje: 'Registro de radioterapia eliminado correctamente' }
      : { ok: false, mensaje: 'No se encontró el registro' };
  }
}
