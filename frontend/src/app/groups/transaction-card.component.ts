import { Component, Input, inject } from '@angular/core';
import ITransaction from './types/transaction.interface';
import { environment as env } from 'src/environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerDialogComponent } from './image-viewer-dialog.component';

@Component({
  selector: 'app-transaction-card',
  template: `
    <mat-card>
      <img
        [src]="receiptSrc"
        alt="receipt"
        class="receipt-image"
        (click)="openImageDialog()"
      />
      <div class="mt-2">
        <div class="card-header">
          <mat-card-content class="title">{{
            transaction.title | titlecase
          }}</mat-card-content>

          <mat-card-content>{{
            transaction.amount | currency : 'USD'
          }}</mat-card-content>
        </div>
        <mat-divider />
        <div class="mt-1">
          <mat-card-content>{{
            transaction.category | titlecase
          }}</mat-card-content>
          <mat-card-content
            ><label
              class="one-line"
              [matTooltip]="transaction.description"
              matTooltipPosition="above"
            >
              {{ transaction.description }}
            </label></mat-card-content
          >
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .receipt-image {
        width: 100%;
        height: 250px;
        object-fit: contain;
      }
      .title {
        font-size: 20px;
        font-weight: 500;
        text-transform: capitalize;
      }
      .card-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }
    `,
  ],
})
export class TransactionCardComponent {
  private dialog = inject(MatDialog);
  @Input({ required: true }) transaction!: ITransaction;
  receiptSrc = '';

  ngOnInit() {
    this.receiptSrc = `${env.SERVER_URL}receipts/${this.transaction.receipt.filename}`;
  }

  openImageDialog() {
    this.dialog.open(ImageViewerDialogComponent, {
      data: this.receiptSrc,
    });
  }
}
