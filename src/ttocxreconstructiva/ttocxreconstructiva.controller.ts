import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TtocxreconstructivaService } from './ttocxreconstructiva.service';
import { ttocxreconstructivaDto } from './ttocxreconstructiva.dto';

@Controller('ttocxreconstructiva')
export class TtocxreconstructivaController {
  constructor(
    private readonly ttocxreconstructivaService: TtocxreconstructivaService,
  ) {}

  // ✅ Crear registro
  @Post()
  async crear(@Body() dto: ttocxreconstructivaDto) {
    const nuevo = await this.ttocxreconstructivaService.crearTtocxreconstructiva(dto);
    return { ok: true, data: nuevo };
  }

  // ✅ Consultar todos los registros
  @Get()
  async consultarTodos() {
    const lista = await this.ttocxreconstructivaService.buscarTodos();
    return { ok: true, total: lista.length, data: lista };
  }

  // ✅ Consultar por ID
  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    const registro = await this.ttocxreconstructivaService.buscarTtocxreconstructiva(id);
    return registro
      ? { ok: true, data: registro }
      : { ok: false, mensaje: 'Registro no encontrado' };
  }

  // ✅ Consultar por paciente (si aplica relación con pacienteId)
  @Get('/paciente/:pacienteId')
  async consultarPorPaciente(@Param('pacienteId') pacienteId: string) {
    const registros = await this.ttocxreconstructivaService.buscarPorPaciente(pacienteId);
    return { ok: true, total: registros.length, data: registros };
  }

  // ✅ Eliminar
  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.ttocxreconstructivaService.eliminarTtocxreconstructiva(id);
    return eliminado
      ? { ok: true, mensaje: 'Tratamiento quirúrgico reconstructivo eliminado' }
      : { ok: false, mensaje: 'No se encontró el registro para eliminar' };
  }

  // ✅ Actualizar
  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttocxreconstructivaDto) {
    const actualizado = await this.ttocxreconstructivaService.actualizarTtocxreconstructiva(id, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'No se pudo actualizar o el registro no existe' };
  }
}
