import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-perfil',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  nome = '';
  email = '';
  tipoUsuario = '';
  novoNome = '';
  editandoNome = false;

  ngOnInit(): void {
    this.nome = localStorage.getItem('nome') || '';
    this.email = localStorage.getItem('email') || '';
    this.tipoUsuario = localStorage.getItem('tipoUsuario') || '';

    this.novoNome = this.nome;
  }

  editarNome(): void {
    this.editandoNome = true;
    this.novoNome = this.nome;
  }

  cancelarEdicao(): void {
    this.editandoNome = false;
    this.novoNome = this.nome;
  }

  atualizarNome(): void {
    this.authService.atualizarNome({
      novoNome: this.novoNome
    }).subscribe({
      next: (perfilAtualizado) => {
        this.nome = perfilAtualizado.nome;
        this.novoNome = perfilAtualizado.nome;
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