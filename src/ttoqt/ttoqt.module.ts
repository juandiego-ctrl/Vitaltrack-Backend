import { Module } from '@nestjs/common';
import { ttoqtController } from './ttoqt.controller';
import { ttoqtService } from './ttoqt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttoqtSchema } from './ttoqt.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttoqt', schema: ttoqtSchema }]),
  ],
  controllers: [ttoqtController],
  providers: [ttoqtService],
  exports: [ttoqtService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttoqtModule {}
