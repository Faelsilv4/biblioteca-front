import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-perfil',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  nomeUsuario = this.authService.nomeUsuario;

  email = '';
  tipoUsuario = '';

  novoNome = '';
  novoEmail = '';

  editandoPerfil = false;

  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    this.tipoUsuario = localStorage.getItem('tipoUsuario') || '';
    this.novoNome = this.nomeUsuario() || '';
    this.novoEmail = this.email;
  }

  editarPerfil(): void {
    this.editandoPerfil = true;
    this.novoNome = this.nomeUsuario() || '';
    this.novoEmail = this.email;
  }

  cancelarEdicao(): void {
    this.editandoPerfil = false;
    this.novoNome = this.nomeUsuario() || '';
    this.novoEmail = this.email;
  }

  atualizarPerfil(): void {
    const nomeAtualizado = this.novoNome.trim();
    const emailAtualizado = this.novoEmail.trim();

    if (!nomeAtualizado) {
      this.snackBar.open('Informe um nome válido.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    if (!emailAtualizado) {
      this.snackBar.open('Informe um email válido.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    this.authService.atualizarPerfil({
      nome: nomeAtualizado,
      email: emailAtualizado
    }).subscribe({
      next: (perfilAtualizado: any) => {
        this.email = perfilAtualizado.email;
        this.novoNome = perfilAtualizado.nome;
        this.novoEmail = perfilAtualizado.email;
        this.editandoPerfil = false;

        localStorage.setItem('email', perfilAtualizado.email);
        localStorage.setItem('nome', perfilAtualizado.nome);

        this.authService.nomeUsuario.set(perfilAtualizado.nome);

        this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
          duration: 3000
        });
      },
      error: (erro) => {
        console.error(erro);

        const mensagem =
          erro.error?.message ||
          erro.error?.mensagem ||
          erro.error ||
          'Não foi possível atualizar o perfil.';

        this.snackBar.open(
          typeof mensagem === 'string'
            ? mensagem
            : 'Não foi possível atualizar o perfil.',
          'Fechar',
          { duration: 4000 }
        );
      }
    });
  }
}