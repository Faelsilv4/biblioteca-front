import { Component, inject, OnInit } from '@angular/core';
import { EmprestimoService } from '../../services/emprestimo.service';
import { Navbar } from '../../components/navbar/navbar';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meus-emprestimos',
  imports: [
    Navbar,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './meus-emprestimos.html',
  styleUrl: './meus-emprestimos.css',
})
export class MeusEmprestimos implements OnInit {
  private readonly emprestimoService = inject(EmprestimoService);
  private readonly snackBar = inject(MatSnackBar);

  emprestimos = this.emprestimoService.listar();
  carregando = this.emprestimoService.estaCarregando();
  erro = this.emprestimoService.mensagemErro();

  ngOnInit(): void {
    this.emprestimoService.carregarMeusEmprestimos();
  }

  devolver(emprestimoId: number): void {
    this.emprestimoService.devolverLivro(emprestimoId).subscribe({
      next: () => {
        this.snackBar.open('Livro devolvido com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.emprestimoService.carregarMeusEmprestimos();
      },
      error: () => {
        this.snackBar.open('Não foi possível devolver o livro.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }
}