import { Component, Input } from '@angular/core';
import IMember from './types/member.interface';

@Component({
  selector: 'app-member-card',
  template: `
    <mat-card class="align-center">
      <mat-card *ngIf="member.pending" class="badge">Pending</mat-card>
      <mat-icon aria-hidden="false" fontIcon="person"></mat-icon>
      <mat-card-content>{{ member.fullname }}</mat-card-content>
      <mat-card-content>{{ member.email }}</mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ffd740;
        padding: 5px;
      }

      mat-icon {
        font-size: 82px !important;
        width: 76px !important;
        height: 82px !important;
      }

      mat-card {
        position: relative;
      }
    `,
  ],
})
export class MemberCardComponent {
  @Input({ required: true }) member!: IMember;
}
