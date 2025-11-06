import { Module } from '@nestjs/common';
import { ttopaliativosController } from './ttopaliativos.controller';
import { ttopaliativosService } from './ttopaliativos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttopaliativosSchema } from './ttopaliativos.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttopaliativos', schema: ttopaliativosSchema }]),
  ],
  controllers: [ttopaliativosController],
  providers: [ttopaliativosService],
  exports: [ttopaliativosService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttopaliativosModule {}
