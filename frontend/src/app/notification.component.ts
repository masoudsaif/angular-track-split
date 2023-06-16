import { Component, inject, Input, OnDestroy } from '@angular/core';
import { catchError, Subscription, throwError } from 'rxjs';

import { GroupsService } from './groups/services/groups.service';
import IGroup from './groups/types/group.interface';

@Component({
  selector: 'app-notification',
  template: `
    <div class="p-3 flex column" (click)="$event.stopPropagation()">
      <span>{{ group.title }}</span>
      <button
        mat-raised-button
        class="mt-1"
        color="primary"
        [disabled]="isLoading"
        (click)="handleClick()"
      >
        Accept
      </button>
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
export class NotificationComponent implements OnDestroy {
  @Input({ required: true }) group!: IGroup;
  @Input({ required: true }) index!: number;
  @Input() isLoading = false;
  private groupsService = inject(GroupsService);
  updateMemberPendingStatusById$: Subscription | null = null;

  handleClick() {
    this.isLoading = true;
    this.updateMemberPendingStatusById$?.unsubscribe();
    this.updateMemberPendingStatusById$ = this.groupsService
      .updateMemberPendingStatusById(this.group._id)
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
          this.groupsService.pushGroup(this.group);
          this.groupsService.removeRequest(this.index);
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.updateMemberPendingStatusById$?.unsubscribe();
  }
}
