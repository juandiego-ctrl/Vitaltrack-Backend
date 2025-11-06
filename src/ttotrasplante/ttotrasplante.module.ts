import { Module } from '@nestjs/common';
import { ttotrasplanteController } from './ttotrasplante.controller';
import { ttotrasplanteService } from './ttotrasplante.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttotrasplanteSchema } from './ttotrasplante.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttotrasplante', schema: ttotrasplanteSchema }]),
  ],
  controllers: [ttotrasplanteController],
  providers: [ttotrasplanteService],
  exports: [ttotrasplanteService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttotrasplanteModule {}
