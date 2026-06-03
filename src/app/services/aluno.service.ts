import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Aluno } from '../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/admin/alunos';

  listar(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.apiUrl);
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