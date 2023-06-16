import { Component, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subscription, catchError, throwError } from 'rxjs';
import { GroupsService } from './services/groups.service';
import { FormBuilder, Validators } from '@angular/forms';
import IMember from './types/member.interface';
import IResponse from '../types/response.inteface';

@Component({
  selector: 'app-add-member-dialog',
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
  styles: [],
})
export class AddMemberDialogComponent {
  private dialog = inject(MatDialogRef);
  private groupsService = inject(GroupsService);
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  addMember$: Subscription | null = null;
  isLoading = false;
  data: { group_Id: string } = inject(MAT_DIALOG_DATA);
  error = '';

  get email() {
    return this.form.controls.email;
  }

  handleSubmit() {
    this.isLoading = true;
    this.error = '';

    this.addMember$?.unsubscribe();
    this.addMember$ = this.groupsService
      .addGroupMember(this.form.value.email as string, this.data.group_Id)
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
        debugger;
        if (res.data && res.success) {
          this.dialog.close('test');
        }
      });
  }

  ngOnDestroy() {
    this.addMember$?.unsubscribe();
  }
}
