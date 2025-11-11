import mongoose from "mongoose";

export const ttortSchema = new mongoose.Schema(
    {
        pacienteId: { type: String, required: true },
        V86RecibioRadioterapia: String,
        V87NumSesionesRadio: Number,
        V88FecIniEsq1Radio: Date,
        V89UbicTempEsq1Radio: String,
        V90TipoRadioEsq1: String,
        V91NumIPSRadioEsq1: Number,
        V92CodIPSRadio1Esq1: String,
        V93CodIPSRadio2Esq1: String,
        V94FecFinEsq1Radio: Date,
        V95CaractEsq1Radio: String,
        V96MotFinEsq1Radio: String,
        V97FecIniUltEsqRadio: Date,
        V98UbicTempUltEsqRadio: String,
        V99TipoRadioUltEsq: String,
        V100NumIPSRadioUltEsq: Number,
        V101CodIPSRadio1UltEsq: String,
        V102CodIPSRadio2UltEsq: String,
        V103FecFinUltEsqRadio: Date,
        V104CaractUltEsqRadio: String,
        V105MotFinUltEsqRadio: String,
        V6NumId: { type: String, required: true },
    }
);

export interface ITtort extends mongoose.Document {
    pacienteId: string;
    V86RecibioRadioterapia: string;
    V87NumSesionesRadio: number;
    V88FecIniEsq1Radio: Date;
    V89UbicTempEsq1Radio: string;
    V90TipoRadioEsq1: string;
    V91NumIPSRadioEsq1: number;
    V92CodIPSRadio1Esq1: string;
    V93CodIPSRadio2Esq1: string;
    V94FecFinEsq1Radio: Date;
    V95CaractEsq1Radio: string;
    V96MotFinEsq1Radio: string;
    V97FecIniUltEsqRadio: Date;
    V98UbicTempUltEsqRadio: string;
    V99TipoRadioUltEsq: string;
    V100NumIPSRadioUltEsq: number;
    V101CodIPSRadio1UltEsq: string;
    V102CodIPSRadio2UltEsq: string;
    V103FecFinUltEsqRadio: Date;
    V104CaractUltEsqRadio: string;
    V105MotFinUltEsqRadio: string;
    V6NumId: String;
}
