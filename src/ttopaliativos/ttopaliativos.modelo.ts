import mongoose from "mongoose";

export const ttopaliativosSchema = new mongoose.Schema(
  {
    pacienteId: { type: String, required: true }, // 👈 referencia al paciente
    V114RecibioCuidadoPaliativo: String,
    V114_1CP_MedEspecialista: String,
    V114_2CP_ProfSaludNoMed: String,
    V114_3CP_MedOtraEspecialidad: String,
    V114_4CP_MedGeneral: String,
    V114_5CP_TrabajoSocial: String,
    V114_6CP_OtroProfSalud: String,
    V115FecPrimConsCP: Date,
    V116CodIPS_CP: String,
    V117ValoradoPsiquiatria: String,
    V118FecPrimConsPsiq: Date,
    V119CodIPS_Psiq: String,
    V120ValoradoNutricion: String,
    V121FecPrimConsNutr: Date,
    V122CodIPS_Nutr: String,
    V123TipoSoporteNutricional: String,
    V124TerapiasComplementarias: String,
    V6NumId: { type: String, required: true },
  },
  { timestamps: true }
);

export interface ITtopaliativos extends mongoose.Document {
  pacienteId: string; // 👈 nuevo campo
  V114RecibioCuidadoPaliativo: string;
  V114_1CP_MedEspecialista: string;
  V114_2CP_ProfSaludNoMed: string;
  V114_3CP_MedOtraEspecialidad: string;
  V114_4CP_MedGeneral: string;
  V114_5CP_TrabajoSocial: string;
  V114_6CP_OtroProfSalud: string;
  V115FecPrimConsCP: Date;
  V116CodIPS_CP: string;
  V117ValoradoPsiquiatria: string;
  V118FecPrimConsPsiq: Date;
  V119CodIPS_Psiq: string;
  V120ValoradoNutricion: string;
  V121FecPrimConsNutr: Date;
  V122CodIPS_Nutr: string;
  V123TipoSoporteNutricional: string;
  V124TerapiasComplementarias: string;
  V6NumId: string;
}
