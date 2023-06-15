import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';

import IResponse from './types/response.inteface';
import ISignIn from './types/sign-in.interface';
import ISignUpResponse from './types/sign-up-response.interface';
import ISignUp from './types/sign-up.interface';
import IUser from './types/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = signal('');
  user = signal<IUser | null>(null);

  private http = inject(HttpClient);

  signIn(data: ISignIn) {
    console.log(data);
    return this.http.post<IResponse<string>>(
      `${environment.SERVER_URL}users/signin`,
      data
    );
  }

  signUp(data: ISignUp) {
    return this.http.post<IResponse<ISignUpResponse>>(
      `${environment.SERVER_URL}users/signup`,
      data
    );
  }

  signOut() {
    localStorage.clear();
    this.token.set('');
    this.user.set(null);
  }
}
