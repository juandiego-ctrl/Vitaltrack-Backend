import mongoose from "mongoose";

export const ExcelarchivoSchema = new mongoose.Schema(
    {
        pacienteId: { type: String, required: true, ref: "paciente" }, 
        id: Number,
        nomArchivo: String,
        fecCarga: Date,
        fecDescarga: Date,
        estadoArchivo: String,
        datosExcel: mongoose.Schema.Types.Mixed, // Se usa Mixed para permitir estructuras flexibles
    }
);

export interface IExcelarchivo extends mongoose.Document {
    pacienteId: string;
    id: number;
    nomArchivo: string;
    fecCarga: Date;
    fecDescarga: Date;
    estadoArchivo: string;
    datosExcel: any; // Puede ser ajustado según la implementación real
}
