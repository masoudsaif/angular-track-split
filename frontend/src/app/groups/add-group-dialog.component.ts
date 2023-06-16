import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Subscription, throwError } from 'rxjs';

import { GroupsService } from './services/groups.service';

@Component({
  selector: 'app-add-group-dialog',
  template: `
    <form class="relative" [formGroup]="form" (ngSubmit)="handleSubmit()">
      <mat-progress-bar mode="indeterminate" class="fixed" *ngIf="isLoading" />
      <h2 mat-dialog-title>Add Group</h2>
      <mat-divider />
      <mat-dialog-content class="mat-typography">
        <mat-form-field class="mb-1">
          <mat-label>Title</mat-label>
          <input
            matInput
            type="text"
            placeholder="Florida"
            formControlName="title"
          />
          <mat-error
            *ngIf="title.errors?.['minlength'] && !title.errors?.['required']"
          >
            The minimum length for the title is <strong>3</strong>
          </mat-error>
          <mat-error *ngIf="title.errors?.['required']">
            Title is <strong>required</strong>
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>
      <mat-divider />
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid || isLoading"
          (click)="handleSubmit()"
        >
          Add
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [],
})
export class AddGroupDialogComponent implements OnDestroy {
  private dialog = inject(MatDialog);
  private groupsService = inject(GroupsService);
  form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  });
  addGroup$: Subscription | null = null;
  isLoading = false;

  get title() {
    return this.form.controls.title;
  }

  handleSubmit() {
    this.isLoading = true;
    this.addGroup$?.unsubscribe();
    this.addGroup$ = this.groupsService
      .addGroup(this.title.value)
      .pipe(
        catchError(() => {
          this.isLoading = false;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        if (res.success) {
          this.groupsService.pushGroup(res.data);
          this.dialog.closeAll();
        }
      });
  }

  ngOnDestroy() {
    this.addGroup$?.unsubscribe();
  }
}
