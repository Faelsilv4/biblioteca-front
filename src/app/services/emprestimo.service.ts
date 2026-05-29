import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emprestimo } from '../models/emprestimo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmprestimoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/emprestimos';

  private readonly emprestimos = signal<Emprestimo[]>([]);
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);

  listar(): Signal<Emprestimo[]> {
    return this.emprestimos.asReadonly();
  }

  estaCarregando(): Signal<boolean> {
    return this.carregando.asReadonly();
  }

  mensagemErro(): Signal<string | null> {
    return this.erro.asReadonly();
  }

  private obterHeaders() {
    const token = localStorage.getItem('token');

    return {
      Authorization: `Bearer ${token}`
    };
  }

  carregarMeusEmprestimos(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.get<Emprestimo[]>(`${this.apiUrl}/meus`, {
      headers: this.obterHeaders()
    }).subscribe({
      next: (dados) => {
        this.emprestimos.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar seus empréstimos.');
        this.carregando.set(false);
      }
    });
  }

  emprestarLivro(livroId: number): Observable<Emprestimo> {
    return this.http.post<Emprestimo>(
      `${this.apiUrl}/emprestar/${livroId}`,
      {},
      {
        headers: this.obterHeaders()
      }
    );
  }

  devolverLivro(emprestimoId: number) {
    return this.http.post(
      `${this.apiUrl}/devolver/${emprestimoId}`,
      {},
      {
        headers: this.obterHeaders()
      }
    );
  }
}