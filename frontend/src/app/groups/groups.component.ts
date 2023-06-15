import { Component } from '@angular/core';

@Component({
  selector: 'app-groups',
  template: `
    <div class="screen-margin gap-4">
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
      <app-group-card [group]="{ _id: '1', title: 'Group' }" />
    </div>
  `,
  styles: [
    `
      div {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }
    `,
  ],
})
export class GroupsComponent {}
