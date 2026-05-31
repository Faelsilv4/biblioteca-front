import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  if (!token) {
    router.navigate(['/']);
    return false;
  }

  if (
    (state.url === '/gerenciar-livros' || state.url === '/gerenciar-emprestimos') &&
    tipoUsuario !== 'BIBLIOTECARIO'
  ) {
    router.navigate(['/livros']);
    return false;
  }

  return true;
};