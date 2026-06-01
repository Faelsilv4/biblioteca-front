import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { LivroService } from '../../services/livro.service';
import { Livro } from '../../models/livro.model';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  selector: 'app-gerenciar-livros',
  imports: [
    Navbar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './gerenciar-livros.html',
  styleUrl: './gerenciar-livros.css',
})
export class GerenciarLivros implements OnInit {
  private readonly livroService = inject(LivroService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  livros = this.livroService.listar();

  livroEditandoId: number | null = null;
  filtro = '';

  novoLivro = {
    titulo: '',
    autor: '',
    genero: '',
    numPaginas: 0,
    anoDePublicacao: '',
    categoria: ''
  };

  ngOnInit(): void {
    this.livroService.carregar();
  }

  salvarLivro(): void {
    if (this.livroEditandoId) {
      this.atualizarLivro();
    } else {
      this.cadastrarLivro();
    }
  }

  cadastrarLivro(): void {
    this.livroService.cadastrarLivro(this.novoLivro).subscribe({
      next: () => {
        this.snackBar.open('Livro cadastrado com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.livroService.carregar();
        this.limparFormulario();
      },
      error: () => {
        this.snackBar.open('Não foi possível cadastrar o livro.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  editarLivro(livro: Livro): void {
    this.livroEditandoId = livro.id;

    this.novoLivro = {
      titulo: livro.titulo,
      autor: livro.autor,
      genero: livro.genero,
      numPaginas: livro.numPaginas,
      anoDePublicacao: livro.anoDePublicacao,
      categoria: livro.categoria
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  atualizarLivro(): void {
    if (!this.livroEditandoId) {
      return;
    }

    this.livroService.atualizarLivro(this.livroEditandoId, this.novoLivro).subscribe({
      next: () => {
        this.snackBar.open('Livro atualizado com sucesso!', 'Fechar', {
          duration: 3000
        });

        this.livroService.carregar();
        this.limparFormulario();
      },
      error: () => {
        this.snackBar.open('Não foi possível atualizar o livro.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  removerLivro(livro: Livro): void {
    const status = livro.status?.toString().toUpperCase();

    if (status !== 'DISPONIVEL') {
      this.snackBar.open(
        'Não é possível remover este livro, pois ele está emprestado.',
        'Fechar',
        { duration: 4000 }
      );
      return;
    }

    const dialogRef = this.dialog.open(ConfirmarRemocaoLivroDialog, {
      width: '390px',
      data: livro.titulo
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (!confirmado) {
        return;
      }

      this.livroService.removerLivro(livro.id).subscribe({
        next: () => {
          this.snackBar.open('Livro removido com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.livroService.carregar();
        },
        error: (erro) => {
          console.error(erro);

          const mensagem =
            erro.error?.message ||
            erro.error?.erro ||
            erro.error?.mensagem ||
            'Não foi possível remover o livro.';

          this.snackBar.open(mensagem, 'Fechar', {
            duration: 4000
          });
        }
      });
    });
  }
  livrosFiltrados() {
    const texto = this.filtro.toLowerCase().trim();

    if (!texto) {
      return this.livros();
    }

    return this.livros().filter(livro =>
      livro.titulo.toLowerCase().includes(texto) ||
      livro.autor.toLowerCase().includes(texto) ||
      livro.genero.toLowerCase().includes(texto) ||
      livro.categoria.toLowerCase().includes(texto)
    );
  }

  private limparFormulario(): void {
    this.livroEditandoId = null;

    this.novoLivro = {
      titulo: '',
      autor: '',
      genero: '',
      numPaginas: 0,
      anoDePublicacao: '',
      categoria: ''
    };
  }
}

@Component({
  selector: 'app-confirmar-remocao-livro-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="titulo-dialog">
      <mat-icon color="warn">warning</mat-icon>
      Confirmar remoção
    </h2>

    <mat-dialog-content>
      <p>
        Tem certeza que deseja remover o livro
        <strong>{{ tituloLivro }}</strong>?
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">
        Cancelar
      </button>

      <button mat-raised-button color="warn" (click)="confirmar()">
        Remover
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .titulo-dialog {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-dialog-content {
      font-size: 16px;
    }
  `]
})
export class ConfirmarRemocaoLivroDialog {
  tituloLivro = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmarRemocaoLivroDialog>);

  cancelar(): void {
    this.dialogRef.close(false);
  }

  confirmar(): void {
    this.dialogRef.close(true);
  }
}