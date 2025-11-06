import { Module } from '@nestjs/common';
import { diagnosticoController } from './diagnostico.controller';
import { diagnosticoService } from './diagnostico.service';
import { MongooseModule } from '@nestjs/mongoose';
import { diagnosticoSchema } from './diagnostico.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'diagnostico', schema: diagnosticoSchema }]),
  ],
  controllers: [diagnosticoController],
  providers: [diagnosticoService],
  exports: [diagnosticoService], // Exportar el servicio para que otros módulos puedan
})
export class diagnosticoModule {}
