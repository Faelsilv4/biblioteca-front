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
    matricula: 0
  };

  cadastrar(): void {
    this.authService.cadastrarAluno(this.aluno).subscribe({
      next: () => {
        this.snackBar.open('Aluno cadastrado com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.router.navigate(['/']);
      },
      error: () => {
        this.snackBar.open('Não foi possível cadastrar o aluno.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }
}