import { EnderecoModelo } from './enderecoModelo';
import { ContatoModelo } from './contatoModelo';

export class PessoaModelo {
  codigo?: number;
  nome?: string;
  endereco = new EnderecoModelo();
  ativo = true;
  contatos = new Array<ContatoModelo>();
}
