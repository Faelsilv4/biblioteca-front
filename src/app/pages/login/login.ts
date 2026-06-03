import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  senha = '';

  erro = signal<string | null>(null);
  carregando = signal(false);
  mostrarSenha = signal(false);

  alternarSenha(): void {
    this.mostrarSenha.update(valor => !valor);
  }

  entrar(): void {
    this.erro.set(null);
    this.carregando.set(true);

    this.authService.login({
      email: this.email,
      senha: this.senha
    }).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/livros']);
      },
      error: (erro) => {
        this.carregando.set(false);

        const mensagem =
          erro.error?.mensagem ||
          erro.error?.message ||
          'Email ou senha inválidos.';

        this.erro.set(mensagem);
      }
    });
  }
}