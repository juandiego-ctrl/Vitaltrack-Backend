export class excelarchivoDto {
    id: number;
    nomArchivo: string;
    fecCarga: Date;
    fecDescarga: Date;
    estadoArchivo: string;
    datosExcel: any; // Puede ser ajustado según la implementación real para manejar DataFrames
}
