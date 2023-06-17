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
        <div class="flex justify-between align-center">
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

      <div class="mt-4">
        <div class="flex justify-between align-center">
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
        <div
          class="gap-4 transaction-grid mt-2"
          *ngIf="group.transactions.length; else emptyTransactions"
        >
          <app-transaction-card
            *ngFor="let item of group.transactions"
            [transaction]="item"
          />
        </div>
      </div>
      <div class="mt-4 mb-2">
        <div class="flex">
          <h3 class="flex align-center">
            Split balance report

            <mat-icon class="ml-2" (click)="isSplitOpen = !isSplitOpen">{{
              isSplitOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
            }}</mat-icon>
          </h3>
        </div>
        <div *ngIf="isSplitOpen">
          <mat-list
            role="list"
            *ngIf="group.transactions.length; else emptyTransactions"
          >
            <mat-list-item role="listitem" *ngFor="let member of group.members">
              {{ member.fullname }} spent
              <strong>{{
                member | memberSpent : group | currency : 'USD'
              }}</strong>
              in total => owes
              <strong balanceColor [balance]="member | memberBalance : group">{{
                member | memberBalance : group | currency : 'USD'
              }}</strong>
            </mat-list-item>
          </mat-list>
        </div>
      </div>
      <ng-template #emptyTransactions>
        <div *ngIf="!isLoading">
          <h1 class="text-center">No transactions yet!</h1>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .transaction-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    `,
  ],
})
export class GroupComponent implements OnInit {
  //TODO: transaction interface and transaction grid

  private groups = inject(GroupsService);
  private activeRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  router = inject(Router);
  isTransactionsOpen = false;
  isSplitOpen = false;
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

  calcMemberBalance(member: IMember) {
    let sum = 0;
    let paid = 0;
    this.group.transactions.forEach((t) => {
      sum += t.amount;
      if (t.paid_by.user_id === member._id) {
        paid += t.amount;
      }
    });

    return paid - sum / this.group.members.length;
  }

  ngOnInit() {
    this.groupId = this.activeRoute.snapshot.paramMap.get('group_id') as string;
    this.getMembers();
  }
}
