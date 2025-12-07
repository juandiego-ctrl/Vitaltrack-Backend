// medicamentos/schema/medicamento.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Medicamento extends Document {
   @Prop({ required: true })
   paciente: string;

   @Prop({ required: true })
   V6NumID: string;

  @Prop({ required: true })
  medicamento: string;

  @Prop({ required: true })
  frecuencia: string;

  @Prop({ required: true })
  fechaInicio: string;

  @Prop({ required: true })
  fechaFin: string;

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ default: true })
  activo: boolean;
}

export const MedicamentoSchema = SchemaFactory.createForClass(Medicamento);