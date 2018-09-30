import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { ToastyService } from 'ng2-toasty';

@Injectable()
export class ErrorHandlerService {

  constructor(private toastyService: ToastyService) { }

  handler(erroResponse: any) {
    let msg: string;
    if (typeof erroResponse === 'string') {
      msg = erroResponse;

    }else if (erroResponse instanceof Response && erroResponse.status >= 400 && erroResponse.status <= 499) {
      let errors;
      msg = 'Ocorreu um erro ao processar a sua solicitação';

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
