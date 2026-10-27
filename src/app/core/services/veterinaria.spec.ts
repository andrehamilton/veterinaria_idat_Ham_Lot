import { TestBed } from '@angular/core/testing';

import { Veterinaria } from './veterinaria';

describe('Veterinaria', () => {
  let service: Veterinaria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Veterinaria);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
