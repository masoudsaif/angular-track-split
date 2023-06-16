import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupsComponent } from './groups.component';
import { GroupComponent } from './group.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    pathMatch: 'full',
  },
  {
    path: ':group_id',
    component: GroupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule {}
