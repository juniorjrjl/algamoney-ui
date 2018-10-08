import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router) { }

  ngOnInit() {
  }

  public login(usuario: string, senha: string) {
    this.authService.login(usuario, senha)
    .then(() => {
      this.router.navigate(['/lancamentos']);
    })
    .catch(error => {
      this.errorHandlerService.handler(error);
    });
  }

}
