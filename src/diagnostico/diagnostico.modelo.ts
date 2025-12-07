import mongoose, { Schema } from "mongoose";

export const diagnosticoSchema = new mongoose.Schema(
  {
    // 🔗 Relación con Paciente
    pacienteId: {
      type: Schema.Types.ObjectId,
      ref: "Paciente", // nombre del modelo de paciente
      required: true,
    },

    V6NumID: { type: String, required: true },
    id: Number,
    V17CodCIE10: String,
    V18FecDiag: Date,
    V19FecRemision: Date,
    V20FecIngInst: Date,
    V21TipoEstDiag: String,
    V22MotNoHistop: String,
    V23FecRecMuestra: Date,
    V24FecInfHistop: Date,
    V25CodHabIPS: String,
    V26Fec1raCons: Date,
    V27HistTumor: String,
    V28GradoDifTum: String,
    V29EstadifTum: String,
    V30FecEstadif: Date,
    V31PruebaHER2: String,
    V32FecPruebaHER2: Date,
    V33ResHER2: String,
    V34EstadifDukes: String,
    V35FecEstDukes: Date,
    V36EstadifLinfMielo: String,
    V37ClasGleason: String,
    V38ClasRiesgoLL: String,
    V39FecClasRiesgo: Date,
    V40ObjTtoInicial: String,
    V41IntervMed: String,
    agrupador: String,
    observaciones: String,
  },
  { timestamps: true }
);

export interface IDiagnostico extends mongoose.Document {
  pacienteId: mongoose.Types.ObjectId; // referencia
  id: number;
  V17CodCIE10: string;
  V18FecDiag: Date;
  V19FecRemision: Date;
  V20FecIngInst: Date;
  V21TipoEstDiag: string;
  V22MotNoHistop: string;
  V23FecRecMuestra: Date;
  V24FecInfHistop: Date;
  V25CodHabIPS: string;
  V26Fec1raCons: Date;
  V27HistTumor: string;
  V28GradoDifTum: string;
  V29EstadifTum: string;
  V30FecEstadif: Date;
  V31PruebaHER2: string;
  V32FecPruebaHER2: Date;
  V33ResHER2: string;
  V34EstadifDukes: string;
  V35FecEstDukes: Date;
  V36EstadifLinfMielo: string;
  V37ClasGleason: string;
  V38ClasRiesgoLL: string;
  V39FecClasRiesgo: Date;
  V40ObjTtoInicial: string;
  V41IntervMed: string;
  agrupador: string;
  observaciones: string;
  V6NumID: string;
}

export const Diagnostico = mongoose.model<IDiagnostico>(
  "Diagnostico",
  diagnosticoSchema
);
