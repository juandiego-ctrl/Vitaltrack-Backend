import mongoose from "mongoose";

export const archivospacientesSchema = new mongoose.Schema(
    {
        id: Number,
        V6NumID: { type: String, required: true },
        datos_excel: mongoose.Schema.Types.Mixed, // Permite almacenar estructuras flexibles
        soportes_pdf: [String], // Lista de nombres de archivos PDF
    }
);

export interface IArchivospacientes extends mongoose.Document {
    id: number;
    V6NumID: string;
    datos_excel: any;
    soportes_pdf: string[];
}
