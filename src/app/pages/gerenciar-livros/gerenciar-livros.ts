import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { LivroService } from '../../services/livro.service';

@Component({
  selector: 'app-gerenciar-livros',
  imports: [Navbar, FormsModule],
  templateUrl: './gerenciar-livros.html',
  styleUrl: './gerenciar-livros.css',
})
export class GerenciarLivros implements OnInit {
  private readonly livroService = inject(LivroService);

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
        alert('Livro cadastrado com sucesso!');
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
        alert('Não foi possível cadastrar o livro.');
      }
    });
  }

  removerLivro(id: number): void {
    this.livroService.removerLivro(id).subscribe({
      next: () => {
        alert('Livro removido com sucesso!');
        this.livroService.carregar();
      },
      error: () => {
        alert('Não foi possível remover o livro.');
      }
    });
  }
}