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

  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;
  mostrarConfirmacaoSenha = false;

  email = '';
  tipoUsuario = '';

  novoNome = '';
  novoEmail = '';

  senhaAtual = '';
  novaSenha = '';
  confirmarNovaSenha = '';

  editandoPerfil = false;
  editandoSenha = false;

  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    this.tipoUsuario = localStorage.getItem('tipoUsuario') || '';
    this.novoNome = this.nomeUsuario() || '';
    this.novoEmail = this.email;
  }

  editarPerfil(): void {
    this.editandoPerfil = true;
    this.editandoSenha = false;

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

  abrirAlterarSenha(): void {
    this.editandoSenha = true;
    this.editandoPerfil = false;

    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarNovaSenha = '';
  }

  cancelarAlterarSenha(): void {
    this.editandoSenha = false;

    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarNovaSenha = '';
  }

  alterarSenha(): void {
    const senhaAtual = this.senhaAtual.trim();
    const novaSenha = this.novaSenha.trim();
    const confirmarNovaSenha = this.confirmarNovaSenha.trim();

    if (!senhaAtual) {
      this.snackBar.open('Informe a senha atual.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    if (!novaSenha) {
      this.snackBar.open('Informe a nova senha.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    if (novaSenha.length < 4) {
      this.snackBar.open('A nova senha deve possuir pelo menos 4 caracteres.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    if (!confirmarNovaSenha) {
      this.snackBar.open('Confirme a nova senha.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      this.snackBar.open('A confirmação da senha não confere.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    this.authService.alterarSenha({
      senhaAtual,
      novaSenha,
      confirmarNovaSenha
    }).subscribe({
      next: () => {
        this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.cancelarAlterarSenha();
      },
      error: (erro) => {
        console.error(erro);

        const mensagem =
          erro.error?.message ||
          erro.error?.mensagem ||
          erro.error ||
          'Não foi possível alterar a senha.';

        this.snackBar.open(
          typeof mensagem === 'string'
            ? mensagem
            : 'Não foi possível alterar a senha.',
          'Fechar',
          { duration: 4000 }
        );
      }
    });
  }
}