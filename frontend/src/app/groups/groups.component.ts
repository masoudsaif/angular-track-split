import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GroupsService } from './services/groups.service';
import { catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupDialogComponent } from './add-group-dialog.component';

@Component({
  selector: 'app-groups',
  template: `
    <div class="relative">
      <mat-progress-bar mode="indeterminate" class="fixed" *ngIf="isLoading" />
      <div class="screen-margin flex column">
        <div class="flex justify-end">
          <button mat-fab color="basic" (click)="openDialog()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <div
          class="screen-margin gap-4 grid mt-2"
          *ngIf="groupsService.groups().length; else empty"
        >
          <app-group-card
            *ngFor="let group of groupsService.groups()"
            [group]="group"
          />
        </div>
      </div>
    </div>
    <ng-template #empty>
      <div *ngIf="!isLoading">
        <h1 class="text-center">You are not in any group yet!</h1>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }
    `,
  ],
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
      });
  }

  openDialog() {
    this.dialog.open(AddGroupDialogComponent);
  }
}
