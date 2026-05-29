import { Component, inject, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';
import { Navbar } from '../../components/navbar/navbar';
import { EmprestimoService } from '../../services/emprestimo.service';

@Component({
  selector: 'app-livros',
  imports: [Navbar],
  templateUrl: './livros.html',
  styleUrl: './livros.css',
})
export class Livros implements OnInit {
  private readonly livroService = inject(LivroService);
  private readonly emprestimoService = inject(EmprestimoService);

  livros = this.livroService.listar();
  carregando = this.livroService.estaCarregando();
  erro = this.livroService.mensagemErro();

  ngOnInit(): void {
    this.livroService.carregar();
  }
  emprestar(livroId: number): void {
  this.emprestimoService.emprestarLivro(livroId).subscribe({
    next: () => {
      alert('Livro emprestado com sucesso!');

      // Atualiza a lista após o empréstimo
      this.livroService.carregar();
    },
    error: (erro) => {
      console.error(erro);

      alert('Não foi possível realizar o empréstimo.');
    }
  });
}
}