import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { LivroService } from '../../services/livro.service';
import { Livro } from '../../models/livro.model';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-gerenciar-livros',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './gerenciar-livros.html',
  styleUrl: './gerenciar-livros.css',
})
export class GerenciarLivros implements OnInit {
  private readonly livroService = inject(LivroService);
  private readonly snackBar = inject(MatSnackBar);

  livros = this.livroService.listar();

  livroEditandoId: number | null = null;

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

  salvarLivro(): void {
    if (this.livroEditandoId) {
      this.atualizarLivro();
    } else {
      this.cadastrarLivro();
    }
  }

  cadastrarLivro(): void {
    this.livroService.cadastrarLivro(this.novoLivro).subscribe({
      next: () => {
        this.snackBar.open('Livro cadastrado com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.livroService.carregar();
        this.limparFormulario();
      },
      error: () => {
        this.snackBar.open('Não foi possível cadastrar o livro.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  editarLivro(livro: Livro): void {
    this.livroEditandoId = livro.id;

    this.novoLivro = {
      titulo: livro.titulo,
      autor: livro.autor,
      genero: livro.genero,
      numPaginas: livro.numPaginas,
      anoDePublicacao: livro.anoDePublicacao,
      categoria: livro.categoria
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  atualizarLivro(): void {
    if (!this.livroEditandoId) {
      return;
    }

    this.livroService.atualizarLivro(this.livroEditandoId, this.novoLivro).subscribe({
      next: () => {
        this.snackBar.open('Livro atualizado com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.livroService.carregar();
        this.limparFormulario();
      },
      error: () => {
        this.snackBar.open('Não foi possível atualizar o livro.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  removerLivro(id: number): void {
    const confirmar = confirm('Tem certeza que deseja remover este livro?');

    if (!confirmar) {
      return;
    }

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

  private limparFormulario(): void {
    this.livroEditandoId = null;

    this.novoLivro = {
      titulo: '',
      autor: '',
      genero: '',
      numPaginas: 0,
      anoDePublicacao: '',
      categoria: ''
    };
  }

  filtro = '';

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
}