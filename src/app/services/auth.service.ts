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

interface RegistroBibliotecarioRequest {
  nome: string;
  email: string;
  senha: string;
  anoDeContratacao: string;
}

interface RegistroResponse {
  id: number;
  nome: string;
  email: string;
  mensagem: string;
}

interface AtualizarNomeRequest {
  novoNome: string;
}

interface PerfilResponse {
  id: number;
  nome: string;
  email: string;
  role: string;
  matricula?: number;
  anoDeContratacao?: string;
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

  cadastrarBibliotecario(dados: RegistroBibliotecarioRequest): Observable<RegistroResponse> {
  return this.http.post<RegistroResponse>(
    `${this.apiUrl}/register/bibliotecario`,
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

  atualizarNome(dados: AtualizarNomeRequest): Observable<PerfilResponse> {
    return this.http.put<PerfilResponse>(
      'http://localhost:8080/api/perfil',
      dados
    ).pipe(
      tap((resposta) => {
        localStorage.setItem('nome', resposta.nome);
      })
    );
  }
}