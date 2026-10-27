
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoCita',
  standalone: true
})
export class EstadoCitaPipe implements PipeTransform {
  transform(estado: string | null | undefined): string {
    switch (estado) {
      case 'Pendiente':
        return 'Pendiente de atención';
      case 'Confirmada':
        return 'Cita confirmada';
      case 'Atendida':
        return 'Atención realizada';
      case 'Cancelada':
        return 'Cita cancelada';
      default:
        return estado || 'Sin estado';
    }
  }
}
