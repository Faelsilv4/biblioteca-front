import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { AlunoService } from '../../services/aluno.service';
import { Aluno } from '../../models/aluno.model';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';

@Component({
  selector: 'app-gerenciar-alunos',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ConfirmacaoDialog
  ],
  templateUrl: './gerenciar-alunos.html',
  styleUrl: './gerenciar-alunos.css',
})
export class GerenciarAlunos implements OnInit {
  private readonly alunoService = inject(AlunoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  alunos = signal<Aluno[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);

  filtro = '';

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.alunoService.listar().subscribe({
      next: (dados) => {
        this.alunos.set(dados);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error(erro);
        this.erro.set('Não foi possível carregar os alunos.');
        this.carregando.set(false);
      }
    });
  }

  ativarAluno(aluno: Aluno): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      data: {
        titulo: 'Ativar aluno',
        mensagem: `Tem certeza que deseja ativar o aluno "${aluno.nome}"? Após a ativação, ele poderá acessar novamente o sistema.`,
        textoConfirmar: 'Ativar',
        icone: 'check_circle'
      }
    });

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (!confirmou) {
        return;
      }

      this.alunoService.ativar(aluno.id).subscribe({
        next: () => {
          this.snackBar.open('Aluno ativado com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.carregarAlunos();
        },
        error: () => {
          this.snackBar.open('Não foi possível ativar o aluno.', 'Fechar', {
            duration: 3000
          });
        }
      });
    });
  }

  desativarAluno(aluno: Aluno): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      data: {
        titulo: 'Desativar aluno',
        mensagem: `Tem certeza que deseja desativar o aluno "${aluno.nome}"? O aluno perderá o acesso ao sistema até ser reativado por um administrador.`,
        textoConfirmar: 'Desativar',
        icone: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (!confirmou) {
        return;
      }

      this.alunoService.desativar(aluno.id).subscribe({
        next: () => {
          this.snackBar.open('Aluno desativado com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.carregarAlunos();
        },
        error: () => {
          this.snackBar.open('Não foi possível desativar o aluno.', 'Fechar', {
            duration: 3000
          });
        }
      });
    });
  }

  alunosFiltrados(): Aluno[] {
    const texto = this.filtro.toLowerCase().trim();

    if (!texto) {
      return this.alunos();
    }

    return this.alunos().filter(aluno =>
      aluno.nome.toLowerCase().includes(texto) ||
      aluno.email.toLowerCase().includes(texto) ||
      aluno.matricula.toString().includes(texto)
    );
  }
}