import { Module } from '@nestjs/common';
import { TtocxController } from './ttocx.controller';
import { TtocxService } from './ttocx.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttocxSchema } from './ttocx.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttocx', schema: ttocxSchema }]),
  ],
  controllers: [TtocxController],
  providers: [TtocxService],
  exports: [TtocxService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttocxModule {}
