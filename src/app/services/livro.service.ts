import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Livro } from '../models/livro.model';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/livros';

  private readonly livros = signal<Livro[]>([]);
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);

  listar(): Signal<Livro[]> {
    return this.livros.asReadonly();
  }

  estaCarregando(): Signal<boolean> {
    return this.carregando.asReadonly();
  }

  mensagemErro(): Signal<string | null> {
    return this.erro.asReadonly();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    const token = localStorage.getItem('token');

    this.http.get<Livro[]>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (dados) => {
        this.livros.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os livros.');
        this.carregando.set(false);
      }
    });
  }
}