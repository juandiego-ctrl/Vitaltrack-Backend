import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(email: string, password: string) {
    const usuario = await this.usuarioService.validarCredenciales(email, password);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario._id,
      email: usuario.email,
      rol: usuario.rol,
    };

    return {
      token: this.jwtService.sign(payload),
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    };
  }
}
