import mongoose from "mongoose";

export const ZipSoportesSchema = new mongoose.Schema(
    {
        id: Number,
        nomZip: String,
        fecCarga: Date,
        estadoZip: String,
        rutaDirectorio: String
    }
);

export interface IZipSoportes extends mongoose.Document {
    id: Number;
    nomZip: string;
    fecCarga: Date;
    estadoZip: string;
    rutaDirectorio: string;
}
