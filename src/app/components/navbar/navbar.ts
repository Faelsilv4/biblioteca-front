import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  nomeUsuario = this.authService.nomeUsuario;

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  tipoUsuario = this.authService.obterTipoUsuario();

  ehBibliotecario(): boolean {
    return this.tipoUsuario === 'BIBLIOTECARIO' || this.tipoUsuario === 'ADMIN';
  }

  ehAluno(): boolean {
    return this.tipoUsuario === 'ALUNO';
  }

  ehAdmin(): boolean {
    return this.tipoUsuario === 'ADMIN';
  }
}