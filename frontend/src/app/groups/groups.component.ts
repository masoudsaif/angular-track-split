import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GroupsService } from './services/groups.service';
import { catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupDialogComponent } from './add-group-dialog.component';

@Component({
  selector: 'app-groups',
  template: `
    <div class="fixed full-width" *ngIf="isLoading">
      <mat-progress-bar mode="indeterminate" />
    </div>
    <div class="screen-margin flex column">
      <div class="flex justify-between align-center mb-2">
        <h2>Groups</h2>
        <button mat-fab color="basic" (click)="openDialog()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <mat-divider />
      <div
        class="gap-4 grid mt-2"
        *ngIf="groupsService.groups().length; else emptyGroups"
      >
        <app-group-card
          *ngFor="let group of groupsService.groups()"
          [group]="group"
        />
      </div>
    </div>
    <ng-template #emptyGroups>
      <div *ngIf="!isLoading" class="mt-2">
        <h1 class="text-center">You are not in any group yet!</h1>
      </div>
    </ng-template>
  `,
  styles: [],
})
export class GroupsComponent {
  dialog = inject(MatDialog);
  groupsService = inject(GroupsService);
  isLoading = false;

  constructor() {
    this.isLoading = true;
    this.groupsService
      .getGroups()
      .pipe(
        takeUntilDestroyed(),
        catchError(() => {
          this.isLoading = false;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        this.isLoading = false;
        this.groupsService.groups.set(res.data);
        this.groupsService
          .getGroups(true)
          .pipe(takeUntilDestroyed())
          .subscribe((res) => {
            if (res.success) {
              this.groupsService.requests.set(res.data);
            }
          });
      });
  }

  openDialog() {
    this.dialog.open(AddGroupDialogComponent);
  }
}
