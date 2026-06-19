import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Aluno } from '../models/aluno.model';

interface AtualizarAlunoRequest {
  nome: string;
  email: string;
  matricula: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/admin/alunos';

  listar(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.apiUrl);
  }

  atualizar(id: number, dados: AtualizarAlunoRequest): Observable<Aluno> {
    return this.http.put<Aluno>(
      `${this.apiUrl}/${id}`,
      dados
    );
  }

  ativar(id: number): Observable<Aluno> {
    return this.http.put<Aluno>(
      `${this.apiUrl}/${id}/ativar`,
      {}
    );
  }

  desativar(id: number): Observable<Aluno> {
    return this.http.put<Aluno>(
      `${this.apiUrl}/${id}/desativar`,
      {}
    );
  }
}