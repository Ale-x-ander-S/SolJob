import { inject, Injectable } from '@angular/core';
import { SsrCookieService } from "ngx-cookie-service-ssr";
import { JOBSEEKER } from "../constans/user-type.constant";

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private readonly TOKEN_KEY = 'sol_job';
  private readonly ssrCookieService: SsrCookieService = inject(SsrCookieService);

  saveToken(token: string): void {
    this.ssrCookieService.set(this.TOKEN_KEY, token, 3, '/');
  }

  getToken(): string | undefined {
    return this.ssrCookieService.get(this.TOKEN_KEY);
  }

  removeToken(): void {
    this.ssrCookieService.delete(this.TOKEN_KEY, '/');
  }

  isTokenExist(): boolean {
    return this.ssrCookieService.check(this.TOKEN_KEY);
  }

  getTokenUserData(): {userId: number, userFirstName: string, userType: number} | undefined {
    const token = this.getToken();
    if (!token) {
      return undefined;
    }
    const decodedToken = JSON.parse(
      decodeURIComponent(
        atob(token.split('.')[1])
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );
    return {
      userId: +decodedToken.UserId,
      userFirstName: decodedToken.UserName,
      userType: +decodedToken.UserType
    };
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    const decodedToken = JSON.parse(
      decodeURIComponent(
        atob(token.split('.')[1])
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);
    const currentDate = new Date();

    return expirationDate < currentDate;
  }

  isUserJobseeker(): boolean {
    return this.getTokenUserData()?.userType === JOBSEEKER;
  }
}
