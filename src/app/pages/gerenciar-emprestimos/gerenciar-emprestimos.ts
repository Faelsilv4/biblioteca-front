import { Component, inject, OnInit, signal } from '@angular/core';

import { Navbar } from '../../components/navbar/navbar';
import { EmprestimoService } from '../../services/emprestimo.service';
import { EmprestimoAdmin } from '../../models/emprestimo-admin.model';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-gerenciar-emprestimos',
  imports: [
    Navbar,
    MatCardModule
  ],
  templateUrl: './gerenciar-emprestimos.html',
  styleUrl: './gerenciar-emprestimos.css',
})
export class GerenciarEmprestimos implements OnInit {
  private readonly emprestimoService = inject(EmprestimoService);

  emprestimos = signal<EmprestimoAdmin[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    this.carregarTodosEmprestimos();
  }

  carregarTodosEmprestimos(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.emprestimoService.listarTodosEmprestimos().subscribe({
      next: (dados) => {
        this.emprestimos.set(dados);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error(erro);
        this.erro.set('Não foi possível carregar os empréstimos.');
        this.carregando.set(false);
      }
    });
  }
}