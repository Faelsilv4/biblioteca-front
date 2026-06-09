import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { BibliotecarioService } from '../../services/bibliotecario.service';
import { Bibliotecario } from '../../models/bibliotecario.model';
import { DataBrPipe } from '../../pipes/data-br-pipe';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';

@Component({
  selector: 'app-gerenciar-bibliotecarios',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    DataBrPipe
  ],
  templateUrl: './gerenciar-bibliotecarios.html',
  styleUrl: './gerenciar-bibliotecarios.css'
})
export class GerenciarBibliotecarios implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly bibliotecarioService = inject(BibliotecarioService);
  private readonly snackBar = inject(MatSnackBar);

  bibliotecarios = signal<Bibliotecario[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);

  filtro = '';
  bibliotecarioEditandoId: number | null = null;

  paginaAtual = 0;
  itensPorPagina = 6;
  opcoesItensPorPagina = [6, 9, 12];

  novoBibliotecario = {
    nome: '',
    email: '',
    senha: '',
    anoDeContratacao: ''
  };

  ngOnInit(): void {
    this.carregarBibliotecarios();
  }

  carregarBibliotecarios(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.bibliotecarioService.listar().subscribe({
      next: (dados) => {
        this.bibliotecarios.set(dados);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error(erro);
        this.erro.set('Não foi possível carregar os bibliotecários.');
        this.carregando.set(false);
      }
    });
  }

  salvarBibliotecario(): void {
    if (this.bibliotecarioEditandoId) {
      this.atualizarBibliotecario();
    } else {
      this.cadastrarBibliotecario();
    }
  }

  cadastrarBibliotecario(): void {
    this.bibliotecarioService.cadastrar(this.novoBibliotecario).subscribe({
      next: () => {
        this.snackBar.open('Bibliotecário cadastrado com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.limparFormulario();
        this.carregarBibliotecarios();
      },
      error: (erro) => {
        console.error(erro);

        const mensagem =
          erro.error?.message ||
          erro.error?.mensagem ||
          erro.error ||
          'Não foi possível cadastrar o bibliotecário.';

        this.snackBar.open(
          typeof mensagem === 'string'
            ? mensagem
            : 'Não foi possível cadastrar o bibliotecário.',
          'Fechar',
          { duration: 4000 }
        );
      }
    });
  }

  editarBibliotecario(bibliotecario: Bibliotecario): void {
    if (bibliotecario.role === 'ADMIN') {
      this.snackBar.open(
        'O administrador principal não pode ser editado nesta tela.',
        'Fechar',
        { duration: 4000 }
      );
      return;
    }

    this.bibliotecarioEditandoId = bibliotecario.id;

    this.novoBibliotecario = {
      nome: bibliotecario.nome,
      email: bibliotecario.email,
      senha: '',
      anoDeContratacao: bibliotecario.anoDeContratacao || ''
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  atualizarBibliotecario(): void {
    if (!this.bibliotecarioEditandoId) {
      return;
    }

    const dadosAtualizados = {
      nome: this.novoBibliotecario.nome,
      email: this.novoBibliotecario.email,
      anoDeContratacao: this.novoBibliotecario.anoDeContratacao
    };

    this.bibliotecarioService
      .atualizar(this.bibliotecarioEditandoId, dadosAtualizados)
      .subscribe({
        next: () => {
          this.snackBar.open('Bibliotecário atualizado com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.limparFormulario();
          this.carregarBibliotecarios();
        },
        error: (erro) => {
          console.error(erro);

          const mensagem =
            erro.error?.message ||
            erro.error?.mensagem ||
            erro.error ||
            'Não foi possível atualizar o bibliotecário.';

          this.snackBar.open(
            typeof mensagem === 'string'
              ? mensagem
              : 'Não foi possível atualizar o bibliotecário.',
            'Fechar',
            { duration: 4000 }
          );
        }
      });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  ativarBibliotecario(bibliotecario: Bibliotecario): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      data: {
        titulo: 'Ativar bibliotecário',
        mensagem: `Tem certeza que deseja ativar o bibliotecário "${bibliotecario.nome}"? Após a ativação, ele poderá acessar novamente o sistema.`,
        textoConfirmar: 'Ativar',
        icone: 'check_circle'
      }
    });

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (!confirmou) {
        return;
      }

      this.bibliotecarioService.ativar(bibliotecario.id).subscribe({
        next: () => {
          this.snackBar.open('Bibliotecário ativado com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.carregarBibliotecarios();
        },
        error: () => {
          this.snackBar.open('Não foi possível ativar o bibliotecário.', 'Fechar', {
            duration: 3000
          });
        }
      });
    });
  }

  desativarBibliotecario(bibliotecario: Bibliotecario): void {
    if (bibliotecario.role === 'ADMIN') {
      this.snackBar.open(
        'O administrador principal do sistema não pode ser desativado.',
        'Fechar',
        { duration: 4000 }
      );
      return;
    }

    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      data: {
        titulo: 'Desativar bibliotecário',
        mensagem: `Tem certeza que deseja desativar o bibliotecário "${bibliotecario.nome}"? O bibliotecário perderá o acesso ao sistema até ser reativado por um administrador.`,
        textoConfirmar: 'Desativar',
        icone: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (!confirmou) {
        return;
      }

      this.bibliotecarioService.desativar(bibliotecario.id).subscribe({
        next: () => {
          this.snackBar.open('Bibliotecário desativado com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.carregarBibliotecarios();
        },
        error: () => {
          this.snackBar.open('Não foi possível desativar o bibliotecário.', 'Fechar', {
            duration: 3000
          });
        }
      });
    });
  }

  bibliotecariosFiltrados(): Bibliotecario[] {
    const texto = this.filtro.toLowerCase().trim();

    if (!texto) {
      return this.bibliotecarios();
    }

    return this.bibliotecarios().filter(bibliotecario =>
      bibliotecario.nome.toLowerCase().includes(texto) ||
      bibliotecario.email.toLowerCase().includes(texto) ||
      bibliotecario.role.toLowerCase().includes(texto)
    );
  }

  bibliotecariosPaginados(): Bibliotecario[] {
    const inicio = this.paginaAtual * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    return this.bibliotecariosFiltrados().slice(inicio, fim);
  }

  mudarPagina(evento: PageEvent): void {
    this.paginaAtual = evento.pageIndex;
    this.itensPorPagina = evento.pageSize;
  }

  aoPesquisar(): void {
    this.paginaAtual = 0;
  }

  private limparFormulario(): void {
    this.bibliotecarioEditandoId = null;

    this.novoBibliotecario = {
      nome: '',
      email: '',
      senha: '',
      anoDeContratacao: ''
    };
  }
}