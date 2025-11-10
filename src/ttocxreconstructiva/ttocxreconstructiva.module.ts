import { Module } from '@nestjs/common';
import { TtocxreconstructivaController } from './ttocxreconstructiva.controller';
import { TtocxreconstructivaService } from './ttocxreconstructiva.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttocxreconstructivaSchema } from './ttocxreconstructiva.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttocxreconstructiva', schema: ttocxreconstructivaSchema }]),
  ],
  controllers: [TtocxreconstructivaController],
  providers: [TtocxreconstructivaService],
  exports: [TtocxreconstructivaService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttocxreconstructivaModule {}
