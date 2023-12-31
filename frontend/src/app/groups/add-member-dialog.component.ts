import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, Subscription, throwError } from 'rxjs';

import IResponse from '../types/response.inteface';
import { GroupsService } from './services/groups.service';

@Component({
  selector: 'app-add-member-dialog',
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()">
      <div class="fixed full-width" *ngIf="isLoading">
        <mat-progress-bar mode="indeterminate" />
      </div>
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
          <mat-error
            *ngIf="email.errors?.['minlength'] && !email.errors?.['required']"
          >
            The minimum length for the title is <strong>3</strong>
          </mat-error>
          <mat-error *ngIf="email.errors?.['required']">
            Title is <strong>required</strong>
          </mat-error>
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
  styles: [
    `
      mat-dialog-content,
      mat-progress-bar {
        max-width: 250px;
      }
    `,
  ],
})
export class AddMemberDialogComponent implements OnDestroy {
  private dialog = inject(MatDialogRef);
  private groupsService = inject(GroupsService);
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  groupId: string = inject(MAT_DIALOG_DATA);
  addMemberSub: Subscription | null = null;
  isLoading = false;
  error = '';

  get email() {
    return this.form.controls.email;
  }

  handleSubmit() {
    this.isLoading = true;
    this.error = '';

    this.addMemberSub?.unsubscribe();
    this.addMemberSub = this.groupsService
      .addGroupMember(this.form.value.email as string, this.groupId)
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
    this.addMemberSub?.unsubscribe();
  }
}
