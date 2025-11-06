import { Module } from '@nestjs/common';
import { AdministrativoService } from './administrativo.service';
import { administrativoController } from './administrativo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { administrativoSchema } from './administrativo.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'administrativo', schema: administrativoSchema }]),
  ],
  controllers: [administrativoController],
  providers: [AdministrativoService],
  exports: [AdministrativoService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class AdministrativoModule {}
