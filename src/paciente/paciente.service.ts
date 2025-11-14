import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pacienteDto } from './paciente.dto';
import { IPaciente } from './paciente.modelo';
import { CreateManualDto } from './crear-manual.dto';

// Importar servicios relacionados
import { DiagnosticoService } from '../diagnostico/diagnostico.service';
import { AntecedentesService } from '../antecedentes/antecedentes.service';
import { ArchivospacientesService } from '../archivospacientes/archivospacientes.service';
import { TtocxService } from '../ttocx/ttocx.service';
import { TtocxreconstructivaService } from '../ttocxreconstructiva/ttocxreconstructiva.service';
import { TtopaliativosService } from '../ttopaliativos/ttopaliativos.service';
import { TtoqtService } from '../ttoqt/ttoqt.service';
import { TtortService } from '../ttort/ttort.service';
import { TtotrasplanteService } from '../ttotrasplante/ttotrasplante.service';

@Injectable()
export class PacienteService {
  constructor(
    @InjectModel('Paciente') private pacienteModel: Model<IPaciente>,
    private readonly diagnosticoService: DiagnosticoService,
    private readonly antecedentesService: AntecedentesService,
    private readonly archivospacientesService: ArchivospacientesService,
    private readonly ttocxService: TtocxService,
    private readonly ttocxreconstructivaService: TtocxreconstructivaService,
    private readonly ttopaliativosService: TtopaliativosService,
    private readonly ttoqtService: TtoqtService,
    private readonly ttortService: TtortService,
    private readonly ttotrasplanteService: TtotrasplanteService,
  ) {}

  // Crear paciente
  async crearPaciente(dto: pacienteDto): Promise<IPaciente> {
    const creacion = new this.pacienteModel(dto);
    return await creacion.save();
  }

  async buscarPorPaciente(filtro: { pacienteId: string }): Promise<IPaciente[]> {
    return await this.pacienteModel.find({ V6NumId: filtro.pacienteId }).exec(); // CORRECCIÓN: Estandarizado a 'V6NumId' (asumiendo camelCase en schema)
  }

  // Buscar paciente por cédula
async buscarPorCedula(cedula: string): Promise<IPaciente | null> {
  return await this.pacienteModel.findOne({ V6NumID: cedula }).exec();  // Cambia 'Id' a 'ID'
}

