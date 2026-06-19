import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emprestimo } from '../models/emprestimo.model';
import { Observable } from 'rxjs';

import { EmprestimoAdmin } from '../models/emprestimo-admin.model';


@Injectable({
  providedIn: 'root',
})
export class EmprestimoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/emprestimos';

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

  carregarMeusEmprestimos(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.get<Emprestimo[]>(`${this.apiUrl}/meus`)
      .subscribe({
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
      {}
    );
  }

  devolverLivro(emprestimoId: number) {
    return this.http.post(
      `${this.apiUrl}/devolver/${emprestimoId}`,
      {}
    );
  }
  listarTodosEmprestimos(): Observable<EmprestimoAdmin[]> {
    return this.http.get<EmprestimoAdmin[]>(
      `${this.apiUrl}/todos`
    );
  }
}