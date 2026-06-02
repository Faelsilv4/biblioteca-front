  import { Component, inject, OnInit, signal } from '@angular/core';
  import { FormsModule } from '@angular/forms';

  import { Navbar } from '../../components/navbar/navbar';
  import { BibliotecarioService } from '../../services/bibliotecario.service';
  import { Bibliotecario } from '../../models/bibliotecario.model';

  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { MatIconModule } from '@angular/material/icon';
  import { MatDatepickerModule } from '@angular/material/datepicker';
  import { MatNativeDateModule } from '@angular/material/core';

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
      MatNativeDateModule
    ],
    templateUrl: './gerenciar-bibliotecarios.html',
    styleUrl: './gerenciar-bibliotecarios.css',
  })
  export class GerenciarBibliotecarios implements OnInit {
    private readonly bibliotecarioService = inject(BibliotecarioService);
    private readonly snackBar = inject(MatSnackBar);

    bibliotecarios = signal<Bibliotecario[]>([]);
    carregando = signal(false);
    erro = signal<string | null>(null);

    filtro = '';

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
            typeof mensagem === 'string' ? mensagem : 'Não foi possível cadastrar o bibliotecário.',
            'Fechar',
            { duration: 4000 }
          );
        }
      });
    }

    ativarBibliotecario(id: number): void {
      this.bibliotecarioService.ativar(id).subscribe({
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

      const confirmar = confirm(`Deseja desativar o bibliotecário ${bibliotecario.nome}?`);

      if (!confirmar) {
        return;
      }

      this.bibliotecarioService.desativar(bibliotecario.id).subscribe({
        next: () => {
          this.snackBar.open('Bibliotecário desativado com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.carregarBibliotecarios();
        },
        error: (erro) => {
          console.error(erro);

          const mensagem =
            erro.error?.message ||
            erro.error?.mensagem ||
            erro.error ||
            'Não foi possível desativar o bibliotecário.';

          this.snackBar.open(
            typeof mensagem === 'string' ? mensagem : 'Não foi possível desativar o bibliotecário.',
            'Fechar',
            { duration: 4000 }
          );
        }
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

    private limparFormulario(): void {
      this.novoBibliotecario = {
        nome: '',
        email: '',
        senha: '',
        anoDeContratacao: ''
      };
    }
  }