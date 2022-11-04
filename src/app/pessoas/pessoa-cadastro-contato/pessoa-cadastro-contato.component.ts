import { Component, OnInit, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';

import { ContatoModelo } from '../../core/contatoModelo';


@Component({
  selector: 'app-pessoa-cadastro-contato',
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrls: ['./pessoa-cadastro-contato.component.css']
})
export class PessoaCadastroContatoComponent implements OnInit {

  @Input()
  public contatos: Array<ContatoModelo> = [];
  public contato?: ContatoModelo;
  public contatoIndex?: number;
  public exibindoFormularioContato = false;

  constructor() { }

  ngOnInit(): void {
  }

  public prepararEdicaoContato(contato: ContatoModelo, index: number) {
    this.contato = this.clonarContato(contato);
    this.exibindoFormularioContato = true;
    this.contatoIndex = index;
  }

  public preparaNovoContato() {
    this.exibindoFormularioContato = true;
    this.contato = new ContatoModelo();
    this.contatoIndex = this.contatos.length;
  }

  public ConfirmarContato(frm: NgForm) {
    this.contatos[this.contatoIndex!] = this.clonarContato(this.contato!);
    this.exibindoFormularioContato = false;
    frm.reset();
  }

  public removerContato(index: number) {
    this.contatos.splice(index, 1);
  }

  private clonarContato(contato: ContatoModelo): ContatoModelo {
    return new ContatoModelo(contato.codigo, contato.nome, contato.email, contato.telefone);
  }

  get editando() {
    return this.contato && this.contato.codigo;
  }

}
