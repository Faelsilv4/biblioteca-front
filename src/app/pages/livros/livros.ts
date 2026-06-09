import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LivroService } from '../../services/livro.service';
import { Navbar } from '../../components/navbar/navbar';
import { EmprestimoService } from '../../services/emprestimo.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { DataBrPipe } from '../../pipes/data-br-pipe';

@Component({
  selector: 'app-livros',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    DataBrPipe,
    MatPaginatorModule
  ],
  templateUrl: './livros.html',
  styleUrl: './livros.css',
})
export class Livros implements OnInit {
  private readonly livroService = inject(LivroService);
  private readonly emprestimoService = inject(EmprestimoService);
  private readonly snackBar = inject(MatSnackBar);

  livros = this.livroService.listar();
  carregando = this.livroService.estaCarregando();
  erro = this.livroService.mensagemErro();

  filtro = '';

  paginaAtual = 0;
  itensPorPagina = 6;
  opcoesItensPorPagina = [6, 9, 12];

  ngOnInit(): void {
    this.livroService.carregar();
  }

  emprestar(livroId: number): void {
    this.emprestimoService.emprestarLivro(livroId).subscribe({
      next: () => {
        this.snackBar.open('Livro emprestado com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.livroService.carregar();
      },
      error: (erro) => {
        console.error(erro);

        const mensagem =
          erro.error?.message ||
          erro.error ||
          'Não foi possível realizar o empréstimo.';

        this.snackBar.open(mensagem, 'Fechar', {
          duration: 4000
        });
      }
    });
  }

  livrosFiltrados() {
    const texto = this.filtro.toLowerCase().trim();

    if (!texto) {
      return this.livros();
    }

    return this.livros().filter(livro =>
      livro.titulo.toLowerCase().includes(texto) ||
      livro.autor.toLowerCase().includes(texto) ||
      livro.genero.toLowerCase().includes(texto) ||
      livro.categoria.toLowerCase().includes(texto)
    );
  }

  livrosPaginados() {
    const inicio = this.paginaAtual * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    return this.livrosFiltrados().slice(inicio, fim);
  }

  mudarPagina(evento: PageEvent): void {
    this.paginaAtual = evento.pageIndex;
    this.itensPorPagina = evento.pageSize;
  }

  aoPesquisar(): void {
    this.paginaAtual = 0;
  }

  ehAluno(): boolean {
    return localStorage.getItem('tipoUsuario') === 'ALUNO';
  }

  ehBibliotecario(): boolean {
    return localStorage.getItem('tipoUsuario') === 'BIBLIOTECARIO';
  }
}