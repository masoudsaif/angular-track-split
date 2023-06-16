import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, catchError, throwError } from 'rxjs';
import { GroupsService } from './services/groups.service';
import { FormBuilder, Validators } from '@angular/forms';
import IResponse from '../types/response.inteface';

@Component({
  selector: 'app-add-transaction-dialog',
  template: `
    <form class="relative" [formGroup]="form" (ngSubmit)="handleSubmit()">
      <mat-progress-bar mode="indeterminate" class="fixed" *ngIf="isLoading" />
      <h2 mat-dialog-title>Add Member</h2>
      <mat-divider />
      <mat-dialog-content class="mat-typography">
        <mat-form-field class="mb-1">
          <mat-label>Email</mat-label>
          <input
            matInput
            type="text"
            placeholder="Email"
            formControlName="email"
          />
        </mat-form-field>
        <mat-error *ngIf="error">
          {{ error }}
        </mat-error>
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
  data: { group_Id: string } = inject(MAT_DIALOG_DATA);
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
