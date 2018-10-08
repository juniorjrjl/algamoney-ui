import { EnderecoModelo } from './enderecoModelo';

export class PessoaModelo {
  codigo: number;
  nome: string;
  endereco = new EnderecoModelo();
  ativo = true;
}
