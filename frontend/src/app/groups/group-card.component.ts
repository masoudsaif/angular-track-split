import { Component, Input } from '@angular/core';
import IGroup from './types/group.interface';

@Component({
  selector: 'app-group-card',
  template: `
    <mat-card>
      <mat-card-content>
        <span class="flex align-center justify-between"
          >{{ group.title }}
          <button mat-raised-button color="primary">Open</button>
        </span>
      </mat-card-content>
    </mat-card>
  `,
  styles: [],
})
export class GroupCardComponent {
  @Input({ required: true }) group!: IGroup;
}
