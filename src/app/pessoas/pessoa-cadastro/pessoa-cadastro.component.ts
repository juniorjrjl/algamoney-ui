import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api'; 

import { PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { PessoaModelo } from '../../core/pessoa.modelo';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new PessoaModelo();
  estados: any[] = [];
  estadoSelecionado?: number;
  cidades: any[] = [];

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
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
    this.carregarEstados();
  }

  carregarCidades() {
    this.pessoaService.pesquisarCidades(this.estadoSelecionado!)
      .then(cidades => {
          this.cidades = cidades!.map(c => ({label: c.nome, value: c.codigo}));
        })
      .catch(erro => this.errorHandler.handler(erro));
  }

  carregarEstados() {
    this.pessoaService.listarEstados()
      .then(estados => {
          this.estados = estados!.map(uf => ({label: uf.nome, value: uf.codigo}));
        })
      .catch(erro => this.errorHandler.handler(erro));
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo)
      .then(pessoa => {
        this.pessoa = pessoa!;
        this.estadoSelecionado = (this.pessoa.endereco.cidade) ? this.pessoa.endereco.cidade.estado.codigo  : undefined;
        if (this.estadoSelecionado) {
          this.carregarCidades()
        }
        this.tituloAtualizacao();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  salvar(form: NgForm) {
    if (this.pessoa.codigo) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: NgForm) {
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoaAdicionada => {
        this.messageService.add({severity: 'success', detail: 'Pessoa adicionada com sucesso!'});
        this.router.navigate(['/pessoas', pessoaAdicionada!.codigo]);
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  atualizarPessoa(form: NgForm) {
    this.pessoaService.atualizar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa!;

        this.messageService.add({severity: 'success', detail: 'Pessoa alterada com sucesso!'});
        this.tituloAtualizacao();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  novo(form: NgForm) {
    form.reset();

    setTimeout(() => {
      this.pessoa = new PessoaModelo();
    }, 1);

    this.router.navigate(['/pessoas/nova']);
  }

  private tituloAtualizacao() {
    this.title.setTitle(`Edição de Pessoa: ${this.pessoa.nome}`);
  }

}
