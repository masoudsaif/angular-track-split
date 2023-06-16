import { Component, Input, inject } from '@angular/core';
import IGroup from './types/group.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-card',
  template: `
    <mat-card>
      <mat-card-content>
        <span class="flex align-center justify-between"
          >{{ group.title }}
          <button
            mat-raised-button
            color="primary"
            (click)="this.router.navigate(['groups', 'group', group._id])"
          >
            Open
          </button>
        </span>
      </mat-card-content>
    </mat-card>
  `,
  styles: [],
})
export class GroupCardComponent {
  @Input({ required: true }) group!: IGroup;
  router = inject(Router);
}
