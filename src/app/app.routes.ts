import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { CadastroAluno } from './pages/cadastro-aluno/cadastro-aluno';
import { Livros } from './pages/livros/livros';
import { MeusEmprestimos } from './pages/meus-emprestimos/meus-emprestimos';
import { Perfil } from './pages/perfil/perfil';
import { GerenciarLivros } from './pages/gerenciar-livros/gerenciar-livros';
import { GerenciarEmprestimos } from './pages/gerenciar-emprestimos/gerenciar-emprestimos';
import { CadastroBibliotecario } from './pages/cadastro-bibliotecario/cadastro-bibliotecario';
import { Dashboard } from './pages/dashboard/dashboard';
import { GerenciarBibliotecarios } from './pages/gerenciar-bibliotecarios/gerenciar-bibliotecarios';

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
        path: 'gerenciar-livros',
        component: GerenciarLivros,
        canActivate: [authGuard]
    },
    {
        path: 'gerenciar-emprestimos',
        component: GerenciarEmprestimos,
        canActivate: [authGuard]
    },
    {
        path: 'cadastro-bibliotecario',
        component: CadastroBibliotecario
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
    path: 'gerenciar-bibliotecarios',
    component: GerenciarBibliotecarios,
    canActivate: [authGuard]
},
    {
        path: '**',
        redirectTo: ''
    }
];