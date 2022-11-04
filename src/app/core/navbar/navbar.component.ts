import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../error-handler.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu = false;
  usuarioLogado: string = '';

  constructor(
    public authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router) { }

  ngOnInit() {
    this.usuarioLogado = this.authService.jwtPayload?.nome;
  }

  novoAccessToken() {
    this.authService.obterNovoAccessToken();
  }

  logout() {
    this.authService.logout()
    .then(() => this.router.navigate(['/login']))
    .catch(error => this.errorHandlerService.handler(error));
  }

}
