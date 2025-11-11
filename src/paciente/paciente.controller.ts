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
import { PacienteService } from './paciente.service';
import { pacienteDto } from './paciente.dto';
import { CreateManualDto } from './crear-manual.dto';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  // ✅ Crear un paciente nuevo
  @Post()
  async crearPaciente(@Body() dto: pacienteDto) {
    console.log('📥 Datos recibidos en backend:', dto);
    try {
      const respuesta = await this.pacienteService.crearPaciente(dto);
      console.log('✅ Paciente creado correctamente:', respuesta);
      return { ok: true, data: respuesta };
    } catch (error) {
      console.error('❌ Error en crearPaciente:', error);
      return { ok: false, mensaje: 'Error al crear paciente', error: error.message };
    }
  }

  // ✅ Crear un paciente manualmente (fuente externa o formulario)
  @Post('/manual')
  async crearManual(@Body() data: CreateManualDto) {
    try {
      const paciente = await this.pacienteService.crearPacienteManual(data);
      return { ok: true, data: paciente };
    } catch (error) {
      return { ok: false, mensaje: 'Error al crear paciente manual', error: error.message };
    }
  }

  // ✅ Consultar un paciente por cédula
  @Get('/:cedula')
  async consultarPaciente(@Param('cedula') cedula: string) {
    const paciente = await this.pacienteService.buscarPorCedula(cedula);
    return paciente
      ? { ok: true, data: paciente }
      : { ok: false, mensaje: 'Paciente no encontrado' };
  }

  // ✅ Consultar todos los pacientes
  @Get()
  async consultarTodos() {
    const pacientes = await this.pacienteService.buscarTodos();
    return { ok: true, total: pacientes.length, data: pacientes };
  }

  // ✅ Obtener historial completo de un paciente (relaciones con todas las tablas)
  @Get('/historial/:cedula')
  async obtenerHistorial(@Param('cedula') cedula: string) {
    try {
      const historial = await this.pacienteService.obtenerHistorialCompleto(cedula);
      return { ok: true, data: historial };
    } catch (error) {
      return { ok: false, mensaje: 'Error al obtener historial', error: error.message };
    }
  }

  // ✅ Actualizar paciente por cédula
  @Patch('/:cedula')
  async actualizar(@Param('cedula') cedula: string, @Body() dto: pacienteDto) {
    const actualizado = await this.pacienteService.actualizarPaciente(cedula, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'El paciente no existe o no se pudo actualizar' };
  }

  // ✅ Eliminar paciente por cédula
  @Delete('/:cedula')
  async eliminar(@Param('cedula') cedula: string) {
    const eliminado = await this.pacienteService.eliminarPaciente(cedula);
    return eliminado
      ? { ok: true, mensaje: 'Paciente eliminado exitosamente' }
      : { ok: false, mensaje: 'El paciente no existe' };
  }
}
