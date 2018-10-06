import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private authService: AuthService) { }

  ngOnInit() {
  }

  public login(usuario: string, senha: string) {
    this.authService.login(usuario, senha);
  }

}
