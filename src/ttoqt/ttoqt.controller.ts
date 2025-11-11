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

  // ✅ Crear un nuevo registro de tratamiento de quimioterapia
  @Post()
  async crear(@Body() dto: ttoqtDto) {
    const respuesta = await this.ttoqtService.crearTtoqt(dto);
    return { ok: true, respuesta };
  }

  // ✅ Consultar un tratamiento por su ID (Mongo)
  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    return await this.ttoqtService.buscarTtoqt(id);
  }

  // ✅ Consultar todos los tratamientos registrados
  @Get()
  async consultarTodos() {
    return await this.ttoqtService.buscarTodos();
  }

  // ✅ Consultar todos los tratamientos de un paciente específico
  @Get('/paciente/:pacienteId')
  async consultarPorPaciente(@Param('pacienteId') pacienteId: string) {
    const tratamientos = await this.ttoqtService.buscarPorPaciente(pacienteId);
    return { ok: true, tratamientos };
  }

  // ✅ Eliminar un tratamiento por ID
  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.ttoqtService.eliminarTtoqt(id);
    return eliminado
      ? { ok: true, mensaje: 'Registro de quimioterapia eliminado exitosamente' }
      : { ok: false, mensaje: 'El registro no existe o no se pudo eliminar' };
  }

  // ✅ Actualizar un tratamiento por ID
  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttoqtDto) {
    const actualizado = await this.ttoqtService.actualizarTtoqt(id, dto);
    return actualizado
      ? { ok: true, actualizado }
      : { ok: false, mensaje: 'El registro no existe o no se pudo actualizar' };
  }

  // ✅ Cargue masivo (por ejemplo, desde Excel o importación externa)
  @Post('/cargar')
  async cargarMasivo(@Body() datos: ttoqtDto[]) {
    await this.ttoqtService.guardarDesdeArray(datos);
    return { ok: true, mensaje: 'Carga masiva de tratamientos completada correctamente' };
  }
}
