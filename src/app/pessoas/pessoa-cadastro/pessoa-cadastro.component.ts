import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

import { PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { PessoaModelo } from './../../core/pessoaModelo';

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
    private errorHandler: ErrorHandlerService,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    const codigoPessoa = this.activatedRoute.snapshot.params['codigo'];
    this.title.setTitle('Nova Pessoa');
    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    } else {
      this.tituloAtualizacao();
    }
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo)
      .then(pessoa => {
        this.pessoa = pessoa;
        this.tituloAtualizacao();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  adicionarPessoa(form: FormControl) {
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoaAdicionada => {
        this.toastyService.success('Pessoa adicionada com sucesso!');
        this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  atualizarPessoa(form: FormControl) {
    this.pessoaService.atualizar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.toastyService.success('Pessoa alterada com sucesso!');
        this.tituloAtualizacao();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  private tituloAtualizacao() {
    this.title.setTitle(`Edição de Pessoa: ${this.pessoa.nome}`);
  }

}
