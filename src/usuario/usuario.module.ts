import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from './usuario.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema }]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService]
})
export class UsuarioModule {}
