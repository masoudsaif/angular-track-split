import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, catchError, throwError } from 'rxjs';
import { GroupsService } from './services/groups.service';
import { FormBuilder, Validators } from '@angular/forms';
import IResponse from '../types/response.inteface';
import IMember from './types/member.interface';

@Component({
  selector: 'app-add-transaction-dialog',
  template: `
    <form class="relative" [formGroup]="form" (ngSubmit)="handleSubmit()">
      <mat-progress-bar mode="indeterminate" class="fixed" *ngIf="isLoading" />
      <h2 mat-dialog-title>Add Member</h2>
      <mat-divider />
      <mat-dialog-content class="mat-typography">
        <mat-form-field class="mb-1">
          <mat-label>Tile</mat-label>
          <input
            matInput
            type="text"
            placeholder="Tile"
            formControlName="title"
          />
        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Description</mat-label>
          <input
            matInput
            type="text"
            placeholder="Description"
            formControlName="description"
          />
        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Category</mat-label>
          <input
            matInput
            type="text"
            placeholder="Category"
            formControlName="category"
          />
        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Amount</mat-label>
          <input
            matInput
            type="text"
            placeholder="Amount"
            formControlName="amount"
          />
        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Choose a date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <div class="mb-1">
          <label for="receiptName">Receipt</label>
          <input
            name="receiptName"
            type="file"
            placeholder="Amount"
            formControlName="receipt"
          />
        </div>
      </mat-dialog-content>
      <mat-divider />
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid || isLoading"
        >
          Add
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [],
})
export class AddTransactionDialogComponent {
  private dialog = inject(MatDialogRef);
  private groupsService = inject(GroupsService);
  form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    paid_by: ['', [Validators.required]],
    category: ['', [Validators.required]],
    amount: [null, [Validators.required]],
    date: [null, [Validators.required]],
    receipt: ['', [Validators.required]],
  });
  addTransaction$: Subscription | null = null;
  isLoading = false;
  data: { group_Id: string; group_members: IMember[] } =
    inject(MAT_DIALOG_DATA);
  error = '';

  get title() {
    return;
  }

  get description() {
    return;
  }

  get paid_by() {
    return;
  }

  get category() {
    return;
  }

  get amount() {
    return;
  }

  get date() {
    return;
  }

  get receipt() {
    return;
  }

  handleSubmit() {
    this.isLoading = true;
    this.error = '';

    this.addTransaction$?.unsubscribe();
    this.addTransaction$ = this.groupsService
      .addTransactions({}, this.data.group_Id)
      .pipe(
        catchError((e) => {
          this.error = e.error.data;
          this.isLoading = false;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res: IResponse<Boolean>) => {
        this.dialog.close(res.data && res.success);
      });
  }

  ngOnDestroy() {
    this.addTransaction$?.unsubscribe();
  }
}
