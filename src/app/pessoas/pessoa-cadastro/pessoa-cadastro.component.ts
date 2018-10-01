import { PessoaModelo } from './../../core/pessoaModelo';
import { Component, OnInit } from '@angular/core';

import { PessoaService } from '../pessoa.service';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new PessoaModelo();

  constructor(
    private pessoaService: PessoaService,
    private toastyService: ToastyService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
  }

  salvar(form: FormControl) {
    this.pessoaService.adicionar(this.pessoa)
      .then(() => {
        this.toastyService.success('Pessoa adicionada com sucesso!');

        form.reset();
        this.pessoa = new PessoaModelo();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

}
