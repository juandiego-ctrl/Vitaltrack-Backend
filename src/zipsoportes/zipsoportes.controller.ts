import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { zipsoportesService } from './zipsoportes.service';
import { zipSoportesDto } from './zipsoportes.dto';

@Controller('zipsoportes')
export class zipsoportesController {
  constructor(private readonly zipsoportesService: zipsoportesService) {}

  @Post()
  async crearZipsoportes(@Body() zipsoportesDto: zipSoportesDto) {
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
  async actualizar(@Param("id") id: string, @Body() zipsoportesDto: zipSoportesDto) {
    const zipsoportesActualizado = await this.zipsoportesService.actualizarZipsoportes(id, zipsoportesDto);
    if (zipsoportesActualizado) {
      return { ok: true, zipsoportesActualizado };
    }
    return { ok: false, mensaje: "El registro de archivo ZIP no existe o no se pudo actualizar" };
  }
}
