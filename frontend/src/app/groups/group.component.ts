import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import IResponse from '../types/response.inteface';
import { AddMemberDialogComponent } from './add-member-dialog.component';
import { AddTransactionDialogComponent } from './add-transaction-dialog.component';
import { GroupsService } from './services/groups.service';
import IFullGroup from './types/full-group.inteface';
import IMember from './types/member.interface';
import ITransaction from './types/transaction.interface';

@Component({
  selector: 'app-group',
  template: `
    <div class="fixed full-width" *ngIf="isLoading">
      <mat-progress-bar mode="indeterminate" />
    </div>
    <div class="screen-margin flex column">
      <div class="flex align-center">
        <mat-icon class="m-2" (click)="router.navigate(['../'])"
          >arrow_backward</mat-icon
        >
        <h2 class="remove-margin">{{ group.title | titlecase }}</h2>
        <!-- <button mat-raised-button color="primary">Split Bill</button> -->
      </div>
      <mat-divider />
      <div class="mt-2">
        <div class="flex justify-between">
          <h3>Members - {{ group.members.length }}</h3>
          <button
            mat-fab
            color="basic"
            title="Add Member"
            (click)="openAddMemberDialog()"
          >
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </div>

      <div class="mt-2">
        <div class="gap-4 grid mt-2" *ngIf="group.members.length">
          <mat-card
            class="align-center card-container"
            *ngFor="let member of group.members"
          >
            <mat-card *ngIf="member.pending" class="badge">Pending</mat-card>
            <mat-icon
              aria-hidden="false"
              class="icon"
              style="font-size: 30px;"
              fontIcon="person"
            ></mat-icon>
            <mat-card-content>{{ member.fullname }}</mat-card-content>
            <mat-card-content>{{ member.email }}</mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="mt-4">
        <div class="flex justify-between">
          <h3>Transactions</h3>
          <button
            mat-fab
            color="basic"
            title="Add Transaction"
            (click)="openAddTransactionDialog()"
          >
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </div>
      <div class="mt-2">
        <table
          *ngIf="group.transactions.length; else test"
          mat-table
          [dataSource]="group.transactions"
          class="mat-elevation-z8"
        >
          <ng-container matColumnDef="number">
            <th mat-header-cell *matHeaderCellDef>No.</th>
            <td mat-cell *matCellDef="let element; index as i">
              {{ i | plusOne }}
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element">{{ element.fullname }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let element">{{ element.email }}</td>
          </ng-container>

          <ng-container matColumnDef="pending">
            <th mat-header-cell *matHeaderCellDef>Pending</th>
            <td mat-cell *matCellDef="let element">{{ element.pending }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
      <ng-template #test>
        <div *ngIf="!isLoading">
          <h1 class="text-center">No Transactions Yet</h1>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background: #673ab7;
        color: #fff;
        padding: 5px;
      }
      .icon {
        font-size: 82px !important;
        width: 76px !important;
        height: 82px !important;
      }
      .card-container {
        position: relative;
      }
    `,
  ],
})
export class GroupComponent {
  //TODO: transaction interface and transaction grid

  private groups = inject(GroupsService);
  private activeRoute = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  router = inject(Router);
  displayedColumns: string[] = ['number', 'name', 'email', 'pending'];

  isLoading = false;

  group: IFullGroup = {
    _id: '',
    title: '',
    members: <IMember[]>[],
    transactions: <ITransaction[]>[],
  };

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {
    this.isLoading = true;
    this.groups
      .getGroupById(
        this.activeRoute.snapshot.paramMap.get('group_id') as string
      )
      .pipe(
        catchError((e) => {
          this.isLoading = false;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res: IResponse<IFullGroup>) => {
        console.log(res);
        this.group = res.data;
        this.isLoading = false;
      });
  }

  openAddMemberDialog() {
    const dialogRef = this.dialog.open(AddMemberDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getMembers();
      }
    });
  }

  openAddTransactionDialog() {
    const dialogRef = this.dialog.open(AddTransactionDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getMembers();
      }
    });
  }
}
