import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ZipsoportesService } from './zipsoportes.service';
import { ZipsoportesDto } from './zipsoportes.dto';

@Controller('zipsoportes')
export class ZipsoportesController {
  constructor(private readonly zipsoportesService: ZipsoportesService) {}

  @Post()
  async crearZipsoportes(@Body() zipsoportesDto: ZipsoportesDto) {
    const respuesta = await this.zipsoportesService.crearZipsoportes(zipsoportesDto);
    return { ok: true, respuesta };
  }

  @Get("/:id")
  async consultarZipsoportes(@Param("id") id: string) {
    return await this.zipsoportesService.buscarZipsoportes(id);
  }

  @Get()
  async consultarTodos() {
    return await this.zipsoportesService.buscarTodos();
  }

  @Delete("/:id")
  async eliminar(@Param("id") id: string) {
    const eliminar = await this.zipsoportesService.eliminarZipsoportes(id);
    if (eliminar != null) {
      return "Registro de archivo ZIP eliminado exitosamente";
    }
    return "El registro de archivo ZIP no existe";
  }

  @Patch("/:id")
  async actualizar(@Param('id') id: string, @Body() zipsoportesDto: ZipsoportesDto) {
    const zipsoportesActualizado = await this.zipsoportesService.actualizarZipsoportes(id, zipsoportesDto);
    if (zipsoportesActualizado) {
      return { ok: true, zipsoportesActualizado };
    }
    return { ok: false, mensaje: "El registro de archivo ZIP no existe o no se pudo actualizar" };
  }
}
