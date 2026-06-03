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

@Component({
  selector: 'app-gerenciar-alunos',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './gerenciar-alunos.html',
  styleUrl: './gerenciar-alunos.css',
})
export class GerenciarAlunos implements OnInit {
  private readonly alunoService = inject(AlunoService);
  private readonly snackBar = inject(MatSnackBar);

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

  ativarAluno(id: number): void {
    this.alunoService.ativar(id).subscribe({
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
  }

  desativarAluno(aluno: Aluno): void {
    const confirmar = confirm(`Deseja desativar o aluno ${aluno.nome}?`);

    if (!confirmar) {
      return;
    }

    this.alunoService.desativar(aluno.id).subscribe({
      next: () => {
        this.snackBar.open('Aluno desativado com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.carregarAlunos();
      },
      error: (erro) => {
        console.error(erro);

        const mensagem =
          erro.error?.message ||
          erro.error?.mensagem ||
          erro.error ||
          'Não foi possível desativar o aluno.';

        this.snackBar.open(
          typeof mensagem === 'string' ? mensagem : 'Não foi possível desativar o aluno.',
          'Fechar',
          { duration: 4000 }
        );
      }
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