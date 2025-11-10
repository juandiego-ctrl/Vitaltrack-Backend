import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { ArchivospacientesService } from './archivospacientes.service';
import { ArchivospacientesDto } from './archivospacientes.dto';

@Controller('archivospacientes')
export class ArchivospacientesController {
  constructor(
    private readonly archivospacientesService: ArchivospacientesService,
  ) {}

  @Post()
  async crearArchivoPaciente(@Body() dto: ArchivospacientesDto) {
    const respuesta = await this.archivospacientesService.crearArchivoPaciente(dto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarArchivoPaciente(@Param('id') id: string) {
    return await this.archivospacientesService.buscarArchivoPaciente(id);
  }

  @Get()
  async consultarTodos() {
    return await this.archivospacientesService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.archivospacientesService.eliminarArchivoPaciente(id);
    return eliminar
      ? { ok: true, mensaje: 'Archivo de paciente eliminado exitosamente' }
      : { ok: false, mensaje: 'El archivo de paciente no existe' };
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ArchivospacientesDto) {
    const actualizado = await this.archivospacientesService.actualizarArchivoPaciente(id, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'El archivo de paciente no existe o no se pudo actualizar' };
  }
}
