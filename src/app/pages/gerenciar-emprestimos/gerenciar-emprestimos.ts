import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { EmprestimoService } from '../../services/emprestimo.service';
import { EmprestimoAdmin } from '../../models/emprestimo-admin.model';
import { DataBrPipe } from '../../pipes/data-br-pipe';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-gerenciar-emprestimos',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    DataBrPipe
  ],
  templateUrl: './gerenciar-emprestimos.html',
  styleUrl: './gerenciar-emprestimos.css',
})
export class GerenciarEmprestimos implements OnInit {
  private readonly emprestimoService = inject(EmprestimoService);

  emprestimos = signal<EmprestimoAdmin[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);

  filtro = '';

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

  emprestimosFiltrados(): EmprestimoAdmin[] {
    const texto = this.filtro.toLowerCase().trim();

    if (!texto) {
      return this.emprestimos();
    }

    return this.emprestimos().filter(emprestimo =>
      emprestimo.usuario.nome.toLowerCase().includes(texto) ||
      emprestimo.usuario.email.toLowerCase().includes(texto) ||
      emprestimo.livro.titulo.toLowerCase().includes(texto)
    );
  }
}