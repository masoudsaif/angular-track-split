import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import IFilterDialog from './types/filter-dialog.inteface';
import IFilter from './types/filter.interface';

@Component({
  selector: 'app-filter-dialog',
  template: `
    <form [formGroup]="form" class="flex column">
      <div class="mt-2 ml-2 flex justify-between">
        <h2>Filters</h2>
        <button
          mat-button
          color="warn"
          *ngIf="isResetVisible()"
          (click)="handleReset()"
        >
          Reset
        </button>
      </div>
      <mat-form-field class="mr-1 ml-1 mb-1">
        <mat-label>Category</mat-label>
        <input matInput type="text" formControlName="category" />
      </mat-form-field>
      <mat-form-field class="mr-1 ml-1">
        <mat-label>Paid by</mat-label>
        <mat-select formControlName="paidBy">
          <mat-option value="all"> All </mat-option>
          <mat-option
            *ngFor="let member of data.members"
            [value]="member.user_id"
          >
            {{ member.fullname }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field class="m-1">
        <mat-label>From date</mat-label>
        <input
          matInput
          [matDatepicker]="fromPicker"
          formControlName="fromDate"
        />
        <mat-datepicker-toggle
          matIconSuffix
          [for]="fromPicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #fromPicker></mat-datepicker>
      </mat-form-field>
      <mat-form-field class="mr-1 ml-1">
        <mat-label>To date</mat-label>
        <input matInput [matDatepicker]="toPicker" formControlName="toDate" />
        <mat-datepicker-toggle
          matIconSuffix
          [for]="toPicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #toPicker></mat-datepicker>
      </mat-form-field>
    </form>
  `,
  styles: [
    `
      form {
        width: 230px;
        height: 100%;
        background-color: #fff;
      }
    `,
  ],
})
export class FilterDialogComponent {
  data: IFilterDialog = inject(MAT_DIALOG_DATA);
  form = inject(FormBuilder).nonNullable.group(this.data.filters());

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((e) => this.handleFilter(e));
  }

  isResetVisible() {
    const { category, paidBy, fromDate, toDate } = this.form.value;

    return !(!category && paidBy === 'all' && !fromDate && !toDate);
  }

  handleReset() {
    const value = {
      category: '',
      paidBy: 'all',
      fromDate: '',
      toDate: '',
    };
    this.data.filters.set(value);
    this.form.setValue(value);
    this.handleResetFilteredTransactions();
  }

  handleResetFilteredTransactions() {
    const temp = [...this.data.transactions];
    this.data.filteredTransactions.set(
      temp.filter(({ title }) =>
        title.toLowerCase().includes(this.data.search().toLowerCase())
      )
    );
  }

  handleFilter(e: Partial<IFilter>) {
    this.handleResetFilteredTransactions();
    const { category, paidBy, fromDate, toDate } = e;
    this.data.filters.set({
      category: category!,
      paidBy: paidBy!,
      fromDate: fromDate!,
      toDate: toDate!,
    });
    let temp = [...this.data.filteredTransactions()];

    if (paidBy !== 'all') {
      temp = temp.filter(({ paid_by: { user_id } }) => user_id === paidBy);
    }

    if (category) {
      temp = temp.filter((t) =>
        t.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (fromDate) {
      temp = temp.filter(({ date }) => new Date(fromDate).getTime() <= date);
    }

    if (toDate) {
      temp = temp.filter(({ date }) => new Date(toDate).getTime() >= date);
    }

    this.data.filteredTransactions.set(temp);
  }
}
