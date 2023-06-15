import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';

import IResponse from './types/response.inteface';
import ISignIn from './types/sign-in.interface';
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
    return this.http.post<IResponse<string>>(
      environment.SERVER_URL + 'signin',
      data
    );
  }

  signUp(data: ISignUp) {
    return this.http.post<IResponse<ISignUp>>(
      environment.SERVER_URL + 'signin',
      data
    );
  }

  signOut() {
    localStorage.clear();
    this.token.set('');
    this.user.set(null);
  }
}
