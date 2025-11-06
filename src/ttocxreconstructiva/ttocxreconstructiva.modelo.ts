import mongoose from "mongoose";

export const ttocxreconstructivaSchema = new mongoose.Schema(
    {
        V111RecibioCirugiaReconst: String,
        V112FecCirugiaReconst: Date,
        V113CodIPSCirugiaReconst: String,
        V6NumId: { type: String, required: true },
    }
);

export interface ITtoCxreconstructiva extends mongoose.Document {
    V111RecibioCirugiaReconst: string;
    V112FecCirugiaReconst: Date;
    V113CodIPSCirugiaReconst: string;
    V6NumID: String;
}
