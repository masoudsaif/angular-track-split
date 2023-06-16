import { Component, inject } from '@angular/core';
import { GroupsService } from './services/groups.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import IFullGroup from './types/full-group.inteface';
import IResponse from '../types/response.inteface';
import IMember from './types/member.interface';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberDialogComponent } from './add-member-dialog.component';

@Component({
  selector: 'app-group',
  template: `
    <div class="relative">
      <mat-progress-bar mode="indeterminate" class="fixed" *ngIf="isLoading" />
      <div class="screen-margin flex column">
        <header class="flex justify-between">
          <h2>{{ group.title | titlecase }}</h2>
          <!-- <button mat-raised-button color="primary">Split Bill</button> -->
        </header>
      </div>
      <mat-divider></mat-divider>
      <div class="p-2">
        <div class="flex justify-between">
          <h3>Members</h3>
          <button mat-fab color="basic" (click)="openDialog()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class GroupComponent {
  private groups = inject(GroupsService);
  private activeRoute = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  isLoading = false;

  group: IFullGroup = {
    _id: '',
    title: 'florida Trip',
    members: [],
    transactions: [],
  };

  ngOnInit() {
    //until we fix the api
    this.groups
      .getGroupMembers(
        this.activeRoute.snapshot.paramMap.get('group_id') as string
      )
      .pipe(
        catchError((e) => {
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res: IResponse<IMember[]>) => {
        this.group.members = res.data;
      });
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        group_Id: this.activeRoute.snapshot.paramMap.get('group_id') as string,
      },
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      this.group.members.push()
    });
  }
}
