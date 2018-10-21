import { MoneyHttp } from './money.http';
import { environment } from 'environments/environment';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LogoutService {

  private tokensRenokeUrl: string;

  constructor(private http: MoneyHttp,
    private authService: AuthService) {
      this.tokensRenokeUrl = `${environment.apiUrl}/tokens/revoke`;
     }

    logout() {
      return this.http.delete(this.tokensRenokeUrl, {withCredentials: true})
        .toPromise()
        .then(() => {
          this.authService.limparAccessToken();
        });
    }

}
