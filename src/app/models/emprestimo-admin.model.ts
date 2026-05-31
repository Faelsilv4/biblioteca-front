import { Livro } from './livro.model';
import { Usuario } from './usuario.model';

export interface EmprestimoAdmin {
  id: number;
  dataEmprestimo: string;
  dataDevolucao: string | null;
  usuario: Usuario;
  livro: Livro;
}