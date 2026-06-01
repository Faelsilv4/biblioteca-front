import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
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

  entrar(): void {
    this.erro.set(null);
    this.carregando.set(true);

    this.authService.login({
      email: this.email,
      senha: this.senha
    }).subscribe({
      next: () => {
        this.carregando.set(false);

        const tipoUsuario = this.authService.obterTipoUsuario();

        if (tipoUsuario === 'BIBLIOTECARIO') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/livros']);
        }
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Email ou senha inválidos.');
      }
    });
  }
}