import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  template: `
    <div class="p-3">
      <span>{{ email }}</span>
      <div class="mt-1 flex gap" (click)="$event.stopPropagation()">
        <button mat-raised-button color="primary">Accept</button>
        <button mat-raised-button color="warn">Decline</button>
      </div>
    </div>
  `,
  styles: [],
})
export class NotificationComponent {
  @Input({ required: true }) email!: string;
}
