import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdministrativoService } from './administrativo.service';
import { AdministrativoDto } from './administrativo.dto';

@Controller('administrativo')
export class AdministrativoController {
  constructor(private readonly administrativoService: AdministrativoService) {}

  @Post()
  async crearAdministrativo(@Body() administrativoDto: AdministrativoDto) {
    const respuesta = await this.administrativoService.crearAdministrativo(administrativoDto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarAdministrativo(@Param('id') id: string) {
    return await this.administrativoService.buscarAdministrativo(id);
  }

  @Get()
  async consultarTodos() {
    return await this.administrativoService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.administrativoService.eliminarAdministrativo(id);
    if (eliminar != null) {
      return 'Registro administrativo eliminado exitosamente';
    }
    return 'El registro administrativo no existe';
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() administrativoDto: AdministrativoDto) {
    const administrativoActualizado = await this.administrativoService.actualizarAdministrativo(id, administrativoDto);
    if (administrativoActualizado) {
      return { ok: true, administrativoActualizado };
    }
    return { ok: false, mensaje: 'El registro administrativo no existe o no se pudo actualizar' };
  }
}
