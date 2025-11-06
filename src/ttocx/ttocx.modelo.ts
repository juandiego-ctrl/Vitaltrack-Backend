import mongoose from "mongoose";

export const ttocxSchema = new mongoose.Schema(
    {
        V74RecibioCirugia: String,
        V75NumCirugias: Number,
        V76FecPrimCir: Date,
        V77CodIPSCir1: String,
        V78CodCUPSCir1: String,
        V79UbicTempCir1: String,
        V80FecUltCir: Date,
        V81MotUltCir: String,
        V82CodIPSCir2: String,
        V83CodCUPSCir2: String,
        V84UbicTempCir2: String,
        V85EstVitalPostCir: String,
        V6NumId: { type: String, required: true },
    }
);

export interface ITtocx extends mongoose.Document {
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
    V6NumID: String;
}
