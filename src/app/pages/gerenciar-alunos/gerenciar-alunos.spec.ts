import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarAlunos } from './gerenciar-alunos';

describe('GerenciarAlunos', () => {
  let component: GerenciarAlunos;
  let fixture: ComponentFixture<GerenciarAlunos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarAlunos],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarAlunos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
