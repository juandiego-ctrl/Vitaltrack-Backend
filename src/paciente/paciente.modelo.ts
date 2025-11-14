import mongoose from "mongoose";

export const PacienteSchema=new mongoose.Schema(
    {
        id:Number,
        V1PrimerNom: String,
        V2SegundoNom: String,
        V3PrimerApe: String,
        V4SegundoApe: String,
        V5TipoID: String,
        V6NumID: { type: String, required: true },
        V7FecNac: Date,
        V8Sexo: String,
        V9Ocup: String,
        V10RegAfiliacion: String,
        V11CodEAPB: String,
        V12CodEtnia: String,
        V13GrupoPob: String,
        V14MpioRes: String,
        V15NumTel: String,
        V16FecAfiliacion: Date,
        FechaIngreso: Date,
    }
)

export interface IPaciente extends mongoose.Document{
    id:Number;
    V1PrimerNom: string;
    V2SegundoNom: string;
    V3PrimerApe: string
    V4SegundoApe: string;
    V5TipoID: string;
    V6NumID: string;
    V7FecNac: Date;
    V8Sexo: string;
    V9Ocup: string;
    V10RegAfiliacion: string;
    V11CodEAPB: string;
    V12CodEtnia: string;
    V13GrupoPob: string;
    V14MpioRes: string;
    V15NumTel: string;
    V16FecAfiliacion: Date;
    FechaIngreso: Date;
}