import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicamentosController } from './medicamentos.controller';
import { MedicamentosService } from './medicamentos.service';
import { Medicamento, MedicamentoSchema } from './schema/medicamento.schema';
import { MedicamentosCron } from './medicamentos.cron';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicamento.name, schema: MedicamentoSchema }
    ]),
    MailerModule,
  ],
  controllers: [MedicamentosController],
  providers: [MedicamentosService, MedicamentosCron],
  exports: [MedicamentosService],
})
export class MedicamentosModule {}
