import { Component, inject, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';

@Component({
  selector: 'app-livros',
  imports: [],
  templateUrl: './livros.html',
  styleUrl: './livros.css',
})
export class Livros implements OnInit {
  private readonly livroService = inject(LivroService);

  livros = this.livroService.listar();
  carregando = this.livroService.estaCarregando();
  erro = this.livroService.mensagemErro();

  ngOnInit(): void {
    this.livroService.carregar();
  }
}