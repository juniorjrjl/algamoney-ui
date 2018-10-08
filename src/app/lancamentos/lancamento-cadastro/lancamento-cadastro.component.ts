import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LancamentoModelo } from '../../core/lancamento.modelo';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { ToastyService } from 'ng2-toasty';
import { LancamentoService } from './../lancamento.service';
import { stringify } from 'querystring';

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

   get editando(){
     return Boolean(this.lancamento.codigo);
   }

  constructor(
    private categoriaService: CategoriaService,
    private errorHandlerService: ErrorHandlerService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title) { }

  ngOnInit() {
    const codigoLancamento = this.activatedRoute.snapshot.params['codigo'];

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
      this.tituloAtualizacao();
    }else {
      this.title.setTitle('Novo Lançamento');
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento =>   {
        this.lancamento = lancamento;
      })
      .catch(erro => this.errorHandlerService.handler(erro));
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
    if (this.editando) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(lancamento => {
        this.toastyService.success('Lançamento adicionado com sucesso!');
        this.router.navigate(['/lancamentos', lancamento.codigo]);
      })
      .catch(erro => this.errorHandlerService.handler(erro));
  }

  atualizar(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
    .then(lancamento => {
      this.lancamento = lancamento;
      this.tituloAtualizacao();
      this.toastyService.success('Lançamento alterado com sucesso!');
    })
    .catch(erro => this.errorHandlerService.handler(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.lancamento = new LancamentoModelo();
    }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }

  private tituloAtualizacao() {
    this.title.setTitle(`edição de Lançamento: ${this.lancamento.descricao}`);
  }

}
