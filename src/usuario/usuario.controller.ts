import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { usuarioDto } from './usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post()
  async crearUsuario(@Body() usuarioDto: usuarioDto) {
    const respuesta = await this.usuarioService.CrearUsuario(usuarioDto);
    return { ok: true, respuesta };
  }

  @Get("/:id")
  async ConsultarUsuario(@Param("id") id: string) {
    return await this.usuarioService.BuscarUsuario(id);
  }

  @Get()
  async ConsultarTodos() {
    return await this.usuarioService.BuscarTodo();
  }

  @Delete("/:id")
  async Eliminar(@Param("id") id: string) {
    const eliminar = await this.usuarioService.EliminarUsuario(id);
    if (eliminar != null) {
      return "Usuario eliminado exitosamente";
    }
    return "El Usuario no existe";
  }

  @Patch("/:id")
  async Actualizar(@Param("id") id: string, @Body() usuarioDto: usuarioDto) {
    const usuarioActualizado = await this.usuarioService.ActualizarUsuario(id, usuarioDto);
    if (usuarioActualizado) {
      return { ok: true, usuarioActualizado };
    }
    return { ok: false, mensaje: "El usuario no existe o no se pudo actualizar" };
  }
}
