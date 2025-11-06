import { Module } from '@nestjs/common';
import { ttocxreconstructivaController } from './ttocxreconstructiva.controller';
import { ttocxreconstructivaService } from './ttocxreconstructiva.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttocxreconstructivaSchema } from './ttocxreconstructiva.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttocxreconstructiva', schema: ttocxreconstructivaSchema }]),
  ],
  controllers: [ttocxreconstructivaController],
  providers: [ttocxreconstructivaService],
  exports: [ttocxreconstructivaService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttocxreconstructivaModule {}
