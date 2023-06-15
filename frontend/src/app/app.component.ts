import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button aria-label="menu icon">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="one">Groups</span>
      <span></span>
      <div *ngIf="!authService.user(); else auth">
        <button mat-button class="m-2" [routerLink]="['', 'sign-in']">
          Sign in
        </button>
        <button mat-raised-button [routerLink]="['', 'sign-up']">
          Sign up
        </button>
      </div>
    </mat-toolbar>
    <ng-template #auth>
      <button mat-button class="m-2" (click)="authService.signOut()">
        Sign out
      </button>
    </ng-template>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  authService = inject(AuthService);
}
