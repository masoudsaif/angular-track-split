import { Component, Input } from '@angular/core';
import ITransaction from './types/transaction.interface';
import { environment as env } from 'src/environments/environment.development';

@Component({
  selector: 'app-transaction-card',
  template: `
    <mat-card class="align-center">
      <img [src]="receiptSrc" alt="receipt" />
      <mat-card-content>{{ transaction.title }}</mat-card-content>
      <mat-card-content>{{ transaction.description }}</mat-card-content>
      <mat-card-content>{{ transaction.amount }}</mat-card-content>
      <mat-card-content>{{ transaction.category }}</mat-card-content>
    </mat-card>
  `,
  styles: [],
})
export class TransactionCardComponent {
  @Input({ required: true }) transaction!: ITransaction;
  receiptSrc = `${env.SERVER_URL}receipts/${this.transaction.receipt.filename}`;
  constructor() {
    console.log(this.transaction);
  }
}
