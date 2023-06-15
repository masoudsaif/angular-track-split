import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  template: `
    <div class="p-3 flex column" (click)="$event.stopPropagation()">
      <span>{{ title }}</span>
      <button mat-raised-button class="mt-1" color="primary">Accept</button>
    </div>
  `,
  styles: [
    `
      div {
        min-width: 140px;
      }
    `,
  ],
})
export class NotificationComponent {
  @Input({ required: true }) title!: string;
}
