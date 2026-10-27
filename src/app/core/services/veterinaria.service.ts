
import { Injectable } from '@angular/core';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  propietario: string;
  telefono: string;
}

export type EstadoCita =
  | 'Pendiente'
  | 'Confirmada'
  | 'Atendida'
  | 'Cancelada';

export interface Cita {
  id: number;
  mascotaId: number;
  mascotaNombre: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
}

export interface Atencion {
  id: number;
  mascotaId: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
}

@Injectable({
  providedIn: 'root'
})
export class VeterinariaService {

  private mascotas: Mascota[] = [];
  private citas: Cita[] = [];
  private atenciones: Atencion[] = [];

  private idMascota = 1;
  private idCita = 1;
  private idAtencion = 1;

  // =========================
  // MASCOTAS
  // =========================

  listarMascotas(): Mascota[] {
    return [...this.mascotas];
  }

  registrarMascota(datos: Omit<Mascota, 'id'>): void {
    this.mascotas.push({
      id: this.idMascota++,
      ...datos
    });
  }

  actualizarMascota(
    id: number,
    datos: Omit<Mascota, 'id'>
  ): boolean {
    const indice = this.mascotas.findIndex(
      mascota => mascota.id === id
    );

    if (indice === -1) {
      return false;
    }

    this.mascotas[indice] = {
      id,
      ...datos
    };

    return true;
  }

  eliminarMascota(id: number): void {
    this.mascotas = this.mascotas.filter(
      mascota => mascota.id !== id
    );
  }

  // =========================
  // CITAS Y RESERVAS
  // =========================

  listarCitas(): Cita[] {
    return [...this.citas];
  }

  agendarCita(
    datos: Omit<Cita, 'id' | 'estado'>
  ): boolean {
    const ocupado = this.citas.some(c =>
      c.fecha === datos.fecha &&
      c.hora === datos.hora &&
      c.estado !== 'Cancelada'
    );

    if (ocupado) {
      return false;
    }

    this.citas.push({
      id: this.idCita++,
      ...datos,
      estado: 'Confirmada'
    });

    return true;
  }

  actualizarCita(
    id: number,
    datos: Omit<Cita, 'id' | 'estado'>
  ): boolean {
    const indice = this.citas.findIndex(c => c.id === id);

    if (indice === -1) {
      return false;
    }

    const ocupado = this.citas.some(c =>
      c.id !== id &&
      c.fecha === datos.fecha &&
      c.hora === datos.hora &&
      c.estado !== 'Cancelada'
    );

    if (ocupado) {
      return false;
    }

    this.citas[indice] = {
      ...this.citas[indice],
      ...datos
    };

    return true;
  }

  eliminarCita(id: number): void {
    this.citas = this.citas.filter(c => c.id !== id);
  }

  cancelarCita(id: number): void {
    const cita = this.citas.find(c => c.id === id);

    if (cita) {
      cita.estado = 'Cancelada';
    }
  }

  cambiarEstadoCita(
    id: number,
    estado: EstadoCita
  ): void {
    const cita = this.citas.find(c => c.id === id);

    if (cita) {
      cita.estado = estado;
    }
  }

  // =========================
  // HISTORIAL MÉDICO
  // =========================

  listarAtenciones(mascotaId: number): Atencion[] {
    return this.atenciones.filter(
      a => a.mascotaId === mascotaId
    );
  }

  registrarAtencion(
    datos: Omit<Atencion, 'id'>
  ): void {
    this.atenciones.push({
      id: this.idAtencion++,
      ...datos
    });
  }
}
