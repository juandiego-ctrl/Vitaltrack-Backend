import mongoose from "mongoose";

export const ttotrasplanteSchema = new mongoose.Schema(
    {
        pacienteId: { type: String, required: true },
        V106RecibioTrasplanteCM: String,
        V107TipoTrasplanteCM: String,
        V108UbicTempTrasplanteCM: String,
        V109FecTrasplanteCM: Date,
        V110CodIPSTrasplanteCM: String,
        V6NumID: { type: String, required: true },
    }
);

export interface ITtotrasplante extends mongoose.Document {
    pacienteId: string;
    V106RecibioTrasplanteCM: string;
    V107TipoTrasplanteCM: string;
    V108UbicTempTrasplanteCM: string;
    V109FecTrasplanteCM: Date;
    V110CodIPSTrasplanteCM: string;
    V6NumID: String;
}
