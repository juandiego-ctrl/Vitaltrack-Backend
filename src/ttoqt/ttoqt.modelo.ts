import mongoose from "mongoose";

export const ttoqtSchema = new mongoose.Schema(
    {
        V45RecibioQuimio: String,
        V46NumFasesQuimio: Number,
        V47NumCiclosQuimio: Number,
        V48UbicTempTto: String,
        V49FecIniEsq1: Date,
        V50NumIPSQuimio: Number,
        V51CodIPSQuimio1: String,
        V52CodIPSQuimio2: String,
        V53MedATC1: String,
        V54MedATC2: String,
        V55MedATC3: String,
        V56MedATC4: String,
        V57RecibioQuimioIntrat: String,
        V58FecFinTto: Date,
        V59CaractTto: String,
        V60MotFinTto: String,
        V61UbicTempUltEsq: String,
        V62FecIniUltEsq: Date,
        V63NumIPSUltEsq: Number,
        V64CodIPSUltEsq1: String,
        V65CodIPSUltEsq2: String,
        V66NumMedUltEsq: Number,
        V66_1MedATC_Ult1: String,
        V66_2MedATC_Ult2: String,
        V66_3MedATC_Ult3: String,
        V66_4MedATC_Ult4: String,
        V66_5MedATC_Ult5: String,
        V66_6MedATC_Ult6: String,
        V66_7MedATC_Ult7: String,
        V66_8MedATC_Ult8: String,
        V66_9MedATC_Ult9: String,
        V67MedAddUlt1: String,
        V68MedAddUlt2: String,
        V69MedAddUlt3: String,
        V70RecibioQuimioIntratUlt: String,
        V71FecFinUltEsq: Date,
        V72CaractUltEsq: String,
        V73MotFinUltEsq: String,
        V6NumId: { type: String, required: true },
    }
);

export interface ITtoqt extends mongoose.Document {
    V45RecibioQuimio: string;
    V46NumFasesQuimio: number;
    V47NumCiclosQuimio: number;
    V48UbicTempTto: string;
    V49FecIniEsq1: Date;
    V50NumIPSQuimio: number;
    V51CodIPSQuimio1: string;
    V52CodIPSQuimio2: string;
    V53MedATC1: string;
    V54MedATC2: string;
    V55MedATC3: string;
    V56MedATC4: string;
    V57RecibioQuimioIntrat: string;
    V58FecFinTto: Date;
    V59CaractTto: string;
    V60MotFinTto: string;
    V61UbicTempUltEsq: string;
    V62FecIniUltEsq: Date;
    V63NumIPSUltEsq: number;
    V64CodIPSUltEsq1: string;
    V65CodIPSUltEsq2: string;
    V66NumMedUltEsq: number;
    V66_1MedATC_Ult1: string;
    V66_2MedATC_Ult2: string;
    V66_3MedATC_Ult3: string;
    V66_4MedATC_Ult4: string;
    V66_5MedATC_Ult5: string;
    V66_6MedATC_Ult6: string;
    V66_7MedATC_Ult7: string;
    V66_8MedATC_Ult8: string;
    V66_9MedATC_Ult9: string;
    V67MedAddUlt1: string;
    V68MedAddUlt2: string;
    V69MedAddUlt3: string;
    V70RecibioQuimioIntratUlt: string;
    V71FecFinUltEsq: Date;
    V72CaractUltEsq: string;
    V73MotFinUltEsq: string;
    V6NumID: String;
}
