import { environment } from 'environments/environment';
import { AuthService } from './auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';

@Injectable()
export class LogoutService {

  private tokensRenokeUrl: string;

  constructor(private authHttp: AuthHttp,
    private authService: AuthService) {
      this.tokensRenokeUrl = `${environment.apiUrl}/tokens/revoke`;
     }

    logout() {
      return this.authHttp.delete(this.tokensRenokeUrl, {withCredentials: true})
        .toPromise()
        .then(() => {
          this.authService.limparAccessToken();
        });
    }

}
