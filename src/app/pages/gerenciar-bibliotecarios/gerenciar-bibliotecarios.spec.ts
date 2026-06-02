import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarBibliotecarios } from './gerenciar-bibliotecarios';

describe('GerenciarBibliotecarios', () => {
  let component: GerenciarBibliotecarios;
  let fixture: ComponentFixture<GerenciarBibliotecarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarBibliotecarios],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarBibliotecarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
