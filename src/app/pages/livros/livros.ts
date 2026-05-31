import { Component, inject, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';
import { Navbar } from '../../components/navbar/navbar';
import { EmprestimoService } from '../../services/emprestimo.service';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DataBrPipe } from '../../pipes/data-br-pipe';

@Component({
  selector: 'app-livros',
  imports: [
    Navbar,
    MatCardModule,
    MatButtonModule,
    DataBrPipe,

    MatInputModule,
    MatFormFieldModule,
    FormsModule
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

  ngOnInit(): void {
    this.livroService.carregar();
  }
  emprestar(livroId: number): void {
    this.emprestimoService.emprestarLivro(livroId).subscribe({
      next: () => {
        this.snackBar.open(
          'Livro emprestado com sucesso!',
          'Fechar',
          {
            duration: 3000
          }
        );

        this.livroService.carregar();
      },
      error: (erro) => {
        console.error(erro);

        this.snackBar.open(
          'Não foi possível realizar o empréstimo.',
          'Fechar',
          {
            duration: 3000
          }
        );
      }
    });
  }

  filtro = '';
  livrosFiltrados() {
  const texto = this.filtro.toLowerCase().trim();

  if (!texto) {
    return this.livroService.listar()();
  }

  return this.livroService.listar()().filter(livro =>
    livro.titulo.toLowerCase().includes(texto) ||
    livro.autor.toLowerCase().includes(texto) ||
    livro.genero.toLowerCase().includes(texto) ||
    livro.categoria.toLowerCase().includes(texto)
  );
}
}