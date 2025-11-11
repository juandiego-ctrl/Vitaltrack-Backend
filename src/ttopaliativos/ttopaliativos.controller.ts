// ttopaliativos.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TtopaliativosService } from './ttopaliativos.service';
import { ttopaliativosDto } from './ttopaliativos.dto';

@Controller('ttopaliativos')
export class TtopaliativosController {
  constructor(private readonly ttopaliativosService: TtopaliativosService) {}

  // ✅ Crear un nuevo registro de cuidados paliativos
  @Post()
  async crear(@Body() dto: ttopaliativosDto) {
    const nuevo = await this.ttopaliativosService.crearTtopaliativos(dto);
    return { ok: true, mensaje: 'Registro creado correctamente', data: nuevo };
  }

  // ✅ Consultar todos los registros
  @Get()
  async consultarTodos() {
    const registros = await this.ttopaliativosService.buscarTodos();
    return { ok: true, data: registros };
  }

  // ✅ Consultar un registro por ID
  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    const registro = await this.ttopaliativosService.buscarPorId(id);
    return registro
      ? { ok: true, data: registro }
      : { ok: false, mensaje: 'Registro no encontrado' };
  }

  // ✅ Consultar por paciente (relación directa con Paciente)
  @Get('/paciente/:pacienteId')
  async consultarPorPaciente(@Param('pacienteId') pacienteId: string) {
    const registros = await this.ttopaliativosService.buscarPorPaciente(pacienteId);
    return { ok: true, data: registros };
  }

  // ✅ Eliminar un registro por ID
  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.ttopaliativosService.eliminar(id);
    return eliminado
      ? { ok: true, mensaje: 'Registro eliminado correctamente' }
      : { ok: false, mensaje: 'El registro no existe o no se pudo eliminar' };
  }

  // ✅ Actualizar un registro
  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttopaliativosDto) {
    const actualizado = await this.ttopaliativosService.actualizar(id, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'No se pudo actualizar el registro' };
  }

  // ✅ Cargue masivo (para Excel o integración)
  @Post('/cargar')
  async cargarMasivo(@Body() datos: ttopaliativosDto[]) {
    await this.ttopaliativosService.guardarDesdeArray(datos);
    return { ok: true, mensaje: 'Carga masiva completada correctamente' };
  }
}
