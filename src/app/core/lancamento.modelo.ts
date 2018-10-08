import { CategoriaModelo } from './categoriaModelo';
import { PessoaModelo } from './pessoa.modelo';

export class LancamentoModelo {
  codigo: number;
  descricao: string;
  tipo = 'RECEITA';
  dataVencimento: Date;
  dataPagamento: Date;
  valor: number;
  observacao: string;
  pessoa = new PessoaModelo();
  categoria = new CategoriaModelo();
}
