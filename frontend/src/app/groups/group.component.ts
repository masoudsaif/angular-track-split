import { Component, inject, OnInit } from '@angular/core';
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
          <h3>Members ({{ group.members.length }})</h3>
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
          <app-member-card
            class="align-center card-container"
            *ngFor="let member of group.members"
            [member]="member"
          />
        </div>
      </div>

      <div class="mt-4 mb-2">
        <div class="flex justify-between">
          <h3 class="flex align-center">
            Transactions ({{ group.transactions.length }})

            <mat-icon
              class="ml-2"
              (click)="isTransactionsOpen = !isTransactionsOpen"
              >{{
                isTransactionsOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
              }}</mat-icon
            >
          </h3>
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
      <div *ngIf="isTransactionsOpen">
        <app-transaction-card
          *ngFor="let item of group.transactions"
          [transaction]="item"
        />
      </div>
      <ng-template #test>
        <div *ngIf="!isLoading">
          <h1 class="text-center">No transactions yet!</h1>
        </div>
      </ng-template>
    </div>
  `,
  styles: [],
})
export class GroupComponent implements OnInit {
  //TODO: transaction interface and transaction grid

  private groups = inject(GroupsService);
  private activeRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  router = inject(Router);
  isTransactionsOpen = false;
  groupId = '';
  displayedColumns: string[] = ['number', 'name', 'email', 'pending'];

  isLoading = false;

  group: IFullGroup = {
    _id: '',
    title: '',
    members: <IMember[]>[],
    transactions: <ITransaction[]>[],
  };

  getMembers() {
    this.isLoading = true;
    this.groups
      .getGroupById(this.groupId)
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
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: { groupId: this.groupId },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getMembers();
      }
    });
  }

  openAddTransactionDialog() {
    const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
      data: { groupId: this.groupId },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getMembers();
      }
    });
  }

  ngOnInit() {
    this.groupId = this.activeRoute.snapshot.paramMap.get('group_id') as string;
    this.getMembers();
  }
}
