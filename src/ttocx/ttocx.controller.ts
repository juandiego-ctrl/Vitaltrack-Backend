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
import { TtocxService } from './ttocx.service';
import { ttocxDto } from './ttocx.dto';

@Controller('ttocx')
export class TtocxController {
  constructor(private readonly ttocxService: TtocxService) {}

  // ✅ Crear un nuevo registro
  @Post()
  async crear(@Body() dto: ttocxDto) {
    const nuevo = await this.ttocxService.crearTtocx(dto);
    return { ok: true, data: nuevo };
  }

  // ✅ Consultar todos los registros
  @Get()
  async consultarTodos() {
    const lista = await this.ttocxService.buscarTodos();
    return { ok: true, total: lista.length, data: lista };
  }

  // ✅ Consultar un registro por su ID
  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
    const registro = await this.ttocxService.buscarPorId(id);
    return registro
      ? { ok: true, data: registro }
      : { ok: false, mensaje: 'Registro no encontrado' };
  }

  // ✅ Consultar registros por paciente
  @Get('/paciente/:pacienteId')
  async consultarPorPaciente(@Param('pacienteId') pacienteId: string) {
    const registros = await this.ttocxService.buscarPorPaciente(pacienteId);
    return { ok: true, total: registros.length, data: registros };
  }

  // ✅ Actualizar registro
  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttocxDto) {
    const actualizado = await this.ttocxService.actualizar(id, dto);
    return actualizado
      ? { ok: true, data: actualizado }
      : { ok: false, mensaje: 'No se pudo actualizar o el registro no existe' };
  }

  // ✅ Eliminar registro
  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.ttocxService.eliminar(id);
    return eliminado
      ? { ok: true, mensaje: 'Registro de tratamiento quirúrgico eliminado correctamente' }
      : { ok: false, mensaje: 'El registro no existe' };
  }


}
