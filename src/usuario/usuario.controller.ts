import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post()
  async crearUsuario(@Body() usuarioDto: UsuarioDto) {
    const respuesta = await this.usuarioService.crearUsuario(usuarioDto);
    return { ok: true, respuesta };
  }

  @Get("/:id")
  async consultarUsuario(@Param('id') id: string) {
    return await this.usuarioService.buscarUsuario(id);
  }

  @Get()
  async consultarTodos() {
    return await this.usuarioService.buscarTodos();
  }

  @Delete("/:id")
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.usuarioService.eliminarUsuario(id);
    if (eliminar != null) {
      return "Usuario eliminado exitosamente";
    }
    return "El Usuario no existe";
  }

  @Patch("/:id")
  async actualizar(@Param('id') id: string, @Body() usuarioDto: UsuarioDto) {
    const usuarioActualizado = await this.usuarioService.actualizarUsuario(id, usuarioDto);
    if (usuarioActualizado) {
      return { ok: true, usuarioActualizado };
    }
    return { ok: false, mensaje: "El usuario no existe o no se pudo actualizar" };
  }
}
