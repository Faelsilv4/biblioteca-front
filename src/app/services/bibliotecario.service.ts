import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Bibliotecario } from '../models/bibliotecario.model';

interface RegistroBibliotecarioRequest {
  nome: string;
  email: string;
  senha: string;
  anoDeContratacao: string;
}

interface AtualizarBibliotecarioRequest {
  nome: string;
  email: string;
  anoDeContratacao: string;
}

interface RegistroResponse {
  id: number;
  nome: string;
  email: string;
  mensagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class BibliotecarioService {
  private readonly http = inject(HttpClient);
  private readonly apiAdmin = 'http://localhost:8080/api/admin/bibliotecarios';

  cadastrar(dados: RegistroBibliotecarioRequest): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(
      this.apiAdmin,
      dados
    );
  }

  atualizar(id: number, dados: AtualizarBibliotecarioRequest): Observable<Bibliotecario> {
    return this.http.put<Bibliotecario>(
      `${this.apiAdmin}/${id}`,
      dados
    );
  }

  listar(): Observable<Bibliotecario[]> {
    return this.http.get<Bibliotecario[]>(this.apiAdmin);
  }

  ativar(id: number): Observable<Bibliotecario> {
    return this.http.put<Bibliotecario>(
      `${this.apiAdmin}/${id}/ativar`,
      {}
    );
  }

  desativar(id: number): Observable<Bibliotecario> {
    return this.http.put<Bibliotecario>(
      `${this.apiAdmin}/${id}/desativar`,
      {}
    );
  }
}