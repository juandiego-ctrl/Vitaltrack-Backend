export class excelarchivoDto {
    readonly pacienteId: string; 
    id: number;
    nomArchivo: string;
    fecCarga: Date;
    fecDescarga: Date;
    estadoArchivo: string;
    datosExcel: any; // Puede ser ajustado según la implementación real para manejar DataFrames
}
