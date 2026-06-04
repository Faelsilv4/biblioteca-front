import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Navbar } from '../../components/navbar/navbar';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface DashboardResponse {
  totalLivros: number;
  livrosDisponiveis: number;
  livrosEmprestados: number;
  totalEmprestimos: number;

  totalAlunos: number;
  alunosAtivos: number;
  alunosInativos: number;

  totalBibliotecarios: number;
  bibliotecariosAtivos: number;
  bibliotecariosInativos: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    Navbar,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly http = inject(HttpClient);

  dashboard = signal<DashboardResponse>({
    totalLivros: 0,
    livrosDisponiveis: 0,
    livrosEmprestados: 0,
    totalEmprestimos: 0,

    totalAlunos: 0,
    alunosAtivos: 0,
    alunosInativos: 0,

    totalBibliotecarios: 0,
    bibliotecariosAtivos: 0,
    bibliotecariosInativos: 0
  });

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.http.get<DashboardResponse>(
      'http://localhost:8080/api/dashboard'
    ).subscribe({
      next: (dados) => {
        this.dashboard.set(dados);
      },
      error: (erro) => {
        console.error(erro);
      }
    });
  }
}