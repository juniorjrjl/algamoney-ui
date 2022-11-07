import { environment } from './../../environments/environment';
import { AuthGuard } from './auth.guard';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { SegurancaRoutingModule } from './seguranca-routing.module';
import { MoneyHttpInterceptor } from './money-http-interceptors';
import { AuthorizedComponent } from './authorized/authorized.component';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.tokenAllowedDomains,
        disallowedRoutes: environment.tokenDisallowedRoutes
      }
    }),

    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule
  ],
  providers: [
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MoneyHttpInterceptor,
      multi: true
    },
    AuthGuard
  ],
  declarations: [
    AuthorizedComponent
  ]
})
export class SegurancaModule { }
