import { Module } from '@nestjs/common';
import { zipsoportesController } from './zipsoportes.controller';
import { zipsoportesService } from './zipsoportes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ZipSoportesSchema } from './zipsoportes.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'zipsoportes', schema: ZipSoportesSchema }]),
  ],
  controllers: [zipsoportesController],
  providers: [zipsoportesService],
  exports: [zipsoportesService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class zipsoportesModule {}
