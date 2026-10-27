
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Cita,
  Mascota,
  VeterinariaService
} from '../../core/services/veterinaria.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas {
  private fb = inject(FormBuilder);
  private servicio = inject(VeterinariaService);

  mascotas: Mascota[] = [];
  citas: Cita[] = [];

  idEditando: number | null = null;
  mensaje = '';
  error = '';

  fechaCalendario = this.obtenerFechaLocal();

  formulario = this.fb.nonNullable.group({
    mascotaId: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor() {
    this.actualizarDatos();
  }

  private obtenerFechaLocal(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  get citasDelCalendario(): Cita[] {
    return this.citas
      .filter(cita => cita.fecha === this.fechaCalendario)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  cambiarFechaCalendario(fecha: string): void {
    this.fechaCalendario = fecha;
  }

  guardarCita(): void {
    this.mensaje = '';
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = 'Completa correctamente todos los campos.';
      return;
    }

    const valores = this.formulario.getRawValue();

    const mascota = this.mascotas.find(
      m => m.id === Number(valores.mascotaId)
    );

    if (!mascota) {
      this.error = 'Selecciona una mascota registrada.';
      return;
    }

    const fechaHoraCita = new Date(
      `${valores.fecha}T${valores.hora}:00`
    );

    if (
      Number.isNaN(fechaHoraCita.getTime()) ||
      fechaHoraCita.getTime() <= Date.now()
    ) {
      this.error = 'La fecha y hora deben ser futuras.';
      return;
    }

    const datos: Omit<Cita, 'id' | 'estado'> = {
      mascotaId: mascota.id,
      mascotaNombre: mascota.nombre,
      fecha: valores.fecha,
      hora: valores.hora,
      motivo: valores.motivo.trim()
    };

    if (this.idEditando !== null) {
      const actualizado = this.servicio.actualizarCita(
        this.idEditando,
        datos
      );

      if (!actualizado) {
        this.error =
          'No se pudo actualizar la cita. Es posible que ese horario ya esté ocupado.';
        this.actualizarDatos();
        return;
      }

      this.mensaje = 'Cita actualizada correctamente.';
    } else {
      const registrada = this.servicio.agendarCita(datos);

      if (!registrada) {
        this.error =
          'Ese horario ya está ocupado. Selecciona otra hora.';
        return;
      }

      this.mensaje = 'Cita agendada correctamente.';
    }

    this.fechaCalendario = valores.fecha;
    this.cancelarEdicion();
    this.actualizarDatos();
  }

  editarCita(cita: Cita): void {
    if (
      cita.estado === 'Cancelada' ||
      cita.estado === 'Atendida'
    ) {
      this.error =
        'No puedes editar una cita cancelada o atendida.';
      this.mensaje = '';
      return;
    }

    this.idEditando = cita.id;
    this.mensaje = '';
    this.error = '';

    this.formulario.setValue({
      mascotaId: cita.mascotaId,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  cancelarEdicion(): void {
    this.idEditando = null;

    this.formulario.reset({
      mascotaId: 0,
      fecha: '',
      hora: '',
      motivo: ''
    });
  }

  eliminarCita(id: number): void {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas eliminar esta cita?'
    );

    if (!confirmar) {
      return;
    }

    this.servicio.eliminarCita(id);

    if (this.idEditando === id) {
      this.cancelarEdicion();
    }

    this.mensaje = 'Cita eliminada correctamente.';
    this.error = '';

    this.actualizarDatos();
  }

  private actualizarDatos(): void {
    this.mascotas = this.servicio.listarMascotas();
    this.citas = this.servicio.listarCitas();
  }
}
