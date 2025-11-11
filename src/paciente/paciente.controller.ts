import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { pacienteDto } from './paciente.dto';
import { CreateManualDto } from './crear-manual.dto';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  // ✅ Crear un paciente nuevo
  @Post()
  async crearPaciente(@Body() dto: pacienteDto) {
    if (!dto.V6NumId) throw new BadRequestException('Debe proporcionar un número de ID válido.');
    try {
      const respuesta = await this.pacienteService.crearPaciente(dto);
      return { ok: true, data: respuesta };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear paciente: ' + error.message);
    }
  }

  // ✅ Crear un paciente manualmente (fuente externa o formulario)
  @Post('/manual')
  async crearManual(@Body() data: CreateManualDto) {
    try {
      const paciente = await this.pacienteService.crearPacienteManual(data);
      return { ok: true, data: paciente };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear paciente manual: ' + error.message);
    }
  }

  // ✅ Consultar un paciente por cédula
  @Get('/:cedula')
  async consultarPaciente(@Param('cedula') cedula: string) {
    if (!cedula) throw new BadRequestException('Debe proporcionar una cédula válida.');
    const paciente = await this.pacienteService.buscarPorCedula(cedula);
    if (!paciente) throw new NotFoundException('Paciente no encontrado');
    return { ok: true, data: paciente };
  }

  // ✅ Consultar todos los pacientes (con paginación opcional)
  @Get()
  async consultarTodos(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pacientes = await this.pacienteService.buscarTodos(page, limit);
    return { ok: true, total: pacientes.length, data: pacientes };
  }

  // ✅ Obtener historial completo de un paciente (relaciones con todas las tablas)
  @Get('/historial/:cedula')
  async obtenerHistorial(@Param('cedula') cedula: string) {
    if (!cedula) throw new BadRequestException('Debe proporcionar una cédula válida.');
    try {
      const historial = await this.pacienteService.obtenerHistorialCompleto(cedula);
      if (!historial.ok) throw new NotFoundException(historial.mensaje);
      return { ok: true, data: historial };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener historial: ' + error.message);
    }
  }

  // ✅ Actualizar paciente por cédula
  @Patch('/:cedula')
  async actualizar(@Param('cedula') cedula: string, @Body() dto: pacienteDto) {
    if (!cedula) throw new BadRequestException('Debe proporcionar una cédula válida.');
    const actualizado = await this.pacienteService.actualizarPaciente(cedula, dto);
    if (!actualizado) throw new NotFoundException('El paciente no existe o no se pudo actualizar');
    return { ok: true, data: actualizado };
  }

  // ✅ Eliminar paciente por cédula
  @Delete('/:cedula')
  async eliminar(@Param('cedula') cedula: string) {
    if (!cedula) throw new BadRequestException('Debe proporcionar una cédula válida.');
    const eliminado = await this.pacienteService.eliminarPaciente(cedula);
    if (!eliminado) throw new NotFoundException('El paciente no existe');
    return { ok: true, mensaje: 'Paciente eliminado exitosamente' };
  }
}