import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';

import { AuthService } from './services/auth.service';
import { TOKEN_KEY, USER_KEY } from './constants/keys';
import ISignUp from './types/sign-up.interface';

@Component({
  selector: 'app-sign-up',
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
              <mat-label>Full name</mat-label>
              <input matInput type="text" formControlName="fullname" />
              <mat-error
                *ngIf="fullname.errors?.['minlength'] && !fullname.errors?.['required']"
              >
                Please enter a valid <strong>fullname</strong>
              </mat-error>
              <mat-error *ngIf="fullname.errors?.['required']">
                Full name is <strong>required</strong>
              </mat-error>
            </mat-form-field>
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
            <div class="flex justify-center">
              <mat-error *ngIf="error">
                {{ error }}
              </mat-error>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button
            [disabled]="form.invalid || isLoading"
            mat-raised-button
            color="primary"
            type="submit"
            (click)="handleSubmit()"
          >
            Sign up
            <mat-icon *ngIf="isLoading">
              <mat-spinner color="accent" diameter="18" />
            </mat-icon>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [],
})
export class SignUpComponent implements OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  form = inject(FormBuilder).nonNullable.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  isLoading = false;
  error = '';
  signUp$: Subscription | null = null;

  get fullname() {
    return this.form.controls.fullname;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  handleSubmit() {
    this.signUp$?.unsubscribe();
    this.error = '';
    this.isLoading = true;
    this.signUp$ = this.authService
      .signUp(this.form.value as ISignUp)
      .pipe(
        catchError((e) => {
          this.error = e.error.data;
          this.isLoading = false;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        this.authService.token.set(res.data.token);
        this.authService.user.set(res.data.user);
        this.isLoading = false;
        sessionStorage.setItem(TOKEN_KEY, res.data.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(res.data));
        this.router.navigate(['']);
      });
  }

  ngOnDestroy() {
    this.signUp$?.unsubscribe();
  }
}
