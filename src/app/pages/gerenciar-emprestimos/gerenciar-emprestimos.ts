import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { EmprestimoService } from '../../services/emprestimo.service';
import { EmprestimoAdmin } from '../../models/emprestimo-admin.model';
import { DataBrPipe } from '../../pipes/data-br-pipe';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';

@Component({
  selector: 'app-gerenciar-emprestimos',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DataBrPipe,
    MatButtonModule
  ],
  templateUrl: './gerenciar-emprestimos.html',
  styleUrl: './gerenciar-emprestimos.css',
})
export class GerenciarEmprestimos implements OnInit {
  private readonly emprestimoService = inject(EmprestimoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

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
        this.erro.set(null);
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

  devolverLivro(emprestimoId: number): void {
    const emprestimo = this.emprestimos().find(item => item.id === emprestimoId);

    const nomeLivro = emprestimo?.livro?.titulo || 'este livro';

    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      data: {
        titulo: 'Registrar devolução',
        mensagem: `Tem certeza que deseja registrar a devolução do livro "${nomeLivro}"?`,
        textoConfirmar: 'Devolver',
        icone: 'assignment_return'
      }
    });

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (!confirmou) {
        return;
      }

      this.emprestimoService.devolverLivro(emprestimoId).subscribe({
        next: () => {
          this.snackBar.open('Livro devolvido com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.carregarTodosEmprestimos();
        },
        error: (erro) => {
          console.error(erro);

          const mensagem =
            erro.error?.message ||
            erro.error?.mensagem ||
            erro.error ||
            'Não foi possível devolver o livro.';

          this.snackBar.open(
            typeof mensagem === 'string'
              ? mensagem
              : 'Não foi possível devolver o livro.',
            'Fechar',
            { duration: 4000 }
          );
        }
      });
    });
  }
}