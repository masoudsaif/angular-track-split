import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { GroupsService } from './groups/services/groups.service';

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
      <mat-icon
        [matBadge]="groupsService.requests().length"
        [matBadgeHidden]="groupsService.requests().length === 0"
        matBadgeColor="warn"
        [matMenuTriggerFor]="menu"
        >notifications</mat-icon
      >
      <button mat-button class="m-2" (click)="authService.signOut()">
        Sign out
      </button>
      <mat-menu #menu>
        <mat-progress-bar
          mode="indeterminate"
          class="fixed"
          *ngIf="isLoading"
        />
        <div *ngIf="groupsService.requests().length !== 0; else emptyRequests">
          <div
            *ngFor="
              let group of groupsService.requests();
              index as index;
              last as last
            "
          >
            <app-notification
              [group]="group"
              [index]="index"
              [isLoading]="isLoading"
            />
            <mat-divider *ngIf="!last" />
          </div>
        </div>
      </mat-menu>
      <ng-template #emptyRequests>
        <span class="p-2">You have no pending requests!</span>
      </ng-template>
    </ng-template>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      mat-progress-bar {
        top: -8px;
      }
    `,
  ],
})
export class AppComponent {
  groupsService = inject(GroupsService);
  authService = inject(AuthService);
  isLoading = false;
}
