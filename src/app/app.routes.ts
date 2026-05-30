import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { CadastroAluno } from './pages/cadastro-aluno/cadastro-aluno';
import { Livros } from './pages/livros/livros';
import { MeusEmprestimos } from './pages/meus-emprestimos/meus-emprestimos';
import { Perfil } from './pages/perfil/perfil';

import { authGuard } from './guards/auth-guard';    

export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'cadastro-aluno',
    component: CadastroAluno
  },
  {
    path: 'livros',
    component: Livros,
    canActivate: [authGuard]

  },
  {
    path: 'meus-emprestimos',
    component: MeusEmprestimos,
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];