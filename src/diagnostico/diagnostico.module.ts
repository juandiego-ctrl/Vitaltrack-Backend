import { Module } from '@nestjs/common';
import { diagnosticoController } from './diagnostico.controller';
import { DiagnosticoService } from './diagnostico.service';
import { MongooseModule } from '@nestjs/mongoose';
import { diagnosticoSchema } from './diagnostico.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'diagnostico', schema: diagnosticoSchema }]),
  ],
  controllers: [diagnosticoController],
  providers: [DiagnosticoService],
  exports: [DiagnosticoService], // Exportar el servicio para que otros módulos puedan
})
export class diagnosticoModule {}
