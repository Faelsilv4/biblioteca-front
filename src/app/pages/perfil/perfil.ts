import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-perfil',
  imports: [
    Navbar,
    MatCardModule
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {

  nome = '';
  email = '';
  tipoUsuario = '';

  ngOnInit(): void {
    this.nome = localStorage.getItem('nome') || '';
    this.email = localStorage.getItem('email') || '';
    this.tipoUsuario = localStorage.getItem('tipoUsuario') || '';
  }
}