import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastro-aluno',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './cadastro-aluno.html',
  styleUrl: './cadastro-aluno.css',
})
export class CadastroAluno {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  aluno = {
    nome: '',
    email: '',
    senha: '',
    matricula: ''
  };

  cadastrar(): void {

    const nome = this.aluno.nome.trim();
    const email = this.aluno.email.trim();
    const senha = this.aluno.senha.trim();
    const matriculaTexto = String(this.aluno.matricula).trim();

    if (!nome) {
      this.snackBar.open('Informe o nome do aluno.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    if (!email) {
      this.snackBar.open('Informe o email.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      this.snackBar.open('Informe um email válido.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    if (!senha) {
      this.snackBar.open('Informe a senha.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    if (senha.length < 4) {
      this.snackBar.open(
        'A senha deve possuir pelo menos 4 caracteres.',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }

    if (!matriculaTexto) {
      this.snackBar.open(
        'Informe a matrícula.',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }

    if (!/^\d+$/.test(matriculaTexto)) {
      this.snackBar.open(
        'A matrícula deve conter apenas números.',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }

    if (matriculaTexto.length > 9) {
      this.snackBar.open(
        'A matrícula deve ter no máximo 9 dígitos.',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }

    const matricula = Number(matriculaTexto);

    this.authService.cadastrarAluno({
      nome,
      email,
      senha,
      matricula
    }).subscribe({
      next: () => {
        this.snackBar.open(
          'Aluno cadastrado com sucesso!',
          'Fechar',
          {
            duration: 3000
          }
        );

        this.router.navigate(['/']);
      },
      error: (erro) => {

        const mensagem =
          erro.error?.message ||
          erro.error?.mensagem ||
          erro.error ||
          'Não foi possível cadastrar o aluno.';

        this.snackBar.open(
          typeof mensagem === 'string'
            ? mensagem
            : 'Não foi possível cadastrar o aluno.',
          'Fechar',
          {
            duration: 4000
          }
        );
      }
    });
  }
}