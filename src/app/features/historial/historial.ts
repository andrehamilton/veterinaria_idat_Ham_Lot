
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Mascota,
  Atencion,
  VeterinariaService
} from '../../core/services/veterinaria.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial {
  private fb = inject(FormBuilder);
  private servicio = inject(VeterinariaService);

  mascotas: Mascota[] = [];
  atenciones: Atencion[] = [];
  mensaje = '';

  formulario = this.fb.nonNullable.group({
    mascotaId: [0, [Validators.required, Validators.min(1)]],
    fecha: [
      new Date().toISOString().slice(0, 10),
      Validators.required
    ],
    diagnostico: ['', Validators.required],
    tratamiento: ['', Validators.required]
  });

  constructor() {
    this.actualizarMascotas();
  }

  consultar(): void {
    const id = Number(
      this.formulario.controls.mascotaId.value
    );

    this.atenciones = id > 0
      ? this.servicio.listarAtenciones(id)
      : [];
  }

  registrar(): void {
    this.mensaje = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();

    const mascota = this.mascotas.find(
      m => m.id === Number(datos.mascotaId)
    );

    if (!mascota) {
      this.mensaje = 'Selecciona una mascota válida.';
      return;
    }

    this.servicio.registrarAtencion({
      mascotaId: mascota.id,
      fecha: datos.fecha,
      diagnostico: datos.diagnostico,
      tratamiento: datos.tratamiento
    });

    this.consultar();

    this.formulario.patchValue({
      diagnostico: '',
      tratamiento: ''
    });

    this.mensaje = 'Atención registrada correctamente.';
  }

  private actualizarMascotas(): void {
    this.mascotas = this.servicio.listarMascotas();
  }
}
