import { Component, OnChanges, OnDestroy, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription, catchError, throwError } from 'rxjs';
import ISignIn from './types/sign-in.interface';
import jwtDecode from 'jwt-decode';
import IUser from './types/user.interface';
import { Router } from '@angular/router';
import { TOKEN_KEY, USER_KEY } from './constants/keys';

@Component({
  selector: 'app-sign-in',
  template: `
    <div class="flex justify-center screen-margin">
      <mat-card class="form-container">
        <mat-card-content>
          <form
            class="flex column"
            [formGroup]="form"
            (ngSubmit)="handleSubmit()"
          >
            <mat-form-field class="mb-1">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="Ex. pat@example.com"
              />
              <mat-error
                *ngIf="email.errors?.['email'] && !email.errors?.['required']"
              >
                Please enter a valid <strong>email address</strong>
              </mat-error>
              <mat-error *ngIf="email.errors?.['required']">
                Email is <strong>required</strong>
              </mat-error>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" />
              {{ form.errors }}
              <mat-error
                *ngIf="password.errors?.['minlength'] && !password.errors?.['required']"
              >
                The minimum length for the password is <strong>6</strong>
              </mat-error>
              <mat-error *ngIf="password.errors?.['required']">
                Password is <strong>required</strong>
              </mat-error>
            </mat-form-field>
            <mat-checkbox color="primary" formControlName="isRemember"
              >Remember me</mat-checkbox
            >
            <mat-error *ngIf="error">
              {{ error }}
            </mat-error>
          </form>
        </mat-card-content>
        <mat-card-actions class="flex justify-end">
          <button
            [disabled]="form.invalid"
            mat-raised-button
            color="primary"
            type="submit"
            (click)="handleSubmit()"
          >
            Sign in
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [``],
})
export class SignInComponent implements OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    isRemember: false,
  });
  isLoading = false;
  error = '';
  signIn$: Subscription | null = null;

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  handleSubmit() {
    const { isRemember, ...values } = this.form.value;
    this.signIn$?.unsubscribe();
    this.error = '';
    this.isLoading = true;
    this.signIn$ = this.authService
      .signIn(values as ISignIn)
      .pipe(
        catchError((e) => {
          this.error = 'Invalid credentials!';
          console.log(e);
          this.isLoading = false;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        if (res.success) {
          const user = jwtDecode(res.data) as IUser;
          this.authService.token.set(res.data);
          this.authService.user.set(user);
          this.isLoading = false;
          if (isRemember) {
            localStorage.setItem(TOKEN_KEY, res.data);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
          }
          this.router.navigate(['']);
        }
        console.log(res);
      });
  }

  ngOnDestroy() {
    this.signIn$?.unsubscribe();
  }
}
