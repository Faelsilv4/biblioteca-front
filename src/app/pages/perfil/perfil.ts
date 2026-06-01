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
  editandoNome = false;

  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    this.tipoUsuario = localStorage.getItem('tipoUsuario') || '';
    this.novoNome = this.nomeUsuario() || '';
  }

  editarNome(): void {
    this.editandoNome = true;
    this.novoNome = this.nomeUsuario() || '';
  }

  cancelarEdicao(): void {
    this.editandoNome = false;
    this.novoNome = this.nomeUsuario() || '';
  }

  atualizarNome(): void {
    const nomeAtualizado = this.novoNome.trim();

    if (!nomeAtualizado) {
      this.snackBar.open('Informe um nome válido.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    this.authService.atualizarNome({
      novoNome: nomeAtualizado
    }).subscribe({
      next: () => {
        this.novoNome = nomeAtualizado;
        this.editandoNome = false;

        this.snackBar.open('Nome atualizado com sucesso!', 'Fechar', {
          duration: 3000
        });
      },
      error: () => {
        this.snackBar.open('Não foi possível atualizar o nome.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }
}