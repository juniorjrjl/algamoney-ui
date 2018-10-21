import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LancamentoModelo } from '../../core/lancamento.modelo';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { MessageService} from 'primeng/components/common/messageservice';
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
  formulario: FormGroup;
  uploadEmAndamento = false;

   get editando() {
     return Boolean(this.formulario.get('codigo').value);
   }

  constructor(
    private categoriaService: CategoriaService,
    private errorHandlerService: ErrorHandlerService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.configurarFormulario();
    const codigoLancamento = this.activatedRoute.snapshot.params['codigo'];

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
      this.tituloAtualizacao();
    } else {
      this.title.setTitle('Novo Lançamento');
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  public antesUploadAnexo(event) {
    event.xhr.setrequesHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.uploadEmAndamento = true;
  }

  public aoTerminarUploadAnexo(event) {
    const anexo = JSON.parse(event.xhr.response);
    this.formulario.patchValue(
      {
        anexo: anexo.nome,
        urlAnexo: anexo.url
      });
      this.uploadEmAndamento = false;
  }

  public erroUpload(event) {
    this.messageService.add({severity: 'error', detail: 'Erro ao tentar enviar o anexo'});
    this.uploadEmAndamento = false;
  }

  public removerAnexo() {
    this.formulario.patchValue({anexo: null, urlAnexo: null})
  }

  get nomeAnexo() {
    const nome = this.formulario.get('anexo').value;
    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }
    return '';
  }

  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [null, [this.validarObrigatoriedade, Validators.minLength(5)]],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : {obrigatoriedade: true});
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ?
        null :
        {
          tamanhoMinimo:
            {
              tamanhoEsperado: valor,
              tamanhoAtual: input.value.length
            }
        };
    };
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento =>   {
        this.formulario.patchValue(lancamento);
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

  salvar() {
    if (this.editando) {
      this.atualizar();
    } else {
      this.adicionar();
    }
  }

  adicionar() {
    this.lancamentoService.adicionar(this.formulario.value)
      .then(lancamento => {
        this.messageService.add({severity: 'success' , detail: 'Lançamento adicionado com sucesso!'});
        this.router.navigate(['/lancamentos', lancamento.codigo]);
      })
      .catch(erro => this.errorHandlerService.handler(erro));
  }

  atualizar() {
    this.lancamentoService.atualizar(this.formulario.value)
    .then(lancamento => {
      this.formulario.setValue(lancamento);
      this.tituloAtualizacao();
      this.messageService.add({severity: 'success' , detail: 'Lançamento alterado com sucesso!'});
    })
    .catch(erro => {console.log(erro); this.errorHandlerService.handler(erro); });
  }

  novo() {
    this.formulario.reset();

    setTimeout(function() {
      this.lancamento = new LancamentoModelo();
    }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }

  private tituloAtualizacao() {
    this.title.setTitle(`edição de Lançamento: ${this.formulario.get('descricao').value}`);
  }

}
