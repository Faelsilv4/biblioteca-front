import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { LivroService } from '../../services/livro.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gerenciar-livros',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './gerenciar-livros.html',
  styleUrl: './gerenciar-livros.css',
})
export class GerenciarLivros implements OnInit {
  private readonly livroService = inject(LivroService);
  private readonly snackBar = inject(MatSnackBar);

  livros = this.livroService.listar();

  novoLivro = {
    titulo: '',
    autor: '',
    genero: '',
    numPaginas: 0,
    anoDePublicacao: '',
    categoria: ''
  };

  ngOnInit(): void {
    this.livroService.carregar();
  }

  cadastrarLivro(): void {
    this.livroService.cadastrarLivro(this.novoLivro).subscribe({
      next: () => {
        this.snackBar.open('Livro cadastrado com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.livroService.carregar();

        this.novoLivro = {
          titulo: '',
          autor: '',
          genero: '',
          numPaginas: 0,
          anoDePublicacao: '',
          categoria: ''
        };
      },
      error: () => {
        this.snackBar.open('Não foi possível cadastrar o livro.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  removerLivro(id: number): void {
    this.livroService.removerLivro(id).subscribe({
      next: () => {
        this.snackBar.open('Livro removido com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.livroService.carregar();
      },
      error: () => {
        this.snackBar.open('Não foi possível remover o livro.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }
}