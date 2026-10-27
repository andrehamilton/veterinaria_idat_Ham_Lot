
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Mascotas } from './features/mascotas/mascotas';
import { Citas } from './features/citas/citas';
import { Historial } from './features/historial/historial';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    Mascotas,
    Citas,
    Historial
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  seccion: string = 'mascotas';

  cambiarSeccion(seccion: string): void {
    this.seccion = seccion;
  }
}
