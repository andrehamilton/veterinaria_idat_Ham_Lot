
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appProximaCita]',
  standalone: true
})
export class ProximaCitaDirective implements OnChanges {
  @Input('appProximaCita') fechaCita = '';

  constructor(
    private elemento: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    const fecha = new Date(this.fechaCita);
    const diferencia = fecha.getTime() - Date.now();
    const unDia = 24 * 60 * 60 * 1000;

    const esProxima =
      !Number.isNaN(fecha.getTime()) &&
      diferencia >= 0 &&
      diferencia <= unDia;

    this.renderer.setStyle(
      this.elemento.nativeElement,
      'border-left',
      esProxima ? '5px solid #198754' : 'none'
    );

    this.renderer.setStyle(
      this.elemento.nativeElement,
      'background-color',
      esProxima ? '#e8f5e9' : ''
    );
  }
}
