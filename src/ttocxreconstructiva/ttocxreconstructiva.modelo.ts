import mongoose, { Document } from "mongoose";

export const ttocxreconstructivaSchema = new mongoose.Schema(
  {
    pacienteId: { type: String, required: true, ref: "paciente" }, // 🔗 Relación con paciente
    V111RecibioCirugiaReconst: { type: String },
    V112FecCirugiaReconst: { type: Date },
    V113CodIPSCirugiaReconst: { type: String },
    V6NumID: { type: String, required: true },
  },
  { timestamps: true }
);

export interface ITtocxreconstructiva extends Document {
  pacienteId: string; // 🔗 Relación con paciente principal
  V111RecibioCirugiaReconst: string;
  V112FecCirugiaReconst: Date;
  V113CodIPSCirugiaReconst: string;
  V6NumID: string;
}
