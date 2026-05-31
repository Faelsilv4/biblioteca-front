import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro-bibliotecario',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './cadastro-bibliotecario.html',
  styleUrl: './cadastro-bibliotecario.css',
})
export class CadastroBibliotecario {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  nome = '';
  email = '';
  senha = '';
  anoDeContratacao = '';

  cadastrar(): void {
    this.authService.cadastrarBibliotecario({
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      anoDeContratacao: this.anoDeContratacao
    }).subscribe({
      next: () => {

        this.snackBar.open(
          'Bibliotecário cadastrado com sucesso!',
          'Fechar',
          {
            duration: 3000
          }
        );

        this.router.navigate(['/']);
      },

      error: () => {
        this.snackBar.open(
          'Não foi possível cadastrar o bibliotecário.',
          'Fechar',
          {
            duration: 3000
          }
        );
      }
    });
  }
}