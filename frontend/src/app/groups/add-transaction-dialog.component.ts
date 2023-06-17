import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';

import { GroupsService } from './services/groups.service';
import IResponse from '../types/response.inteface';

@Component({
  selector: 'app-add-transaction-dialog',
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()">
      <div class="fixed full-width" *ngIf="isLoading">
        <mat-progress-bar mode="indeterminate" />
      </div>
      <h2 mat-dialog-title>Add Transaction</h2>
      <mat-divider />
      <mat-dialog-content class="mat-typography">
        <mat-form-field class="mb-1">
          <mat-label>Title</mat-label>
          <input matInput type="text" formControlName="title" />
          <mat-error *ngIf="title.errors?.['required']">
            Title is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Description</mat-label>
          <input matInput type="text" formControlName="description" />
          <mat-error *ngIf="description.errors?.['required']">
            Description is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Category</mat-label>
          <input matInput type="text" formControlName="category" />
          <mat-error *ngIf="category.errors?.['required']">
            Category is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Amount</mat-label>
          <input matInput type="number" formControlName="amount" />
          <mat-error
            *ngIf="amount.errors?.['min'] && !amount.errors?.['required']"
          >
            Minimum amount is <strong>0.1</strong>
          </mat-error>
          <mat-error *ngIf="amount.errors?.['required']">
            Amount is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Choose a date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" />
          <mat-error *ngIf="date.errors?.['required']">
            Date is <strong>required</strong>
          </mat-error>
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <div class="mb-1">
          <label>Receipt</label>
          <div class="mt-1">
            <button
              mat-raised-button
              type="button"
              color="primary"
              (click)="fileInput.click()"
              (blur)="handleReceiptBlur()"
            >
              Choose File
            </button>
          </div>
          <label class="text-ellipsis mt-1 one-line" *ngIf="receipt">{{
            receipt
          }}</label>
          <mat-error class="mt-1" *ngIf="error">
            {{ error }}
          </mat-error>
          <input
            hidden
            #fileInput
            type="file"
            accept="image/jpeg"
            (change)="handleReceiptChange($event)"
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
  styles: [
    `
      mat-dialog-content,
      mat-progress-bar {
        max-width: 300px;
      }
    `,
  ],
})
export class AddTransactionDialogComponent implements OnDestroy {
  private dialog = inject(MatDialogRef);
  private activeRoute = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);
  form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.1)]],
    date: ['', [Validators.required]],
  });
  groupId = this.activeRoute.snapshot.paramMap.get('group_id') as string;
  receipt = '';
  receiptSource: File | null = null;
  addTransaction$: Subscription | null = null;
  isLoading = false;
  error = '';

  get title() {
    return this.form.controls.title;
  }

  get description() {
    return this.form.controls.description;
  }

  get category() {
    return this.form.controls.category;
  }

  get amount() {
    return this.form.controls.amount;
  }

  get date() {
    return this.form.controls.date;
  }

  handleReceiptBlur() {
    if (this.receiptSource === null) {
      this.error = 'Receipt is required!';
    }
  }

  handleReceiptChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.receipt = target.files[0].name;
      this.receiptSource = target.files[0];
      this.error = '';
    }
  }

  handleSubmit() {
    console.log(this.form.value, this.receipt, this.receiptSource);
    const formData = new FormData();
    this.isLoading = true;
    this.error = '';
    this.addTransaction$?.unsubscribe();
    this.addTransaction$ = this.groupsService
      .addTransactions(formData, this.groupId)
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
