import { Module } from '@nestjs/common';
import { ttocxController } from './ttocx.controller';
import { ttocxService } from './ttocx.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttocxSchema } from './ttocx.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttocx', schema: ttocxSchema }]),
  ],
  controllers: [ttocxController],
  providers: [ttocxService],
  exports: [ttocxService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttocxModule {}
