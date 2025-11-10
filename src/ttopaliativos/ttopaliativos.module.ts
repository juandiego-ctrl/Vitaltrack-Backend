import { Module } from '@nestjs/common';
import { TtopaliativosController } from './ttopaliativos.controller';
import { TtopaliativosService } from './ttopaliativos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttopaliativosSchema } from './ttopaliativos.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttopaliativos', schema: ttopaliativosSchema }]),
  ],
  controllers: [TtopaliativosController],
  providers: [TtopaliativosService],
  exports: [TtopaliativosService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttopaliativosModule {}
