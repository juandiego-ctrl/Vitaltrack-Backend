import { Module } from '@nestjs/common';
import { TtotrasplanteController } from './ttotrasplante.controller';
import { TtotrasplanteService } from './ttotrasplante.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttotrasplanteSchema } from './ttotrasplante.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttotrasplante', schema: ttotrasplanteSchema }]),
  ],
  controllers: [TtotrasplanteController],
  providers: [TtotrasplanteService],
  exports: [TtotrasplanteService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttotrasplanteModule {}
