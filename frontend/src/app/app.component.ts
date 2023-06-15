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
      <mat-icon matBadge="15" matBadgeColor="warn" [matMenuTriggerFor]="menu"
        >notifications</mat-icon
      >
      <button mat-button class="m-2" (click)="authService.signOut()">
        Sign out
      </button>
      <mat-menu #menu>
        <app-notification email="email@miu.edu" />
        <mat-divider />
        <app-notification email="email@miu.edu" />
        <mat-divider />
        <app-notification email="email@miu.edu" />
      </mat-menu>
    </ng-template>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  authService = inject(AuthService);
}
