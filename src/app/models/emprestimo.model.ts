export interface Emprestimo {
  id: number;
  dataEmprestimo: string;
  dataDevolucao: string | null;
  nomeUsuario: string;
  nomeLivro: string;
  statusLivro: string;
}
