import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService} from 'primeng/api';
import { AuthService } from '../seguranca/auth.service';
import { NotAuthenticatedError } from '../seguranca/money-http-interceptors'; 

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router) { }

  handler(erroResponse: any) {
    let msg: string;
    if (typeof erroResponse === 'string') {
      msg = erroResponse;
    } else if (erroResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou.';
      this.authService.login()
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
