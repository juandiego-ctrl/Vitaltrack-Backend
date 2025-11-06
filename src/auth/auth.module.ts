import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      secret: 'clave_super_secreta', // cámbiala por una real en producción
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
