import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService} from 'primeng/components/common/messageservice';
import { NotAuthenticatedError } from 'app/seguranca/money.http';

@Injectable()
export class ErrorHandlerService {

  constructor(
    private messageService: MessageService,
    private router: Router) { }

  handler(erroResponse: any) {
    let msg: string;
    if (typeof erroResponse === 'string') {
      msg = erroResponse;

    } else if (erroResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou.';
      this.router.navigate(['/login'])
    } else if (erroResponse instanceof HttpErrorResponse && erroResponse.status >= 400 && erroResponse.status <= 499) {
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (erroResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      try {
        msg = erroResponse.error[0].mensagemUsuario;
      } catch (e) { }

    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.'
    }
    this.messageService.add({severity: 'error', detail: msg});
  }

}
