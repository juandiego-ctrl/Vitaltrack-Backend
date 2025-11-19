// src/citas/schemas/cita.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type CitaDocument = Cita & Document;

@Schema({ timestamps: true })
export class Cita {
  @Prop({ required: true })
  pacienteId: string; // FK → pacientes

  @Prop({ required: true })
  medicoId: string; // FK → usuarios (rol médico)

  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: true })
  horaInicio: string;

  @Prop({ required: true })
  horaFin: string;

  @Prop({ default: 'pendiente' })
  estado: string; // pendiente | confirmada | cancelada | atendida

  correoPaciente: { type: String, required: true }

  @Prop()
  motivo: string;
}

export const CitaSchema = SchemaFactory.createForClass(Cita);
