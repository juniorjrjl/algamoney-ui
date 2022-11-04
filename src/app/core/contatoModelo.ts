
export class ContatoModelo {

  codigo?: number;
  nome?: string;
  email?: string;
  telefone?: string;

  constructor(codigo?: number, nome?: string, email?: string, telefone?: string) {
    this.codigo = codigo;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
  }

}
