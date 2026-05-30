import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarLivros } from './gerenciar-livros';

describe('GerenciarLivros', () => {
  let component: GerenciarLivros;
  let fixture: ComponentFixture<GerenciarLivros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarLivros],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarLivros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
