import mongoose, { Document } from "mongoose";

export const ttocxSchema = new mongoose.Schema(
  {
    pacienteId: { type: String, required: true, ref: "paciente" }, // 👈 Relación con paciente
    V74RecibioCirugia: { type: String },
    V75NumCirugias: { type: Number },
    V76FecPrimCir: { type: Date },
    V77CodIPSCir1: { type: String },
    V78CodCUPSCir1: { type: String },
    V79UbicTempCir1: { type: String },
    V80FecUltCir: { type: Date },
    V81MotUltCir: { type: String },
    V82CodIPSCir2: { type: String },
    V83CodCUPSCir2: { type: String },
    V84UbicTempCir2: { type: String },
    V85EstVitalPostCir: { type: String },
    V6NumID: { type: String, required: true }, // 🔹 sigue existiendo, es el ID institucional o del reporte
  },
  { timestamps: true },
);

export interface ITtocx extends Document {
  pacienteId: string; // 🔗 Relación directa con el paciente
  V74RecibioCirugia: string;
  V75NumCirugias: number;
  V76FecPrimCir: Date;
  V77CodIPSCir1: string;
  V78CodCUPSCir1: string;
  V79UbicTempCir1: string;
  V80FecUltCir: Date;
  V81MotUltCir: string;
  V82CodIPSCir2: string;
  V83CodCUPSCir2: string;
  V84UbicTempCir2: string;
  V85EstVitalPostCir: string;
  V6NumID: string;
}
