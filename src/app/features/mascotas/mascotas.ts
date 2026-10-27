
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Mascota,
  VeterinariaService
} from '../../core/services/veterinaria.service';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css'
})
export class Mascotas {
  mascotas: Mascota[] = [];
  idEditando: number | null = null;
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private veterinariaService: VeterinariaService
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      edad: [1, [Validators.required, Validators.min(0)]],
      propietario: ['', Validators.required],
      telefono: ['', Validators.required]
    });

    this.actualizarLista();
  }

  actualizarLista(): void {
    this.mascotas = this.veterinariaService.listarMascotas();
  }

  editarMascota(mascota: Mascota): void {
    this.idEditando = mascota.id;

    this.formulario.patchValue({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      edad: mascota.edad,
      propietario: mascota.propietario,
      telefono: mascota.telefono
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  guardarMascota(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    const datos: Omit<Mascota, 'id'> = {
      nombre: String(valores.nombre ?? ''),
      especie: String(valores.especie ?? ''),
      raza: String(valores.raza ?? ''),
      edad: Number(valores.edad),
      propietario: String(valores.propietario ?? ''),
      telefono: String(valores.telefono ?? '')
    };

    if (this.idEditando !== null) {
      const actualizado =
        this.veterinariaService.actualizarMascota(
          this.idEditando,
          datos
        );

      if (!actualizado) {
        alert('No se encontró la mascota que deseas editar.');
        this.actualizarLista();
        return;
      }

      alert('Mascota actualizada correctamente.');
    } else {
      this.veterinariaService.registrarMascota(datos);
      alert('Mascota registrada correctamente.');
    }

    this.cancelarEdicion();
    this.actualizarLista();
  }

  eliminarMascota(id: number): void {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar esta mascota?'
    );

    if (!confirmar) {
      return;
    }

    this.veterinariaService.eliminarMascota(id);

    if (this.idEditando === id) {
      this.cancelarEdicion();
    }

    this.actualizarLista();
  }

  cancelarEdicion(): void {
    this.idEditando = null;

    this.formulario.reset({
      nombre: '',
      especie: '',
      raza: '',
      edad: 1,
      propietario: '',
      telefono: ''
    });
  }
}
