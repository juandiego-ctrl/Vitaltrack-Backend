import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pacienteDto } from './paciente.dto';
import { IPaciente } from './paciente.modelo';
import { CreateManualDto } from './crear-manual.dto';

// 📌 Importar todos los demás servicios
import { diagnosticoService } from '../diagnostico/diagnostico.service';
import { AntecedentesService } from '../antecedentes/antecedentes.service';
import { ArchivospacientesService } from '../archivospacientes/archivospacientes.service';
import { ttocxService } from '../ttocx/ttocx.service';
import { ttocxreconstructivaService } from '../ttocxreconstructiva/ttocxreconstructiva.service';
import { ttopaliativosService } from '../ttopaliativos/ttopaliativos.service';
import { ttoqtService } from '../ttoqt/ttoqt.service';
import { ttortService } from '../ttort/ttort.service';
import { ttotrasplanteService } from '../ttotrasplante/ttotrasplante.service';

@Injectable()
export class PacienteService {
  constructor(
    @InjectModel('Paciente') private pacienteModel: Model<IPaciente>,
    private readonly diagnosticoService: diagnosticoService,
    private readonly antecedentesService: AntecedentesService,
    private readonly archivospacientesService: ArchivospacientesService,
    private readonly ttocxService: ttocxService,
    private readonly ttocxreconstructivaService: ttocxreconstructivaService,
    private readonly ttopaliativosService: ttopaliativosService,
    private readonly ttoqtService: ttoqtService,
    private readonly ttortService: ttortService,
    private readonly ttotrasplanteService: ttotrasplanteService,
  ) {}

  // 📌 Crear un paciente
  async CrearPaciente(paciente: pacienteDto): Promise<IPaciente> {
    const creacion = new this.pacienteModel(paciente);
    return await creacion.save();
  }

  // 📌 Buscar paciente por cédula
  async BuscarCedula(cedula: string): Promise<IPaciente | null> {
    return await this.pacienteModel.findOne({ V6NumID: cedula }).exec();
  }

  // 📌 Buscar todos los pacientes
  async BuscarTodo(): Promise<IPaciente[]> {
    return await this.pacienteModel.find().exec();
  }

  // 📌 Eliminar paciente por cédula
  async EliminarPaciente(cedula: string): Promise<any> {
    const respuesta = await this.pacienteModel.deleteOne({ V6NumID: cedula }).exec();
    return respuesta.deletedCount === 1 ? respuesta : null;
  }

  // 📌 Actualizar paciente por cédula
  async ActualizarPaciente(cedula: string, pacienteDto: pacienteDto): Promise<IPaciente | null> {
    return await this.pacienteModel.findOneAndUpdate(
      { V6NumID: cedula },
      pacienteDto,
      { new: true }
    ).exec();
  }

  // 📌 Guardar múltiples pacientes (desde Excel)
  async guardarPacientes(pacientes: pacienteDto[]): Promise<any> {
    const resultados: {
      accion: 'creado' | 'actualizado';
      paciente: IPaciente | null;
    }[] = [];

    for (const paciente of pacientes) {
      const existe = await this.pacienteModel.findOne({ V6NumID: paciente.V6NumID }).exec();

      if (existe) {
        const actualizado = await this.pacienteModel.findOneAndUpdate(
          { V6NumID: paciente.V6NumID },
          paciente,
          { new: true }
        ).exec();
        resultados.push({ accion: 'actualizado', paciente: actualizado });
      } else {
        const nuevo = new this.pacienteModel(paciente);
        const guardado = await nuevo.save();
        resultados.push({ accion: 'creado', paciente: guardado });
      }
    }

    return { ok: true, resultados };
  }

  // 📌 Obtener historial completo de un paciente
  async obtenerHistorialCompleto(cedula: string) {
    const paciente = await this.BuscarCedula(cedula);
    if (!paciente) {
      return { ok: false, mensaje: 'Paciente no encontrado' };
    }

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
      ttotrasplante: await this.ttotrasplanteService.buscarPorPaciente(id),
    };
  }

  async buscarPorPaciente(filtro: any) {
    return await this.pacienteModel.find(filtro).exec();
  }

  // 📌 Guardar paciente + historial completo en todas las tablas
  async crearPacienteManual(data: CreateManualDto) {
    // 1️⃣ Guardar paciente principal
    let paciente = await this.pacienteModel.findOne({ V6NumID: data.paciente.V6NumID }).exec();
    if (paciente) {
      paciente = await this.pacienteModel.findOneAndUpdate(
        { V6NumID: data.paciente.V6NumID },
        data.paciente,
        { new: true }
      ).exec();
    } else {
      const nuevo = new this.pacienteModel(data.paciente);
      paciente = await nuevo.save();
    }

    if (!paciente) {
      return { ok: false, mensaje: 'No se pudo guardar el paciente' };
    }

    const cedula = paciente.V6NumID;

    // 2️⃣ Guardar en tablas relacionadas (usando .create())
    if (data.diagnosticos?.length) {
      for (const diag of data.diagnosticos) {
        await this.diagnosticoService.create({ ...diag, pacienteId: cedula });
      }
    }
    if (data.antecedentes?.length) {
      for (const ant of data.antecedentes) {
        await this.antecedentesService.create({ ...ant, pacienteId: cedula });
      }
    }
    if (data.archivos?.length) {
      for (const arc of data.archivos) {
        await this.archivospacientesService.create({ ...arc, pacienteId: cedula });
      }
    }
    if (data.ttocx?.length) {
      for (const t of data.ttocx) {
        await this.ttocxService.create({ ...t, pacienteId: cedula });
      }
    }
    if (data.ttocxreconst?.length) {
      for (const t of data.ttocxreconst) {
        await this.ttocxreconstructivaService.create({ ...t, pacienteId: cedula });
      }
    }
    if (data.ttopaliativos?.length) {
      for (const t of data.ttopaliativos) {
        await this.ttopaliativosService.create({ ...t, pacienteId: cedula });
      }
    }
    if (data.ttoqt?.length) {
      for (const t of data.ttoqt) {
        await this.ttoqtService.create({ ...t, pacienteId: cedula });
      }
    }
    if (data.ttort?.length) {
      for (const t of data.ttort) { 
        await this.ttortService.create({ ...t, pacienteId: cedula });
      }
    }
    if (data.ttotrasplante?.length) {
      for (const t of data.ttotrasplante) {
        await this.ttotrasplanteService.create({ ...t, pacienteId: cedula });
      }
    }

    return { ok: true, paciente };
  }
}
