import mongoose from "mongoose";

export const ZipSoportesSchema = new mongoose.Schema(
    {
        id: Number,
        V6NumID: { type: String, required: true },
        nomZip: String,
        fecCarga: Date,
        estadoZip: String,
        rutaDirectorio: String
    }
);

export interface IZipSoportes extends mongoose.Document {
    id: Number;
    V6NumID: string;
    nomZip: string;
    fecCarga: Date;
    estadoZip: string;
    rutaDirectorio: string;
}
