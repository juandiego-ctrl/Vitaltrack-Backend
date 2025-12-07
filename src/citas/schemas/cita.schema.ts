// src/citas/schemas/cita.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CitaDocument = Cita & Document;

@Schema({ timestamps: true })
export class Cita {
   @Prop({ required: true })
   pacienteId: string;

   @Prop({ required: true })
   V6NumID: string;

  @Prop({ required: true })
  medicoId: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: true })
  horaInicio: string;

  @Prop({ required: true })
  horaFin: string;

  @Prop({ default: 'pendiente' })
  estado: string;

  // AQUÍ ESTÁ LA CORRECCIÓN
  @Prop({ required: true })  // ← ¡Falta el @Prop()!
  correoPaciente: string;    // ← y sin llaves, solo el tipo

  @Prop()
  motivo?: string; // opcional
}

export const CitaSchema = SchemaFactory.createForClass(Cita);