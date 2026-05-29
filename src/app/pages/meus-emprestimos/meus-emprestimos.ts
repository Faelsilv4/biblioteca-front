import { Component, inject, OnInit } from '@angular/core';
import { EmprestimoService } from '../../services/emprestimo.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-meus-emprestimos',
  imports: [Navbar],
  templateUrl: './meus-emprestimos.html',
  styleUrl: './meus-emprestimos.css',
})
export class MeusEmprestimos implements OnInit {
  private readonly emprestimoService = inject(EmprestimoService);

  emprestimos = this.emprestimoService.listar();
  carregando = this.emprestimoService.estaCarregando();
  erro = this.emprestimoService.mensagemErro();

  ngOnInit(): void {
    this.emprestimoService.carregarMeusEmprestimos();
  }
  devolver(emprestimoId: number): void {
  this.emprestimoService.devolverLivro(emprestimoId).subscribe({
    next: () => {
      alert('Livro devolvido com sucesso!');
      this.emprestimoService.carregarMeusEmprestimos();
    },
    error: () => {
      alert('Não foi possível devolver o livro.');
    }
  });
}
}