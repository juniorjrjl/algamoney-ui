import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { LancamentoModelo } from './../../core/lancamentoModelo';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from '../../pessoas/pessoa.service';
import { ToastyService } from 'ng2-toasty';
import { LancamentoService } from './../lancamento.service';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [{label: 'Receita', value : 'RECEITA'}, {label: 'Despesa', value : 'DESPESA'}];

  categorias = [];

   pessoas = [];

   lancamento = new LancamentoModelo();

  constructor(
    private categoriaService: CategoriaService,
    private errorHandlerService: ErrorHandlerService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private toastyService: ToastyService) { }

  ngOnInit() {
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.categoriaService.listarTodas()
    .then(categorias => {
      this.categorias = categorias.map(c =>  ({label: c.nome, value: c.codigo}) );
    })
    .catch(erro => this.errorHandlerService.handler(erro));
  }

  carregarPessoas() {
    this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas
          .map(p => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandlerService.handler(erro));
  }

  salvar(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(() => {
        this.toastyService.success('Lançamento adicionado com sucesso!');
        form.reset();
        this.lancamento = new LancamentoModelo();
      })
      .catch(erro => this.errorHandlerService.handler(erro));
  }

}
