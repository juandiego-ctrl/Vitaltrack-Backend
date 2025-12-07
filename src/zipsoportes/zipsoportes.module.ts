import { Module } from '@nestjs/common';
import { ZipsoportesController } from './zipsoportes.controller';
import { ZipsoportesService } from './zipsoportes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ZipSoportesSchema } from './zipsoportes.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'zipsoportes', schema: ZipSoportesSchema }]),
  ],
  controllers: [ZipsoportesController],
  providers: [ZipsoportesService],
  exports: [ZipsoportesService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class zipsoportesModule {}
