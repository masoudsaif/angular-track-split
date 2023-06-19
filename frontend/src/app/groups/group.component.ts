import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import IResponse from '../types/response.inteface';
import { AddMemberDialogComponent } from './add-member-dialog.component';
import { AddTransactionDialogComponent } from './add-transaction-dialog.component';
import { FilterDialogComponent } from './filter-dialog.component';
import { GroupsService } from './services/groups.service';
import IFullGroup from './types/full-group.inteface';
import IMember from './types/member.interface';
import ITransaction from './types/transaction.interface';
import IFilterDialog from './types/filter-dialog.inteface';
import IFilter from './types/filter.interface';
import { Title } from '@angular/platform-browser';

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
          class="flex align-center justify-between mt-2 mb-3 wrap"
          *ngIf="group.transactions.length"
        >
          <div class="search-container">
            <input
              type="text"
              name="search"
              placeholder="Search by title"
              class="search-input"
              (keyup)="handleSearchChange($event)"
            />
            <mat-icon>search</mat-icon>
          </div>
          <mat-icon class="m-3" (click)="openFilterDialog()"
            >filter_list</mat-icon
          >
        </div>

        <div *ngIf="group.transactions.length; else emptyTransactions">
          <div
            class="gap-4 transaction-grid mt-2"
            *ngIf="filteredTransactions().length; else emptyResults"
          >
            <app-transaction-card
              *ngFor="let item of filteredTransactions()"
              [transaction]="item"
            />
          </div>
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
          <div
            class="flex column"
            *ngIf="group.transactions.length; else emptyTransactions"
          >
            <label *ngFor="let member of group.members" class="p-1 pb-2">
              {{ member.fullname }} spent
              <strong>{{
                member | memberSpent : group | currency : 'USD'
              }}</strong>
              in total => owes
              <strong balanceColor [balance]="member | memberBalance : group">{{
                member | memberBalance : group | currency : 'USD'
              }}</strong>
            </label>
          </div>
        </div>
      </div>
      <ng-template #emptyTransactions>
        <div *ngIf="!isLoading">
          <h1 class="text-center">No transactions yet!</h1>
        </div>
      </ng-template>
      <ng-template #emptyResults>
        <div>
          <h1 class="text-center">No results!</h1>
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

      .search-container {
        background: transparent;
        border-radius: 30px;
        padding: 4px 8px 4px 8px;
        display: flex;
        align-items: center;
        cursor: pointer;
        border: 1px solid #000;
        width: 200px;
        transition: border-color 500ms, width 250ms;
      }

      .search-input {
        background: transparent;
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
      }

      .mat-icon {
        transition: color 500ms;
      }

      .search-container:hover,
      .search-container:focus-within {
        border-color: #673ab7;
        width: 240px;
      }

      .search-container:hover > .mat-icon,
      .search-container:focus-within > .mat-icon {
        color: #673ab7;
      }
    `,
  ],
})
export class GroupComponent implements OnInit {
  //TODO: transaction interface and transaction grid

  private groups = inject(GroupsService);
  private activeRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private title = inject(Title);
  router = inject(Router);
  filters = signal<IFilter>({
    category: '',
    paidBy: 'all',
    fromDate: '',
    toDate: '',
  });
  search = signal('');
  filteredTransactions = signal<ITransaction[]>([]);
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

  constructor() {
    this.title.setTitle('Group');
  }

  getData() {
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
        this.title.setTitle(`Group - ${res.data.title}`);
        this.filteredTransactions.set(res.data.transactions);
        this.isLoading = false;
      });
  }

  openAddMemberDialog() {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: this.groupId,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  openAddTransactionDialog() {
    const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
      data: this.groupId,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getData();
      }
    });
  }

  openFilterDialog() {
    const data: IFilterDialog = {
      members: this.group.members,
      transactions: this.group.transactions,
      filteredTransactions: this.filteredTransactions,
      filters: this.filters,
      search: this.search,
    };
    this.dialog.open(FilterDialogComponent, {
      width: '250px',
      height: '100%',
      position: { left: '0', top: '0' },
      data,
    });
  }

  handleSearchChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.search.set(target.value);
    const temp = [...this.group.transactions];
    this.filteredTransactions.set(
      temp.filter(({ title }) =>
        title.toLowerCase().includes(target.value.toLowerCase())
      )
    );
  }

  ngOnInit() {
    this.groupId = this.activeRoute.snapshot.paramMap.get('group_id') as string;
    this.getData();
  }
}
