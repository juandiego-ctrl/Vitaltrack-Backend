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

  @Post()
  async crear(@Body() dto: AntecedentesDto) {
    const resultado = await this.antecedentesService.crearAntecedente(dto);
    return { ok: true, data: resultado };
  }

  @Get()
  async obtenerTodos() {
    return this.antecedentesService.buscarTodosAntecedentes();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.antecedentesService.buscarAntecedente(id);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.antecedentesService.eliminarAntecedente(id);
    return eliminado
      ? { ok: true, mensaje: 'Eliminado correctamente' }
      : { ok: false, mensaje: 'No encontrado' };
  }

  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: AntecedentesDto) {
    const actualizado = await this.antecedentesService.actualizarAntecedente(id, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'No se pudo actualizar o no existe' };
  }
}
