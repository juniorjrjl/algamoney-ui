import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { ToastyService } from 'ng2-toasty';
import { NotAuthenticatedError } from 'app/seguranca/money.http';

@Injectable()
export class ErrorHandlerService {

  constructor(
    private toastyService: ToastyService,
    private router: Router) { }

  handler(erroResponse: any) {
    let msg: string;
    if (typeof erroResponse === 'string') {
      msg = erroResponse;

    }else if (erroResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou.';
      this.router.navigate(['/login'])
    }else if (erroResponse instanceof Response && erroResponse.status >= 400 && erroResponse.status <= 499) {
      let errors;
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (erroResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      try {
        errors = erroResponse.json();

        msg = errors[0].mensagemUsuario;
      } catch (e) { }

    }else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.'
    }
    this.toastyService.error(msg);
  }

}