  // Buscar todos los pacientes (con paginación)
  async buscarTodos(page: number = 1, limit: number = 10): Promise<IPaciente[]> {
    return await this.pacienteModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  // Eliminar paciente
  async eliminarPaciente(cedula: string): Promise<boolean> {
    const respuesta = await this.pacienteModel.deleteOne({ V6NumId: cedula }).exec(); // CORRECCIÓN: Estandarizado a 'V6NumId'
    return respuesta.deletedCount === 1;
  }

  // Actualizar paciente
  async actualizarPaciente(cedula: string, dto: pacienteDto): Promise<IPaciente | null> {
    return await this.pacienteModel.findOneAndUpdate(
      { V6NumId: cedula }, // CORRECCIÓN: Estandarizado a 'V6NumId'
      dto,
      { new: true }
    ).exec();
  }

  // Guardar múltiples pacientes (desde Excel o array)
  async guardarDesdeArray(pacientes: pacienteDto[]): Promise<{ accion: string; paciente?: IPaciente; error?: string }[]> {
    const resultados: { accion: string; paciente?: IPaciente; error?: string }[] = [];

    for (const paciente of pacientes) {
      try {
        const existe = await this.pacienteModel.findOne({ V6NumId: paciente.V6NumId }).exec(); // CORRECCIÓN: Estandarizado a 'V6NumId'
        if (existe) {
          const actualizado = await this.pacienteModel.findOneAndUpdate(
            { V6NumId: paciente.V6NumId }, // CORRECCIÓN: Estandarizado
            paciente,
            { new: true }
          ).exec();
          resultados.push({ accion: 'actualizado', paciente: actualizado ?? undefined });
        } else {
          const nuevo = new this.pacienteModel(paciente);
          const guardado = await nuevo.save();
          resultados.push({ accion: 'creado', paciente: guardado });
        }
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // Obtener historial completo de un paciente
  async obtenerHistorialCompleto(cedula: string) {
    const paciente = await this.buscarPorCedula(cedula);
    if (!paciente) return { ok: false, mensaje: 'Paciente no encontrado' };

    const id = paciente.V6NumID;

    return {
      ok: true,
      paciente,
      diagnosticos: await this.diagnosticoService.buscarPorPaciente(id),
      antecedentes: await this.antecedentesService.buscarPorPaciente(id),
      archivos: await this.archivospacientesService.buscarPorPaciente(id),
      ttocx: await this.ttocxService.buscarPorPaciente(id),
      ttocxreconst: await this.ttocxreconstructivaService.buscarPorPaciente(id),
      ttopaliativos: await this.ttopaliativosService.buscarPorPaciente(id),
      ttoqt: await this.ttoqtService.buscarPorPaciente(id),
      ttort: await this.ttortService.buscarPorPaciente(id),
      ttotrasplante: await this.ttotrasplanteService.buscarPorPaciente({ pacienteId: id }),
    };
  }

  // Crear paciente + historial completo en todas las tablas
  async crearPacienteManual(data: CreateManualDto) {
    let paciente = await this.pacienteModel.findOne({ V6NumId: data.paciente.V6NumId }).exec(); // CORRECCIÓN: Estandarizado a 'V6NumId'
    if (paciente) {
      paciente = await this.pacienteModel.findOneAndUpdate(
        { V6NumId: data.paciente.V6NumId }, // CORRECCIÓN: Estandarizado
        data.paciente,
        { new: true }
      ).exec();
    } else {
      const nuevo = new this.pacienteModel(data.paciente);
      paciente = await nuevo.save();
    }

    if (!paciente) return { ok: false, mensaje: 'No se pudo guardar el paciente' };

    const cedula = paciente.V6NumID;

    // Guardar datos relacionados
    if (data.diagnosticos?.length) {
      for (const diag of data.diagnosticos) {
        await this.diagnosticoService.crearDiagnostico({ ...diag, pacienteId: cedula });
      }
    }

    if (data.antecedentes?.length) {
      for (const ant of data.antecedentes) {
        await this.antecedentesService.crearAntecedente({ ...ant, pacienteId: cedula });
      }
    }

    if (data.archivos?.length) {
      for (const arc of data.archivos) {
        await this.archivospacientesService.crearArchivoPaciente({ ...arc, pacienteId: cedula });
      }
    }

    if (data.ttocx?.length) {
      for (const t of data.ttocx) {
        await this.ttocxService.crearTtocx({ ...t, pacienteId: cedula });
      }
    }

    if (data.ttocxreconst?.length) {
      for (const t of data.ttocxreconst) {
        await this.ttocxreconstructivaService.crearTtocxreconstructiva({ ...t, pacienteId: cedula });
      }
    }

    if (data.ttopaliativos?.length) {
      for (const t of data.ttopaliativos) {
        await this.ttopaliativosService.crearTtopaliativos({ ...t, pacienteId: cedula });
      }
    }

    if (data.ttoqt?.length) {
      for (const t of data.ttoqt) {
        await this.ttoqtService.crearTtoqt({ ...t, pacienteId: cedula });
      }
    }

    if (data.ttort?.length) {
      for (const t of data.ttort) {
        await this.ttortService.crearTtort({ ...t, pacienteId: cedula });
      }
    }

    if (data.ttotrasplante?.length) {
      for (const t of data.ttotrasplante) {
        await this.ttotrasplanteService.crearTtotrasplante({ ...t, pacienteId: cedula });
      }
    }

    return { ok: true, paciente };
  }
}