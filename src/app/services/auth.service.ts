import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login.model';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  tipoUsuario: string;
  email: string;
  nome: string;
}

interface RegistroAlunoRequest {
  nome: string;
  email: string;
  senha: string;
  matricula: number;
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
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  login(dados: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dados)
      .pipe(
        tap((resposta) => {
          localStorage.setItem('token', resposta.token);
          localStorage.setItem('tipoUsuario', resposta.tipoUsuario);
          localStorage.setItem('email', resposta.email);
          localStorage.setItem('nome', resposta.nome);
        })
      );
  }

  cadastrarAluno(dados: RegistroAlunoRequest): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(
      `${this.apiUrl}/register/aluno`,
      dados
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('email');
    localStorage.removeItem('nome');
  }

  estaLogado(): boolean {
    return !!localStorage.getItem('token');
  }

  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  obterNomeUsuario(): string | null {
    return localStorage.getItem('nome');
  }

  obterTipoUsuario(): string | null {
    return localStorage.getItem('tipoUsuario');
  }
}