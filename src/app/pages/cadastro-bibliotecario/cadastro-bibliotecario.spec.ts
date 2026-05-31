import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroBibliotecario } from './cadastro-bibliotecario';

describe('CadastroBibliotecario', () => {
  let component: CadastroBibliotecario;
  let fixture: ComponentFixture<CadastroBibliotecario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroBibliotecario],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroBibliotecario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
