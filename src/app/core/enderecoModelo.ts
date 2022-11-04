import { CidadeModelo } from "./cidadeModelo";

export class EnderecoModelo {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  cidade = new CidadeModelo();
}
