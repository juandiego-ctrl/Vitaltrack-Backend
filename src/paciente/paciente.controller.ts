import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { pacienteDto } from './paciente.dto';
import { CreateManualDto } from './crear-manual.dto';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  async crearPaciente(@Body() dto: pacienteDto) {
    const respuesta = await this.pacienteService.crearPaciente(dto);
    return { ok: true, respuesta };
  }

  @Get('/:cedula')
  async consultarPaciente(@Param('cedula') cedula: string) {
    return await this.pacienteService.buscarPorCedula(cedula);
  }

  @Get()
  async consultarTodos() {
    return await this.pacienteService.buscarTodos();
  }

  @Delete('/:cedula')
  async eliminar(@Param('cedula') cedula: string) {
    const eliminar = await this.pacienteService.eliminarPaciente(cedula);
    return eliminar
      ? { ok: true, mensaje: 'Paciente eliminado exitosamente' }
      : { ok: false, mensaje: 'El paciente no existe' };
  }

  @Patch('/:cedula')
  async actualizar(@Param('cedula') cedula: string, @Body() dto: pacienteDto) {
    const actualizado = await this.pacienteService.actualizarPaciente(cedula, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'El paciente no existe o no se pudo actualizar' };
  }

  @Get('/historial/:cedula')
  async obtenerHistorial(@Param('cedula') cedula: string) {
    return await this.pacienteService.obtenerHistorialCompleto(cedula);
  }

  @Post('manual')
  async crearManual(@Body() data: CreateManualDto) {
    return await this.pacienteService.crearPacienteManual(data);
  }
}
